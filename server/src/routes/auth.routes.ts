import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { registerValidator, loginValidator } from '../validators/auth';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
