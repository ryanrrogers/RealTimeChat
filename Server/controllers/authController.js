"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.authenticate = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const { Strategy: JwtStrategy, ExtractJwt } = passport_jwt_1.default;
const jwtSecret = crypto_1.default.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto_1.default.randomBytes(32).toString('hex');
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};
passport_1.default.use(new JwtStrategy(jwtOptions, (payload, done) => {
    user_1.default.findById(payload.userId)
        .then((user) => {
        return done(null, user !== null && user !== void 0 ? user : false);
    })
        .catch((error) => {
        return done(error, false);
    });
}));
function authenticate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        user_1.default.findOne({ email })
            .then((user) => {
            if (!user) {
                return res.status(404).json({ error: `User not found.` });
            }
            bcrypt_1.default.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    return res.status(500).json({ error: `A serverside error has occurred: ${error}` });
                }
                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid password.' });
                }
                // Password matches, generate tokens
                const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
                const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, refreshTokenSecret, { expiresIn: '24h' });
                res.status(200).json({ accessToken, refreshToken });
            });
        }).catch((error) => {
            res.status(500).json({ error: `Internal server error: ${error}` });
        });
    });
}
exports.authenticate = authenticate;
function authenticateToken(req, res, next) {
    passport_1.default.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(401).json({ error: `Unauthorized: ${error}` });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
}
exports.authenticateToken = authenticateToken;
