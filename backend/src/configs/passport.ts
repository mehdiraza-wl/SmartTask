import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET as string,
    },
    async (payload: JwtPayload, done) => {
      return done(null, {
        id: payload.id
      });
    }
  )
);

export default passport;