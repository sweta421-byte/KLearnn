import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

class RegisterDto {
  email: string;
  password: string;
  name: string;
  role: string;
}

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.validateUser(body.email, body.password).then(user => {
      if (!user) throw new Error('Invalid credentials');
      return this.authService.login(user);
    });
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(
      body.email,
      body.password,
      body.name,
      body.role,
    );
  }
}