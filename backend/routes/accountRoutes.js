import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
  getBalance, 
  getStatement, 
  transferMoney, 
  getUsers 
} from '../controllers/accountController.js';

const router = express.Router();

router.get('/balance', protect, getBalance);
router.get('/statement', protect, getStatement);
router.post('/transfer', protect, transferMoney);
router.get('/users', protect, getUsers);

export default router;