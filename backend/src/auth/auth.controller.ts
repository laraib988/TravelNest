import { Controller, Post, Get, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const { name, email, password } = body;
    if (!name || !email || !password) throw new BadRequestException('Missing fields');
    return this.authService.register(name, email, password);
  }

  @Post('login')
  login(@Body() body: any) {
    const { email, password } = body;
    const result = this.authService.login(email, password);
    if (!result) throw new UnauthorizedException('Invalid credentials');
    return result;
  }

  @Post('refresh')
  refresh() {
    return { access_token: this.authService.generateToken('cust-1') };
  }

  @Get('me')
  getMe() {
    return this.authService.getMe();
  }
}
