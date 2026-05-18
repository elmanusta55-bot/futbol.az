import express from 'express';

const router = express.Router();

// ── Payment routes (placeholder – requires Stripe keys) ─────────────────────

router.post('/create-checkout', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ error: 'Payment service not configured' });
    }

    const { plan } = req.body;
    if (!plan) {
      return res.status(400).json({ error: 'Plan is required' });
    }

    // Placeholder: return info that payments are not yet active
    res.json({
      message: 'Payment system is under maintenance',
      status: 'inactive',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', (req, res) => {
  res.json({
    active: !!process.env.STRIPE_SECRET_KEY,
    message: process.env.STRIPE_SECRET_KEY
      ? 'Payment system is active'
      : 'Payment system is not configured',
  });
});

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // Stripe webhook placeholder
  res.json({ received: true });
});

export default router;
