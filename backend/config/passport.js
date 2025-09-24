import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = await User.create({
                    userId: uuidv4(),
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                });
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    })
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
