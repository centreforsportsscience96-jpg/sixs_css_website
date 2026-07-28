import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Centre for Sports Science API is running',
    db_type: 'Supabase (Postgres)',
  });
});

export default router;
