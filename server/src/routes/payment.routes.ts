import { Router } from 'express';
import { initializePayment, verifyPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.post('/initialize', authenticate, authorize('customer'), initializePayment);
router.get('/verify', authenticate, verifyPayment);

export default router;
