import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${username}`);
    
    try {
      const user = await this.authService.validateUser(username, password);
      
      if (!user) {
        this.logger.warn(`Validation failed for user: ${username}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.debug(`User ${username} validated successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Validation error for ${username}: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}