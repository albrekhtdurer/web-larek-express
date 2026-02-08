import { Router } from 'express';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products';

import { validateProductBody, validateProductUpdateBody } from '../middlewares/validators';

const router = Router();

router.get('/', getProducts);

router.post('/', validateProductBody, createProduct);

router.patch('/:productId', validateProductUpdateBody, updateProduct);

router.delete('/:productId', deleteProduct);

export default router;
