import {Request, Response} from 'express';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from "../models/user";

const {Strategy: JwtStrategy, ExtractJwt} = passportJWT;

const jwtSecret = crypto.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
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

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: `User not found.` });
            }

            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    return res.status(500).json({ error: `A serverside error has occurred: ${error}` });
                }

                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid password.' });
                }

                // Password matches, generate tokens
                const accessToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
                const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret, { expiresIn: '24h' });

                res.status(200).json({ accessToken, refreshToken });
            });
        }).catch((error) => {
        res.status(500).json({ error: `Internal server error: ${error}` });
    });
}


export function authenticateToken(req: Request, res: Response, next: any) {
    passport.authenticate('jwt', {session: false}, (error: any, user: any, info: any) => {
        if (error) {
            return res.status(401).json({error: `Unauthorized: ${error}`});
        }
        if (!user) {
            return res.status(401).json({error: 'Unauthorized'});
        }
        req.user = user;
        next();
    })(req, res, next);
}