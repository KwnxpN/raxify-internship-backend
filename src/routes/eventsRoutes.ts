import express, { type Router } from 'express';
import { getAllEvents, getEventById, createEvent, updateRegisteredCount } from '../controllers/eventsControllers.js';

const router: Router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.patch('/:id/register', updateRegisteredCount);
router.post('/', createEvent);

export default router;