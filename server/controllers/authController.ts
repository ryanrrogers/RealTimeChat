import { Request, Response } from 'express';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from "../models/user";

const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;

const authTokenSecret = crypto.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');

const jwtAuthOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: authTokenSecret
};

passport.use(new JwtStrategy(jwtAuthOptions, (payload, done) => {
    User.findById(payload.userId)
        .then((user) => {
            return done(null, user ?? false);
        })
        .catch((error) => {
            return done(error, false);
        })
}));

export async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        const accessToken = jwt.sign({ userId: user._id }, authTokenSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret, { expiresIn: '24h' });

        // res.cookie('Authorization', accessToken, { httpOnly: false, secure: false });
        // res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: false });

        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            userID: user._id
        });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
}


export function authenticateToken(req: Request, res: Response, next: any) {
    passport.authenticate('jwt', { session: false }, async (error: any, user: any, info: any) => {
        if (error) {
            return res.status(401).json({ error: `Unauthorized: ${error}` });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const accessToken = jwt.sign({ userId: user._id }, authTokenSecret, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret, { expiresIn: '24h' });

            // Set the new tokens in the response headers or cookies
            res.cookie('Authorization', accessToken, { httpOnly: false, secure: false });
            res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: false });

            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    })(req, res, next);
}