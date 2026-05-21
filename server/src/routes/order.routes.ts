import { Router } from 'express';
import { listOrders, getOrder, createOrder, updateOrderStatus } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { createOrderValidator } from '../validators/order';

const router = Router();

router.get('/', authenticate, listOrders);
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, authorize('customer'), createOrderValidator, createOrder);
router.put('/:id/status', authenticate, authorize('vendor', 'admin'), updateOrderStatus);

export default router;
