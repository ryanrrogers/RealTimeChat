"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/post', userController_1.createUser);
router.get('/get/:displayName?', authController_1.authenticateToken, userController_1.getUser);
router.put('/put/:displayName', authController_1.authenticateToken, userController_1.updateUser);
router.put('/deactivate/:displayName', authController_1.authenticateToken, userController_1.deactivateUser);
exports.default = router;
