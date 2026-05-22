import { Request, Response } from 'express';
import { AuthFacade } from './auth.facade';

export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  register = async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({
      message: "Auth register not implemented yet"
    });
  };
}
