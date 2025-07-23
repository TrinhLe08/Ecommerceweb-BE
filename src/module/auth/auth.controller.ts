import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    // The passport middleware will redirect to Facebook
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req: Request, @Res() res: Response) {
    // Handle the response after Facebook authentication
    // For example, create JWT token or session
    // Here we just redirect with the user info
    res.redirect(`/profile?user=${JSON.stringify(req.user)}`);
  }
}