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
const authTokenSecret = crypto_1.default.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto_1.default.randomBytes(32).toString('hex');
const jwtAuthOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: authTokenSecret
};
passport_1.default.use(new JwtStrategy(jwtAuthOptions, (payload, done) => {
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
        try {
            const user = yield user_1.default.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password.' });
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, authTokenSecret, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, refreshTokenSecret, { expiresIn: '24h' });
            // res.cookie('Authorization', accessToken, { httpOnly: false, secure: false });
            // res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: false });
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                userID: user._id
            });
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.authenticate = authenticate;
function authenticateToken(req, res, next) {
    passport_1.default.authenticate('jwt', { session: false }, (error, user, info) => __awaiter(this, void 0, void 0, function* () {
        if (error) {
            return res.status(401).json({ error: `Unauthorized: ${error}` });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, authTokenSecret, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, refreshTokenSecret, { expiresIn: '24h' });
            // Set the new tokens in the response headers or cookies
            res.cookie('Authorization', accessToken, { httpOnly: false, secure: false });
            res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: false });
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }))(req, res, next);
}
exports.authenticateToken = authenticateToken;
