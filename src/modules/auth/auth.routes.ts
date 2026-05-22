import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

const router = Router();

const repository = new AuthRepository();
const service = new AuthService(repository);
const facade = new AuthFacade(service);
const controller = new AuthController(facade);

router.post('/register', controller.register);

export default router;
