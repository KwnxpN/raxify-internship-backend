import express, { type Router } from 'express';
import { getAllEvents, getEventById } from '../controllers/eventsControllers.js';

const router: Router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);

export default router;