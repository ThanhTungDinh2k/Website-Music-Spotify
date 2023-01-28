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
exports.updateUser = exports.deleteUser = exports.createUser = exports.getAllUserAdmin = exports.getInfoUser = exports.seedUser = exports.register = exports.login = void 0;
const jwt_1 = require("./../utils/jwt");
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_2 = require("../data/user");
dotenv_1.default.config();
const EXP_REFRESH_TOKEN = process.env.HASH_ROUNDS
    ? Number(process.env.HASH_ROUNDS)
    : 12;
console.log({ EXP_REFRESH_TOKEN });
const generateTokenUser = (user) => {
    const userResponse = {
        _id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        schoolId: user.schoolId,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
    };
    return [(0, jwt_1.generateToken)(userResponse), (0, jwt_1.generateRefreshToken)(userResponse)];
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email }).exec();
        if (!user)
            throw new Error('Not Found Email');
        if (!(yield user.validatePassword(password)))
            throw new Error('incorrect password');
        const [accessToken, refreshToken] = generateTokenUser(user);
        yield (0, jwt_1.validateToken)(accessToken);
        return res.json({
            accessToken,
            refreshToken,
            userInfo: user,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, lastName, firstName, schoolId, password, dateOfBirth } = req.body;
        const user = new user_1.default({
            lastName,
            firstName,
            email,
            schoolId,
            dateOfBirth,
            passHash: password,
        });
        yield user.save();
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.register = register;
const seedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.remove();
        user_2.users.forEach((x) => __awaiter(void 0, void 0, void 0, function* () {
            const user = new user_1.default(x);
            yield user.save();
        }));
        return res.json(yield user_1.default.find());
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.seedUser = seedUser;
const getInfoUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req;
        return res.json(user.user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getInfoUser = getInfoUser;
const getAllUserAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userReq = req;
        const users = yield user_1.default.find({ _id: { $ne: (_a = userReq.user) === null || _a === void 0 ? void 0 : _a._id } });
        return res.json(users);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getAllUserAdmin = getAllUserAdmin;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(new Date(req.body.dateOfBirth));
        const user = new user_1.default(Object.assign(Object.assign({}, req.body), { passHash: req.body.password }));
        yield user.save();
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.createUser = createUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_1.default.findByIdAndRemove(id);
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_1.default.findByIdAndUpdate(id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
        });
        if (!user)
            throw new Error('not found user');
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
