import express from 'express';
import FantasyLeague from '../models/FantasyLeague.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// ── GET ALL LEAGUES ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const leagues = await FantasyLeague.find({ status: { $ne: 'draft' } })
      .select('-participants')
      .sort({ createdAt: -1 });
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET LEAGUE DETAILS ────────────────────────────────────────────────────────
router.get('/:leagueId', async (req, res) => {
  try {
    const league = await FantasyLeague.findById(req.params.leagueId);
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }
    res.json(league);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── CREATE LEAGUE (ADMIN) ────────────────────────────────────────────────────────
router.post('/create', adminAuth, async (req, res) => {
  try {
    const { name, description, entryFee, maxParticipants, startDate, endDate } =
      req.body;

    const league = await FantasyLeague.create({
      name,
      description,
      entryFee,
      maxParticipants,
      startDate,
      endDate,
      status: 'active',
    });

    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── JOIN LEAGUE ────────────────────────────────────────────────────────
router.post('/:leagueId/join', auth, async (req, res) => {
  try {
    const league = await FantasyLeague.findById(req.params.leagueId);

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    // Check if already joined
    const alreadyJoined = league.participants.some(
      (p) => p.userId.toString() === req.user.userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ error: 'Already joined this league' });
    }

    // Check capacity
    if (league.participants.length >= league.maxParticipants) {
      return res.status(400).json({ error: 'League is full' });
    }

    // Add participant
    league.participants.push({
      userId: req.user.userId,
      squad: [],
      formation: '4-3-3',
      totalPoints: 0,
    });

    // Update prize pool
    league.prizePool.total += league.entryFee;

    await league.save();

    // Record transaction
    await Transaction.create({
      userId: req.user.userId,
      type: 'fantasy_entry',
      amount: league.entryFee,
      status: 'completed',
      description: `Joined league: ${league.name}`,
      fantasyLeagueId: league._id,
    });

    res.json({ message: 'Successfully joined league', league });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── UPDATE SQUAD ────────────────────────────────────────────────────────
router.put('/:leagueId/squad', auth, async (req, res) => {
  try {
    const { squad, formation } = req.body;
    const league = await FantasyLeague.findById(req.params.leagueId);

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    const participant = league.participants.find(
      (p) => p.userId.toString() === req.user.userId
    );

    if (!participant) {
      return res.status(400).json({ error: 'Not in this league' });
    }

    // Validation: Budget cap (100 points)
    const totalCost = squad.reduce((sum, player) => sum + player.cost, 0);
    if (totalCost > 100) {
      return res.status(400).json({ error: 'Squad cost exceeds budget' });
    }

    // Validation: Max 3 from same club
    const clubCounts = {};
    for (const player of squad) {
      clubCounts[player.teamId] = (clubCounts[player.teamId] || 0) + 1;
      if (clubCounts[player.teamId] > 3) {
        return res
          .status(400)
          .json({ error: 'Maximum 3 players from same club' });
      }
    }

    participant.squad = squad;
    participant.formation = formation;

    await league.save();

    res.json({ message: 'Squad updated', participant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET LEADERBOARD ────────────────────────────────────────────────────────
router.get('/:leagueId/leaderboard', async (req, res) => {
  try {
    const league = await FantasyLeague.findById(req.params.leagueId)
      .populate('participants.userId', 'username email');

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    const leaderboard = league.participants
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((p, index) => ({
        rank: index + 1,
        user: p.userId,
        points: p.totalPoints,
        squad: p.squad,
        formation: p.formation,
      }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── FINISH LEAGUE & DISTRIBUTE PRIZES (ADMIN) ────────────────────────────────────────
router.post('/:leagueId/finish', adminAuth, async (req, res) => {
  try {
    const league = await FantasyLeague.findById(req.params.leagueId);

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    if (league.status === 'finished') {
      return res.status(400).json({ error: 'League already finished' });
    }

    // Sort by points
    const sorted = league.participants.sort(
      (a, b) => b.totalPoints - a.totalPoints
    );

    // Calculate prize distribution (70% goes to players)
    const totalPrize = league.prizePool.total * 0.7;
    const distribution = [
      { rank: 1, percent: 0.5 }, // 50%
      { rank: 2, percent: 0.3 }, // 30%
      { rank: 3, percent: 0.15 }, // 15%
      { rank: 4, percent: 0.05 }, // 5%
    ];

    league.prizePool.distribution = [];

    for (let i = 0; i < Math.min(4, sorted.length); i++) {
      const dist = distribution[i];
      const amount = totalPrize * dist.percent;

      league.prizePool.distribution.push({
        rank: dist.rank,
        amount,
        userId: sorted[i].userId,
      });

      // Create payout transaction
      await Transaction.create({
        userId: sorted[i].userId,
        type: 'payout',
        amount,
        status: 'completed',
        description: `Prize payout - Rank #${dist.rank} in ${league.name}`,
        fantasyLeagueId: league._id,
      });
    }

    league.status = 'finished';
    league.prizePool.distributed = true;

    await league.save();

    res.json({
      message: 'League finished, prizes distributed',
      distribution: league.prizePool.distribution,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
