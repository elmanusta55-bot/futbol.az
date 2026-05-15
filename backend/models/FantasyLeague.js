import mongoose from 'mongoose';

const fantasyLeagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    entryFee: {
      type: Number,
      default: 5,
    },
    maxParticipants: {
      type: Number,
      default: 100,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        squad: [
          {
            playerId: String,
            playerName: String,
            position: String,
            teamId: String,
            cost: Number,
          },
        ],
        formation: {
          type: String,
          enum: ['4-3-3', '4-4-2', '3-5-2'],
        },
        totalPoints: { type: Number, default: 0 },
        rank: Number,
      },
    ],
    prizePool: {
      total: { type: Number, default: 0 },
      distributed: { type: Boolean, default: false },
      distribution: [
        {
          rank: Number,
          amount: Number,
          userId: mongoose.Schema.Types.ObjectId,
        },
      ],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'finished'],
      default: 'draft',
    },
    startDate: Date,
    endDate: Date,
    scoringRules: {
      goal: { type: Number, default: 5 },
      assist: { type: Number, default: 3 },
      cleanSheet: { type: Number, default: 1 },
      yellowCard: { type: Number, default: -1 },
      redCard: { type: Number, default: -3 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('FantasyLeague', fantasyLeagueSchema);
