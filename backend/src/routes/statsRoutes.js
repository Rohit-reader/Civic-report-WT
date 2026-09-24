import express from 'express';
import { getOverviewStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/overview', getOverviewStats);

export default router;
