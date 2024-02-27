import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import  dotenv  from 'dotenv';
dotenv.config();

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log("toen", accessToken);
        console.log(profile);
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user.id);
  });