import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials
   * @param username - User's username
   * @param password - User's password
   * @returns User object without password or null if invalid
   */
  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.usersService.findOne(username);

      if (!user) {
        this.logger.debug(`User ${username} not found`);
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        this.logger.debug(`Invalid password for user ${username}`);
        return null;
      }

      // Remove password from returned user object
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`Validation error: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  /**
   * Logs in a user and generates JWT token
   * @param user - Authenticated user
   * @returns Object containing access token and user data
   */
  async login(user: User): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    try {
      const payload = {
        username: user.username,
        sub: user.id,  // Standard JWT subject claim
      };

      // Create user object without password
      const { password, ...userWithoutPassword } = user;

      return {
        access_token: this.jwtService.sign(payload),
        user: userWithoutPassword
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw new UnauthorizedException('Could not generate token');
    }
  }

  /**
   * Registers a new user
   * @param createUserDto - User registration data
   * @returns Created user without password
   */
  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {    
      const user = await this.usersService.create(createUserDto);
      
      // Return user without password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw new UnauthorizedException('Registration failed');
    }
  }

  /**
   * Verifies JWT token validity
   * @param token - JWT token to verify
   * @returns User data if token is valid
   */
  async verifyToken(token: string): Promise<Omit<User, 'password'>> {
    try {
      // Verify token signature and expiration
      const payload = this.jwtService.verify(token);
      
      // Verify user still exists
      const user = await this.usersService.findOne(payload.username);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Return user without password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}