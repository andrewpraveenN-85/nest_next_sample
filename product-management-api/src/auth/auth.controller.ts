import { Controller, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    const { access_token, user } = await this.authService.login(req.user);
    
    // Cookie settings for localhost development
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, // Disabled for HTTP
      sameSite: 'lax', // More flexible than 'strict' for local testing
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: 'localhost' // Explicitly set for localhost
    });

    return res.status(200).json({ user });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // Disabled for HTTP
      sameSite: 'lax',
      domain: 'localhost'
    });
    
    return res.status(200).json({ message: 'Logout successful' });
  }

  @Public()
  @Post('verify')
  async verifyToken(@Request() req, @Res() res: Response) {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return res.status(401).json({ valid: false });
      }

      const user = await this.authService.verifyToken(token);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(401).json({ valid: false });
    }
  }
}