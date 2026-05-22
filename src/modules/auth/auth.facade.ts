import { AuthService } from './auth.service';

export class AuthFacade {
  constructor(private readonly authService: AuthService) {}
}
