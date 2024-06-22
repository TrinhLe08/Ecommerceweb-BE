import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { HttpStatus } from 'src/global/globalEnum';
import { JwtService } from 'src/global/gobalJwt';

@Injectable()
export class CheckTokenUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    const tokenVetify = this.jwtService.verify(token);
    if (tokenVetify) {
      try {
        next();
      } catch (error) {
        return new ResponseData<string>(
          'Wrong Token !',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } else if (token === undefined) {
      return new ResponseData<string>(
        'Wrong or missing Token !',
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
