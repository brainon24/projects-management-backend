import { Body, Controller, Get, Post, Req, UseGuards, Param, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { signUpDto, LoginDto, ForgotPasswordDto, ValidateResetTokenDto, ResetPasswordDto } from './dto/auth-dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() payload: signUpDto) {
    return this.authService.signUp(payload);
  }

  @Post('/login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('/forgotPassword')
  @HttpCode(200)
  forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }

  @Post('/validateToken')
  @HttpCode(200)
  validateResetToken(@Body() payload: ValidateResetTokenDto) {
    return this.authService.validateResetTokenEndpoint(payload);
  }

  @Post('/reset-password')
  @HttpCode(200)
  resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload);
  }

  @Get('/debug-tokens')
  @HttpCode(200)
  debugTokens() {
    return this.authService.debugTokens();
  }

  @Post('/force-ttl-index')
  @HttpCode(200)
  forceTTLIndex() {
    return this.authService.forceTTLIndex();
  }

  @Get('/checkToken')
  checkToken(@Req() req: any) {
    return this.authService.checkToken(req);
  }

  @Get('/private')
  @UseGuards(AuthGuard())
  testPrivateRoute() {
    return {
      ok: true,
      msg: 'Hola mundo desde el lado privado...',
    };
  }
}
