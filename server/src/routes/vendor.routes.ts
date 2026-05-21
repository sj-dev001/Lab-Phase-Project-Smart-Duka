import { Router } from 'express';
import {
  registerVendor,
  getVendorProducts,
  getVendorOrders,
} from '../controllers/vendor.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.post('/register', authenticate, authorize('customer'), registerVendor);
router.get('/:id/products', getVendorProducts);
router.get('/:id/orders', authenticate, authorize('vendor', 'admin'), getVendorOrders);

export default router;
