import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

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
      const user = await User.findByPk(payload.id)
      if(!user)
        return done(null, false)
      return done(null, {
        id: payload.id
      });
    }
  )
);

export default passport;