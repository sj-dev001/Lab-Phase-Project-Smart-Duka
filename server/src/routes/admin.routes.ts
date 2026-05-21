import { Router } from 'express';
import {
  listUsers,
  updateUser,
  listPendingVendors,
  approveVendor,
  getAnalytics,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.get('/users', authenticate, authorize('admin'), listUsers);
router.put('/users/:id', authenticate, authorize('admin'), updateUser);
router.get('/vendors/pending', authenticate, authorize('admin'), listPendingVendors);
router.put('/vendors/:id', authenticate, authorize('admin'), approveVendor);
router.get('/analytics', authenticate, authorize('admin'), getAnalytics);

export default router;
