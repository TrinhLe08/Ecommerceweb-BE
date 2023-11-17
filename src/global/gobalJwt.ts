import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  sign(payload: any): string {
    return jwt.sign(payload, 'key');
  }

  verify(token: string) {
    return jwt.verify(token, 'key');
  }
}
