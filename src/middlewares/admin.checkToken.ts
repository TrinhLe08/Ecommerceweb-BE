import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { HttpStatus } from 'src/global/globalEnum';
import { JwtService } from 'src/global/gobalJwt';

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      try {
        this.jwtService.verify(token);
        next();
      } catch (error) {
        return new ResponseData<string>(
          'Wrong Token !',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } else {
      return new ResponseData<string>(
        'Wrong Token !',
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
