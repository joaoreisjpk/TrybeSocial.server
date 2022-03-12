import { Router } from 'express';

const router = Router();

router.post('/', () => console.log('koe'));

export { router as AuthRouter };
