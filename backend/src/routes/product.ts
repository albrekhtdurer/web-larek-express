import { Router } from 'express';

import { getProducts, createProduct, updateProduct } from '../controllers/products';

import { validateProductBody, validateProductUpdateBody } from '../middlewares/validators';

const router = Router();

router.get('/', getProducts);

router.post('/', validateProductBody, createProduct);

router.patch('/:productId', validateProductUpdateBody, updateProduct);

export default router;
