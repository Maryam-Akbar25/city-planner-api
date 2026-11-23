//all plan api routes are protected by JWT middleware, ensuring only authenticated users can access them.s
import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from '../controllers/planController.js';

const router = Router();

// Protect all /api/plans routes with JWT middleware
router.use(verifyToken);

router.post('/', createPlan);
router.get('/', getPlans);
router.get('/:id', getPlanById);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;