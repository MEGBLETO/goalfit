import express, { Request, Response, NextFunction } from "express";
import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './controllers/auth';
// import recoveryRoutes from './controllers/recovery';
import bodyParser from "body-parser";
import art from './art';

const app = express();

app.use(bodyParser.json());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

app.use('/authenticate', authRoutes);
// app.use('/recovery', recoveryRoutes);

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(art);
  console.log(`Server is running on port ${PORT}`);
});


