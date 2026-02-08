import { Router } from 'express';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products';

import { validateProductBody, validateProductUpdateBody } from '../middlewares/validators';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);

router.post('/', auth, validateProductBody, createProduct);

router.patch('/:productId', auth, validateProductUpdateBody, updateProduct);

router.delete('/:productId', auth, deleteProduct);

export default router;
