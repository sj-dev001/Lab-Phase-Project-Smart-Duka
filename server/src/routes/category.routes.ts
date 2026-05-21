import { Router, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import Category from '../models/Category';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, data: categories });
});

router.get('/:id', async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  res.json({ success: true, data: category });
});

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category, message: 'Category created' });
  }
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.json({ success: true, data: category, message: 'Category updated' });
  }
);

router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  res.json({ success: true, message: 'Category deleted' });
});

export default router;
