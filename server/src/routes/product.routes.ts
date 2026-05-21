import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { createProductValidator, updateProductValidator } from '../validators/product';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, authorize('vendor', 'admin'), createProductValidator, createProduct);
router.put('/:id', authenticate, authorize('vendor', 'admin'), updateProductValidator, updateProduct);
router.delete('/:id', authenticate, authorize('vendor', 'admin'), deleteProduct);

export default router;
