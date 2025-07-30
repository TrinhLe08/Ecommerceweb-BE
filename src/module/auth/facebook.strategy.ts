import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {

  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
      scope: 'email',
      profileFields: ['emails', 'name', 'displayName', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      email: emails?.[0]?.value || `${id}@facebook.nomail`,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}