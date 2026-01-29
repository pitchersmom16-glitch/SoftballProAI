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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
exports.getSession = getSession;
exports.setupAuth = setupAuth;
exports.registerAuthRoutes = registerAuthRoutes;
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
var storage_1 = require("../storage");
// Simple local authentication for development
function getSession() {
    var sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    var pgStore = (0, connect_pg_simple_1.default)(express_session_1.default);
    var sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: false,
        ttl: sessionTtl,
        tableName: "sessions",
    });
    return (0, express_session_1.default)({
        secret: process.env.SESSION_SECRET || "softball-pro-ai-secret-key-change-in-production",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: sessionTtl,
        },
    });
}
function setupAuth(app) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            app.set("trust proxy", 1);
            app.use(getSession());
            app.use(passport_1.default.initialize());
            app.use(passport_1.default.session());
            // Local strategy for development
            passport_1.default.use(new passport_local_1.Strategy({
                usernameField: "email",
                passwordField: "password",
            }, function (email, password, done) { return __awaiter(_this, void 0, void 0, function () {
                var userId, user, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            userId = email;
                            // Ensure user exists in database
                            return [4 /*yield*/, storage_1.storage.upsertUser({
                                    id: userId,
                                    email: email,
                                    firstName: "Dev",
                                    lastName: "User",
                                })];
                        case 1:
                            // Ensure user exists in database
                            _a.sent();
                            user = {
                                claims: {
                                    sub: userId,
                                    email: email,
                                    given_name: "Dev",
                                    family_name: "User",
                                    first_name: "Dev",
                                    last_name: "User",
                                },
                            };
                            return [2 /*return*/, done(null, user)];
                        case 2:
                            error_1 = _a.sent();
                            return [2 /*return*/, done(error_1)];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }));
            passport_1.default.serializeUser(function (user, cb) { return cb(null, user); });
            passport_1.default.deserializeUser(function (user, cb) { return cb(null, user); });
            // Login route
            app.post("/api/login", function (req, res, next) {
                passport_1.default.authenticate("local", function (err, user, info) {
                    if (err)
                        return next(err);
                    if (!user)
                        return res.status(401).json({ message: "Authentication failed" });
                    req.logIn(user, function (err) {
                        if (err)
                            return next(err);
                        res.json({ success: true, user: user });
                    });
                })(req, res, next);
            });
            // Auto-login route for development
            app.get("/api/login", function (req, res) {
                if (req.isAuthenticated()) {
                    return res.redirect("/");
                }
                // Auto-login as dev user
                var userId = "dev-user-" + Date.now();
                req.logIn({ claims: { sub: userId, email: "dev@softballproai.com", given_name: "Dev", family_name: "User", first_name: "Dev", last_name: "User" } }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err)
                                    return [2 /*return*/, res.status(500).json({ message: "Auto-login failed" })];
                                // Ensure user exists in database
                                return [4 /*yield*/, storage_1.storage.upsertUser({
                                        id: userId,
                                        email: "dev@softballproai.com",
                                        firstName: "Dev",
                                        lastName: "User",
                                    })];
                            case 1:
                                // Ensure user exists in database
                                _a.sent();
                                res.redirect("/");
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            // Logout route
            app.get("/api/logout", function (req, res) {
                req.logout(function () {
                    res.redirect("/");
                });
            });
            // Current user route
            app.get("/api/user", function (req, res) {
                if (req.isAuthenticated()) {
                    res.json(req.user);
                }
                else {
                    res.status(401).json({ message: "Not authenticated" });
                }
            });
            return [2 /*return*/];
        });
    });
}
var isAuthenticated = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!req.isAuthenticated()) {
            return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
        }
        next();
        return [2 /*return*/];
    });
}); };
exports.isAuthenticated = isAuthenticated;
// Helper function to register additional auth routes
function registerAuthRoutes(app) {
    var _this = this;
    // Get current authenticated user
    app.get("/api/auth/user", exports.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.claims.sub;
                    return [4 /*yield*/, storage_1.storage.getUser(userId)];
                case 1:
                    user = _a.sent();
                    res.json(user);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error fetching user:", error_2);
                    res.status(500).json({ message: "Failed to fetch user" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
