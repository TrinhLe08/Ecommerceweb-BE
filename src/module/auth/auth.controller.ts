import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
  }

  @Get('facebook/redirect') 
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req, @Res() res) {
    const user = req.user; 
    console.log('User data:', user);
    
    // Redirect về FE kèm dữ liệu (ví dụ: token)
    res.redirect(`http://localhost:3000?token=${user.accessToken}`);
  }
}