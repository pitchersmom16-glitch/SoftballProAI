"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
var storage_1 = require("./storage");
var routes_1 = require("@shared/routes");
var zod_1 = require("zod");
var localAuth_1 = require("./auth/localAuth");
var objectStorage_1 = require("./storage/objectStorage");
var audio_1 = require("./replit_integrations/audio"); // Use the audio client for openai instance
var analyze_mechanics_1 = require("./brain/analyze_mechanics");
var stripeService_1 = require("./stripeService");
var stripeClient_1 = require("./stripeClient");
function registerRoutes(httpServer, app) {
    return __awaiter(this, void 0, Promise, function () {
        var VIDEO_PROMPTS;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Wire up local authentication
                return [4 /*yield*/, (0, localAuth_1.setupAuth)(app)];
                case 1:
                    // Wire up local authentication
                    _a.sent();
                    (0, localAuth_1.registerAuthRoutes)(app);
                    (0, objectStorage_1.registerObjectStorageRoutes)(app);
                    // === API ROUTES ===
                    // User Role Management
                    app.put("/api/user/role", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, userClaims, roleSchema, role, existingCoach, firstName, lastName, coachName, existingTeams, firstName, lastName, coachName, teamCode, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 8, , 9]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    userClaims = req.user.claims;
                                    roleSchema = zod_1.z.object({
                                        role: zod_1.z.enum(["player", "team_coach", "pitching_coach"])
                                    });
                                    role = roleSchema.parse(req.body).role;
                                    return [4 /*yield*/, storage_1.storage.updateUserRole(userId, role)];
                                case 1:
                                    _a.sent();
                                    if (!(role === "team_coach" || role === "pitching_coach")) return [3 /*break*/, 7];
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 2:
                                    existingCoach = _a.sent();
                                    if (!!existingCoach) return [3 /*break*/, 4];
                                    firstName = userClaims.given_name || userClaims.first_name || "Coach";
                                    lastName = userClaims.family_name || userClaims.last_name || "";
                                    coachName = "".concat(firstName, " ").concat(lastName).trim();
                                    return [4 /*yield*/, storage_1.storage.createCoach({
                                            userId: userId,
                                            name: coachName,
                                            specialty: role === "pitching_coach" ? "PITCHING" : null,
                                        })];
                                case 3:
                                    existingCoach = _a.sent();
                                    _a.label = 4;
                                case 4:
                                    if (!(role === "team_coach")) return [3 /*break*/, 7];
                                    return [4 /*yield*/, storage_1.storage.getTeamsByHeadCoach(existingCoach.id)];
                                case 5:
                                    existingTeams = _a.sent();
                                    if (!(!existingTeams || existingTeams.length === 0)) return [3 /*break*/, 7];
                                    firstName = userClaims.given_name || userClaims.first_name || "Coach";
                                    lastName = userClaims.family_name || userClaims.last_name || "";
                                    coachName = "".concat(firstName, " ").concat(lastName).trim();
                                    teamCode = "TEAM_".concat(crypto.randomUUID().slice(0, 8).toUpperCase());
                                    return [4 /*yield*/, storage_1.storage.createTeam({
                                            name: "".concat(coachName, "'s Team"),
                                            headCoachId: existingCoach.id,
                                            referralCode: teamCode,
                                        })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7:
                                    res.json({ success: true, role: role });
                                    return [3 /*break*/, 9];
                                case 8:
                                    err_1 = _a.sent();
                                    if (err_1 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_1.errors[0].message })];
                                    }
                                    throw err_1;
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Player Check-ins
                    app.get("/api/player/checkin/today", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, today, checkin, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    today = new Date().toISOString().split('T')[0];
                                    return [4 /*yield*/, storage_1.storage.getPlayerCheckinByDate(userId, today)];
                                case 1:
                                    checkin = _a.sent();
                                    res.json(checkin || null);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_2 = _a.sent();
                                    throw err_2;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/player/checkin", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId_1, checkinSchema, data, today, blockedActivities, isArmSore, checkin, athletes, playerAthlete, team, coach, sorenessType, athleteName, alertTitle, playerCoaches, _i, _a, rel, coach, err_3;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 13, , 14]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId_1 = req.user.claims.sub;
                                    checkinSchema = zod_1.z.object({
                                        mood: zod_1.z.string(),
                                        sorenessAreas: zod_1.z.array(zod_1.z.string()),
                                        sorenessLevel: zod_1.z.number().min(1).max(10),
                                        notes: zod_1.z.string().optional(),
                                    });
                                    data = checkinSchema.parse(req.body);
                                    today = new Date().toISOString().split('T')[0];
                                    blockedActivities = [];
                                    isArmSore = data.sorenessAreas.includes("arm") || data.sorenessAreas.includes("shoulder");
                                    if (isArmSore && data.sorenessLevel >= 7) {
                                        blockedActivities.push("pitching", "throwing");
                                    }
                                    return [4 /*yield*/, storage_1.storage.createPlayerCheckin({
                                            userId: userId_1,
                                            date: today,
                                            mood: data.mood,
                                            sorenessAreas: data.sorenessAreas,
                                            sorenessLevel: data.sorenessLevel,
                                            notes: data.notes || null,
                                            blockedActivities: blockedActivities,
                                        })];
                                case 1:
                                    checkin = _b.sent();
                                    if (!(data.sorenessLevel >= 7 && data.sorenessAreas.length > 0)) return [3 /*break*/, 12];
                                    return [4 /*yield*/, storage_1.storage.getAthletes()];
                                case 2:
                                    athletes = _b.sent();
                                    playerAthlete = athletes.find(function (a) { return a.userId === userId_1; });
                                    if (!(playerAthlete === null || playerAthlete === void 0 ? void 0 : playerAthlete.teamId)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, storage_1.storage.getTeam(playerAthlete.teamId)];
                                case 3:
                                    team = _b.sent();
                                    if (!(team === null || team === void 0 ? void 0 : team.headCoachId)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, storage_1.storage.getCoach(team.headCoachId)];
                                case 4:
                                    coach = _b.sent();
                                    if (!(coach === null || coach === void 0 ? void 0 : coach.userId)) return [3 /*break*/, 6];
                                    sorenessType = data.sorenessLevel >= 8 ? "injury_alert" : "high_soreness_alert";
                                    athleteName = "".concat(playerAthlete.firstName, " ").concat(playerAthlete.lastName);
                                    alertTitle = data.sorenessLevel >= 8
                                        ? "INJURY ALERT: ".concat(athleteName)
                                        : "High Soreness: ".concat(athleteName);
                                    return [4 /*yield*/, storage_1.storage.createNotification({
                                            userId: coach.userId,
                                            type: sorenessType,
                                            title: alertTitle,
                                            message: "".concat(athleteName, " reported ").concat(data.sorenessLevel, "/10 soreness in: ").concat(data.sorenessAreas.join(", "), ". ").concat(data.notes || "Check roster status before practice."),
                                            linkUrl: "/roster",
                                            relatedId: playerAthlete.id.toString(),
                                        })];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6: return [4 /*yield*/, storage_1.storage.getPlayerCoaches(userId_1)];
                                case 7:
                                    playerCoaches = _b.sent();
                                    _i = 0, _a = playerCoaches.filter(function (r) { return r.status === "active"; });
                                    _b.label = 8;
                                case 8:
                                    if (!(_i < _a.length)) return [3 /*break*/, 12];
                                    rel = _a[_i];
                                    return [4 /*yield*/, storage_1.storage.getCoach(rel.coachId)];
                                case 9:
                                    coach = _b.sent();
                                    if (!(coach === null || coach === void 0 ? void 0 : coach.userId)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, storage_1.storage.createNotification({
                                            userId: coach.userId,
                                            type: data.sorenessLevel >= 8 ? "injury_alert" : "high_soreness_alert",
                                            title: data.sorenessLevel >= 8 ? "INJURY ALERT" : "High Soreness Alert",
                                            message: "Your student reported ".concat(data.sorenessLevel, "/10 soreness in: ").concat(data.sorenessAreas.join(", "), "."),
                                            linkUrl: "/roster",
                                            relatedId: userId_1,
                                        })];
                                case 10:
                                    _b.sent();
                                    _b.label = 11;
                                case 11:
                                    _i++;
                                    return [3 /*break*/, 8];
                                case 12:
                                    res.status(201).json(checkin);
                                    return [3 /*break*/, 14];
                                case 13:
                                    err_3 = _b.sent();
                                    if (err_3 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_3.errors[0].message })];
                                    }
                                    throw err_3;
                                case 14: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Player video assessment upload (for Coach Me feature)
                    app.post("/api/player/assessment", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId_2, userClaims, assessmentSchema, data, athletes, athlete, assessment, err_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId_2 = req.user.claims.sub;
                                    userClaims = req.user.claims;
                                    assessmentSchema = zod_1.z.object({
                                        skillType: zod_1.z.enum(["hitting", "pitching", "catching", "fielding"]),
                                        videoUrl: zod_1.z.string().url(),
                                    });
                                    data = assessmentSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.getAthletes()];
                                case 1:
                                    athletes = _a.sent();
                                    athlete = athletes.find(function (a) { return a.userId === userId_2; });
                                    if (!!athlete) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.createAthlete({
                                            firstName: userClaims.given_name || "Solo",
                                            lastName: userClaims.family_name || "Player",
                                            userId: userId_2,
                                        })];
                                case 2:
                                    athlete = _a.sent();
                                    _a.label = 3;
                                case 3: return [4 /*yield*/, storage_1.storage.createAssessment({
                                        athleteId: athlete.id,
                                        skillType: data.skillType,
                                        videoUrl: data.videoUrl,
                                    })];
                                case 4:
                                    assessment = _a.sent();
                                    res.status(201).json(assessment);
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_4 = _a.sent();
                                    if (err_4 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_4.errors[0].message })];
                                    }
                                    throw err_4;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Random Mental Edge (Championship Mindset)
                    app.get("/api/mental-edge/random", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var allContent, randomIndex, err_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getMentalEdge()];
                                case 1:
                                    allContent = _a.sent();
                                    if (allContent.length === 0) {
                                        return [2 /*return*/, res.json(null)];
                                    }
                                    randomIndex = Math.floor(Math.random() * allContent.length);
                                    res.json(allContent[randomIndex]);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_5 = _a.sent();
                                    throw err_5;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Coaches
                    app.get(routes_1.api.coaches.me.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.status(404).json({ message: "Coach profile not found" })];
                                    res.json(coach);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post(routes_1.api.coaches.create.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, input, coach, err_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    input = routes_1.api.coaches.create.input.parse(__assign(__assign({}, req.body), { userId: userId // Enforce userId from auth
                                     }));
                                    return [4 /*yield*/, storage_1.storage.createCoach(input)];
                                case 1:
                                    coach = _a.sent();
                                    res.status(201).json(coach);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_6 = _a.sent();
                                    if (err_6 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_6.errors[0].message })];
                                    }
                                    throw err_6;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Athletes
                    app.get(routes_1.api.athletes.list.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var teamId, athletes;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
                                    return [4 /*yield*/, storage_1.storage.getAthletes(teamId)];
                                case 1:
                                    athletes = _a.sent();
                                    res.json(athletes);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get(routes_1.api.athletes.get.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var athlete;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, storage_1.storage.getAthlete(Number(req.params.id))];
                                case 1:
                                    athlete = _a.sent();
                                    if (!athlete)
                                        return [2 /*return*/, res.status(404).json({ message: "Athlete not found" })];
                                    res.json(athlete);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post(routes_1.api.athletes.create.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var input, athlete, err_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    input = routes_1.api.athletes.create.input.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createAthlete(input)];
                                case 1:
                                    athlete = _a.sent();
                                    res.status(201).json(athlete);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_7 = _a.sent();
                                    if (err_7 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_7.errors[0].message })];
                                    }
                                    throw err_7;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Update athlete
                    app.put(routes_1.api.athletes.update.path, localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, id, athlete_1, isAuthorized, coach, team, coach, relationships, isMyStudent, input, updated, err_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 9, , 10]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    id = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.getAthlete(id)];
                                case 1:
                                    athlete_1 = _a.sent();
                                    if (!athlete_1) {
                                        return [2 /*return*/, res.status(404).json({ message: "Athlete not found" })];
                                    }
                                    isAuthorized = false;
                                    // Check if athlete belongs to this user
                                    if (athlete_1.userId === userId) {
                                        isAuthorized = true;
                                    }
                                    if (!(!isAuthorized && athlete_1.teamId)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 2:
                                    coach = _a.sent();
                                    if (!coach) return [3 /*break*/, 4];
                                    return [4 /*yield*/, storage_1.storage.getTeam(athlete_1.teamId)];
                                case 3:
                                    team = _a.sent();
                                    if (team && team.headCoachId === coach.id) {
                                        isAuthorized = true;
                                    }
                                    _a.label = 4;
                                case 4:
                                    if (!!isAuthorized) return [3 /*break*/, 7];
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 5:
                                    coach = _a.sent();
                                    if (!coach) return [3 /*break*/, 7];
                                    return [4 /*yield*/, storage_1.storage.getCoachPlayers(coach.id)];
                                case 6:
                                    relationships = _a.sent();
                                    isMyStudent = relationships.some(function (rel) { return rel.playerId === athlete_1.userId && rel.status === "active"; });
                                    if (isMyStudent) {
                                        isAuthorized = true;
                                    }
                                    _a.label = 7;
                                case 7:
                                    if (!isAuthorized) {
                                        return [2 /*return*/, res.status(403).json({ message: "You are not authorized to update this athlete" })];
                                    }
                                    input = routes_1.api.athletes.update.input.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.updateAthlete(id, input)];
                                case 8:
                                    updated = _a.sent();
                                    res.json(updated);
                                    return [3 /*break*/, 10];
                                case 9:
                                    err_8 = _a.sent();
                                    if (err_8 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_8.errors[0].message })];
                                    }
                                    console.error("Error updating athlete:", err_8);
                                    res.status(500).json({ message: "Failed to update athlete" });
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Delete athlete
                    app.delete("/api/athletes/:id", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, athlete, err_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    id = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.getAthlete(id)];
                                case 1:
                                    athlete = _a.sent();
                                    if (!athlete) {
                                        return [2 /*return*/, res.status(404).json({ message: "Athlete not found" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.deleteAthlete(id)];
                                case 2:
                                    _a.sent();
                                    res.json({ message: "Athlete deleted successfully" });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_9 = _a.sent();
                                    console.error("Error deleting athlete:", err_9);
                                    res.status(500).json({ message: "Failed to delete athlete" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Teams
                    app.get(routes_1.api.teams.list.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var teams;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, storage_1.storage.getTeams()];
                                case 1:
                                    teams = _a.sent();
                                    res.json(teams);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post(routes_1.api.teams.create.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var input, team, err_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    input = routes_1.api.teams.create.input.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createTeam(input)];
                                case 1:
                                    team = _a.sent();
                                    res.status(201).json(team);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_10 = _a.sent();
                                    if (err_10 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_10.errors[0].message })];
                                    }
                                    throw err_10;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Update team (for head coaches to update their team)
                    app.patch("/api/teams/:id", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, id, team, coach, isHeadCoach, canClaimTeam, updateSchema, input, updated, err_11;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    id = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.getTeam(id)];
                                case 1:
                                    team = _a.sent();
                                    if (!team) {
                                        return [2 /*return*/, res.status(404).json({ message: "Team not found" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 2:
                                    coach = _a.sent();
                                    isHeadCoach = coach && team.headCoachId === coach.id;
                                    canClaimTeam = coach && !team.headCoachId;
                                    if (!isHeadCoach && !canClaimTeam) {
                                        return [2 /*return*/, res.status(403).json({ message: "Only the head coach can update this team" })];
                                    }
                                    updateSchema = zod_1.z.object({
                                        name: zod_1.z.string().optional(),
                                        ageDivision: zod_1.z.string().optional(),
                                        season: zod_1.z.string().optional(),
                                        logoUrl: zod_1.z.string().url().optional().nullable(),
                                        headCoachId: zod_1.z.number().optional(),
                                        active: zod_1.z.boolean().optional(),
                                    });
                                    input = updateSchema.parse(req.body);
                                    // If user is claiming the team (no existing head coach), they can set themselves as head coach
                                    if (canClaimTeam && input.headCoachId && input.headCoachId === coach.id) {
                                        // Allow claiming
                                    }
                                    else if (isHeadCoach) {
                                        // Head coach can update anything
                                    }
                                    else if (input.headCoachId !== undefined) {
                                        // Non-head coach trying to set headCoachId
                                        return [2 /*return*/, res.status(403).json({ message: "Only existing head coach can change head coach" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.updateTeam(id, input)];
                                case 3:
                                    updated = _a.sent();
                                    res.json(updated);
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_11 = _a.sent();
                                    if (err_11 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_11.errors[0].message })];
                                    }
                                    console.error("Error updating team:", err_11);
                                    res.status(500).json({ message: "Failed to update team" });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Delete team
                    app.delete("/api/teams/:id", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, team, err_12;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    id = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.getTeam(id)];
                                case 1:
                                    team = _a.sent();
                                    if (!team) {
                                        return [2 /*return*/, res.status(404).json({ message: "Team not found" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.deleteTeam(id)];
                                case 2:
                                    _a.sent();
                                    res.json({ message: "Team deleted successfully" });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_12 = _a.sent();
                                    console.error("Error deleting team:", err_12);
                                    res.status(500).json({ message: "Failed to delete team" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Drills
                    app.get(routes_1.api.drills.list.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var category, drills;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    category = req.query.category;
                                    return [4 /*yield*/, storage_1.storage.getDrills(category)];
                                case 1:
                                    drills = _a.sent();
                                    res.json(drills);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post(routes_1.api.drills.create.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var input, drill, err_13;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    input = routes_1.api.drills.create.input.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createDrill(input)];
                                case 1:
                                    drill = _a.sent();
                                    res.status(201).json(drill);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_13 = _a.sent();
                                    if (err_13 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_13.errors[0].message })];
                                    }
                                    throw err_13;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Assessments
                    app.get(routes_1.api.assessments.list.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var athleteId, assessments;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    athleteId = req.query.athleteId ? Number(req.query.athleteId) : undefined;
                                    return [4 /*yield*/, storage_1.storage.getAssessments(athleteId)];
                                case 1:
                                    assessments = _a.sent();
                                    res.json(assessments);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get(routes_1.api.assessments.get.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, assessment, feedback;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    id = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.getAssessment(id)];
                                case 1:
                                    assessment = _a.sent();
                                    if (!assessment)
                                        return [2 /*return*/, res.status(404).json({ message: "Assessment not found" })];
                                    return [4 /*yield*/, storage_1.storage.getFeedback(id)];
                                case 2:
                                    feedback = _a.sent();
                                    res.json(__assign(__assign({}, assessment), { feedback: feedback }));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post(routes_1.api.assessments.create.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var input, assessment, err_14;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    input = routes_1.api.assessments.create.input.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createAssessment(input)];
                                case 1:
                                    assessment = _a.sent();
                                    res.status(201).json(assessment);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_14 = _a.sent();
                                    if (err_14 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_14.errors[0].message })];
                                    }
                                    throw err_14;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post(routes_1.api.assessments.analyze.path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, assessment;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    id = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.getAssessment(id)];
                                case 1:
                                    assessment = _a.sent();
                                    if (!assessment)
                                        return [2 /*return*/, res.status(404).json({ message: "Assessment not found" })];
                                    // Start Async Analysis
                                    // In a real app, this would be a background job.
                                    // For MVP, we'll await a quick mock/AI call or set timeout.
                                    // Update status to analyzing
                                    return [4 /*yield*/, storage_1.storage.updateAssessment(id, { status: "analyzing" })];
                                case 2:
                                    // Start Async Analysis
                                    // In a real app, this would be a background job.
                                    // For MVP, we'll await a quick mock/AI call or set timeout.
                                    // Update status to analyzing
                                    _a.sent();
                                    // Mock AI Analysis
                                    (function () { return __awaiter(_this, void 0, void 0, function () {
                                        var mockMetrics, response, feedbackText, error_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 5, , 7]);
                                                    // Wait a bit to simulate processing
                                                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 2000); })];
                                                case 1:
                                                    // Wait a bit to simulate processing
                                                    _a.sent();
                                                    mockMetrics = {
                                                        velocity_mph: 55 + Math.random() * 10,
                                                        spin_rate: 1200 + Math.random() * 200,
                                                        stride_length_percentage: 85 + Math.random() * 15
                                                    };
                                                    return [4 /*yield*/, audio_1.openai.chat.completions.create({
                                                            model: "gpt-5.1",
                                                            messages: [
                                                                { role: "system", content: "You are an expert FASTPITCH SOFTBALL mechanics coach specializing in the windmill pitching motion. Your expertise covers: rise ball, drop ball, curve ball, change-up, and screw ball mechanics. You understand proper drag foot technique, hip drive, arm circle speed, wrist snap timing, and stride length optimization specific to fastpitch softball - NOT baseball. All feedback must be age-appropriate and focused on injury prevention and proper fastpitch form." },
                                                                { role: "user", content: "Fastpitch Softball Metrics: ".concat(JSON.stringify(mockMetrics), ". Skill: ").concat(assessment.skillType, ". Generate 3 key feedback points focused on windmill pitching mechanics, drag foot position, and release point.") }
                                                            ],
                                                        })];
                                                case 2:
                                                    response = _a.sent();
                                                    feedbackText = response.choices[0].message.content || "Great effort! Keep working on consistency.";
                                                    // Save Feedback
                                                    return [4 /*yield*/, storage_1.storage.createFeedback({
                                                            assessmentId: id,
                                                            feedbackText: feedbackText,
                                                            priority: "High",
                                                            issueDetected: "Mechanics consistency"
                                                        })];
                                                case 3:
                                                    // Save Feedback
                                                    _a.sent();
                                                    // Update Assessment
                                                    return [4 /*yield*/, storage_1.storage.updateAssessment(id, {
                                                            status: "completed",
                                                            metrics: mockMetrics
                                                        })];
                                                case 4:
                                                    // Update Assessment
                                                    _a.sent();
                                                    return [3 /*break*/, 7];
                                                case 5:
                                                    error_1 = _a.sent();
                                                    console.error("Analysis failed", error_1);
                                                    return [4 /*yield*/, storage_1.storage.updateAssessment(id, { status: "failed" })];
                                                case 6:
                                                    _a.sent();
                                                    return [3 /*break*/, 7];
                                                case 7: return [2 /*return*/];
                                            }
                                        });
                                    }); })();
                                    res.status(202).json({ message: "Analysis started", status: "analyzing" });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // === ROSTER HEALTH ===
                    app.get("/api/roster-health", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var teamId, athletes, today_1, rosterHealth, err_15;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
                                    return [4 /*yield*/, storage_1.storage.getAthletes(teamId)];
                                case 1:
                                    athletes = _a.sent();
                                    today_1 = new Date().toISOString().split('T')[0];
                                    return [4 /*yield*/, Promise.all(athletes.map(function (athlete) { return __awaiter(_this, void 0, void 0, function () {
                                            var healthStatus, lastCheckIn, checkin, isArmSore, sorenessLvl;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        healthStatus = "healthy";
                                                        lastCheckIn = null;
                                                        if (!athlete.userId) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, storage_1.storage.getPlayerCheckinByDate(athlete.userId, today_1)];
                                                    case 1:
                                                        checkin = _b.sent();
                                                        if (checkin) {
                                                            lastCheckIn = {
                                                                mood: checkin.mood,
                                                                sorenessLevel: checkin.sorenessLevel,
                                                                sorenessAreas: checkin.sorenessAreas || [],
                                                                blockedActivities: checkin.blockedActivities || [],
                                                            };
                                                            isArmSore = lastCheckIn.sorenessAreas.includes("arm") ||
                                                                lastCheckIn.sorenessAreas.includes("shoulder");
                                                            sorenessLvl = (_a = lastCheckIn.sorenessLevel) !== null && _a !== void 0 ? _a : 0;
                                                            if (isArmSore && sorenessLvl >= 7) {
                                                                healthStatus = "rest";
                                                            }
                                                            else if (isArmSore || sorenessLvl >= 5) {
                                                                healthStatus = "caution";
                                                            }
                                                        }
                                                        _b.label = 2;
                                                    case 2: return [2 /*return*/, {
                                                            athlete: athlete,
                                                            healthStatus: healthStatus,
                                                            lastCheckIn: lastCheckIn,
                                                        }];
                                                }
                                            });
                                        }); }))];
                                case 2:
                                    rosterHealth = _a.sent();
                                    res.json(rosterHealth);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_15 = _a.sent();
                                    throw err_15;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === PRACTICE PLANS ===
                    app.get("/api/practice-plans", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var teamId, plans, err_16;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
                                    return [4 /*yield*/, storage_1.storage.getPracticePlans(teamId)];
                                case 1:
                                    plans = _a.sent();
                                    res.json(plans);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_16 = _a.sent();
                                    throw err_16;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/practice-plans", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var planSchema, data, userId, coach, team, plan, err_17;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    planSchema = zod_1.z.object({
                                        name: zod_1.z.string().min(1),
                                        duration: zod_1.z.number().optional(),
                                        focus: zod_1.z.string().optional(),
                                        scheduledDate: zod_1.z.string().optional(),
                                        notes: zod_1.z.string().optional(),
                                        teamId: zod_1.z.number().optional(),
                                    });
                                    data = planSchema.parse(req.body);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.status(404).json({ message: "Coach profile not found. Please complete your profile first." })];
                                    if (!data.teamId) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.getTeam(data.teamId)];
                                case 2:
                                    team = _a.sent();
                                    if (!team || team.headCoachId !== coach.id) {
                                        return [2 /*return*/, res.status(403).json({ message: "You don't have access to this team" })];
                                    }
                                    _a.label = 3;
                                case 3: return [4 /*yield*/, storage_1.storage.createPracticePlan({
                                        name: data.name,
                                        duration: data.duration || null,
                                        focus: data.focus || null,
                                        scheduledDate: data.scheduledDate || null,
                                        notes: data.notes || null,
                                        teamId: data.teamId || null,
                                        coachId: coach.id,
                                    })];
                                case 4:
                                    plan = _a.sent();
                                    res.status(201).json(plan);
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_17 = _a.sent();
                                    if (err_17 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_17.errors[0].message })];
                                    }
                                    throw err_17;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === COACH STUDENTS (Stable) ===
                    app.get("/api/coach/students", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, students, err_18;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.json([])];
                                    return [4 /*yield*/, storage_1.storage.getCoachStudents(coach.id)];
                                case 2:
                                    students = _a.sent();
                                    res.json(students);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_18 = _a.sent();
                                    throw err_18;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/coach/students", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, studentSchema, data, student, err_19;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.status(404).json({ message: "Coach profile not found" })];
                                    studentSchema = zod_1.z.object({
                                        athleteId: zod_1.z.number(),
                                        status: zod_1.z.string().optional(),
                                        startDate: zod_1.z.string().optional(),
                                        notes: zod_1.z.string().optional(),
                                    });
                                    data = studentSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createCoachStudent(__assign(__assign({}, data), { coachId: coach.id }))];
                                case 2:
                                    student = _a.sent();
                                    res.status(201).json(student);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_19 = _a.sent();
                                    if (err_19 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_19.errors[0].message })];
                                    }
                                    throw err_19;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === HOMEWORK ASSIGNMENTS ===
                    app.get("/api/homework", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, athleteId, assignments, err_20;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    athleteId = req.query.athleteId ? Number(req.query.athleteId) : undefined;
                                    return [4 /*yield*/, storage_1.storage.getHomeworkAssignments(coach === null || coach === void 0 ? void 0 : coach.id, athleteId)];
                                case 2:
                                    assignments = _a.sent();
                                    res.json(assignments);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_20 = _a.sent();
                                    throw err_20;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/homework", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, homeworkSchema, data, assignment, err_21;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.status(404).json({ message: "Coach profile not found" })];
                                    homeworkSchema = zod_1.z.object({
                                        athleteId: zod_1.z.number(),
                                        title: zod_1.z.string().min(1),
                                        description: zod_1.z.string().optional(),
                                        skillFocus: zod_1.z.string().optional(),
                                        referenceVideoUrl: zod_1.z.string().optional(),
                                        drillId: zod_1.z.number().optional(),
                                        reps: zod_1.z.number().optional(),
                                        dueDate: zod_1.z.string().optional(),
                                    });
                                    data = homeworkSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createHomeworkAssignment({
                                            athleteId: data.athleteId,
                                            title: data.title,
                                            description: data.description || null,
                                            skillFocus: data.skillFocus || null,
                                            referenceVideoUrl: data.referenceVideoUrl || null,
                                            drillId: data.drillId || null,
                                            reps: data.reps || null,
                                            dueDate: data.dueDate || null,
                                            coachId: coach.id,
                                        })];
                                case 2:
                                    assignment = _a.sent();
                                    res.status(201).json(assignment);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_21 = _a.sent();
                                    if (err_21 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_21.errors[0].message })];
                                    }
                                    throw err_21;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === BRAIN API ROUTES ===
                    // Analyze mechanics and get drill recommendations
                    app.post("/api/brain/analyze", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, skillType, detectedIssues, athleteLevel, limit, result, err_22;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, skillType = _a.skillType, detectedIssues = _a.detectedIssues, athleteLevel = _a.athleteLevel, limit = _a.limit;
                                    if (!skillType || !["pitching", "hitting"].includes(skillType)) {
                                        return [2 /*return*/, res.status(400).json({
                                                message: "Invalid skillType. Must be 'pitching' or 'hitting'"
                                            })];
                                    }
                                    return [4 /*yield*/, (0, analyze_mechanics_1.analyzeMechanics)({
                                            skillType: skillType,
                                            detectedIssues: detectedIssues || [],
                                            athleteLevel: athleteLevel || "Intermediate",
                                            limit: limit || 3
                                        })];
                                case 1:
                                    result = _b.sent();
                                    res.json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_22 = _b.sent();
                                    console.error("Brain analysis error:", err_22);
                                    res.status(500).json({ message: "Analysis failed" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Quick corrective drill lookup
                    app.get("/api/brain/corrective-drills", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, skillType, issue, limit, drills, err_23;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.query, skillType = _a.skillType, issue = _a.issue, limit = _a.limit;
                                    if (!skillType || !["pitching", "hitting"].includes(skillType)) {
                                        return [2 /*return*/, res.status(400).json({
                                                message: "Invalid skillType. Must be 'pitching' or 'hitting'"
                                            })];
                                    }
                                    if (!issue) {
                                        return [2 /*return*/, res.status(400).json({ message: "Issue parameter required" })];
                                    }
                                    return [4 /*yield*/, (0, analyze_mechanics_1.getCorrectiveDrills)(skillType.toUpperCase(), issue, limit ? Number(limit) : 3)];
                                case 1:
                                    drills = _b.sent();
                                    res.json({ issue: issue, recommendations: drills });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_23 = _b.sent();
                                    console.error("Corrective drills error:", err_23);
                                    res.status(500).json({ message: "Lookup failed" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Search drills by mechanic tag
                    app.get("/api/brain/drills-by-tag", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, tag, limit, drills, err_24;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.query, tag = _a.tag, limit = _a.limit;
                                    if (!tag) {
                                        return [2 /*return*/, res.status(400).json({ message: "Tag parameter required" })];
                                    }
                                    return [4 /*yield*/, (0, analyze_mechanics_1.getDrillsByTag)(tag, limit ? Number(limit) : 10)];
                                case 1:
                                    drills = _b.sent();
                                    res.json({ tag: tag, drills: drills });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_24 = _b.sent();
                                    console.error("Drills by tag error:", err_24);
                                    res.status(500).json({ message: "Lookup failed" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Search drills by expert source
                    app.get("/api/brain/drills-by-expert", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var expert, drills, err_25;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    expert = req.query.expert;
                                    if (!expert) {
                                        return [2 /*return*/, res.status(400).json({ message: "Expert parameter required" })];
                                    }
                                    return [4 /*yield*/, (0, analyze_mechanics_1.getDrillsByExpert)(expert)];
                                case 1:
                                    drills = _a.sent();
                                    res.json({ expert: expert, drills: drills });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_25 = _a.sent();
                                    console.error("Drills by expert error:", err_25);
                                    res.status(500).json({ message: "Lookup failed" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === BRAIN TRAINING ROUTES (Admin Dashboard) ===
                    // Add new drill to Knowledge Base
                    app.post("/api/brain/train/drill", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var input, drill, err_26;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    input = routes_1.api.brain.trainDrill.input.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createDrill(input)];
                                case 1:
                                    drill = _a.sent();
                                    res.status(201).json({ message: "Drill added to Knowledge Base", drill: drill });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_26 = _a.sent();
                                    if (err_26 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_26.errors[0].message })];
                                    }
                                    console.error("Train drill error:", err_26);
                                    res.status(500).json({ message: "Failed to add drill" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Add new Mental Edge content
                    app.post("/api/brain/train/mental-edge", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var input, content, err_27;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    input = routes_1.api.mentalEdge.create.input.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.createMentalEdge(input)];
                                case 1:
                                    content = _a.sent();
                                    res.status(201).json({ message: "Mental Edge content added", content: content });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_27 = _a.sent();
                                    if (err_27 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_27.errors[0].message })];
                                    }
                                    console.error("Train mental edge error:", err_27);
                                    res.status(500).json({ message: "Failed to add mental edge content" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get all Mental Edge content
                    app.get("/api/mental-edge", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var content, err_28;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.getMentalEdge()];
                                case 1:
                                    content = _a.sent();
                                    res.json(content);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_28 = _a.sent();
                                    console.error("Get mental edge error:", err_28);
                                    res.status(500).json({ message: "Failed to fetch mental edge content" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Bulk import drills from JSON (Knowledge Base Importer)
                    app.post("/api/admin/import-drills", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, user, importSchema, _a, category, drills, imported, errors, _i, drills_1, drill, err_29, err_30;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 8, , 9]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getUser(userId)];
                                case 1:
                                    user = _b.sent();
                                    if (!user || (user.role !== "team_coach" && user.role !== "pitching_coach")) {
                                        return [2 /*return*/, res.status(403).json({ message: "Only coaches can import drills" })];
                                    }
                                    importSchema = zod_1.z.object({
                                        category: zod_1.z.enum(["Pitching", "Hitting", "Catching", "Throwing", "Biomechanics", "Crossfit"]),
                                        drills: zod_1.z.array(zod_1.z.object({
                                            name: zod_1.z.string().min(1, "Drill name is required"),
                                            description: zod_1.z.string().min(1, "Description is required"),
                                            skillType: zod_1.z.string().optional(),
                                            difficulty: zod_1.z.string().optional(),
                                            videoUrl: zod_1.z.string().optional(),
                                            equipment: zod_1.z.array(zod_1.z.string()).optional(),
                                            ageRange: zod_1.z.string().optional(),
                                            expertSource: zod_1.z.string().optional(),
                                            mechanicTags: zod_1.z.array(zod_1.z.string()).optional(),
                                            issueAddressed: zod_1.z.string().optional(),
                                        }))
                                    });
                                    _a = importSchema.parse(req.body), category = _a.category, drills = _a.drills;
                                    imported = 0;
                                    errors = [];
                                    _i = 0, drills_1 = drills;
                                    _b.label = 2;
                                case 2:
                                    if (!(_i < drills_1.length)) return [3 /*break*/, 7];
                                    drill = drills_1[_i];
                                    _b.label = 3;
                                case 3:
                                    _b.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, storage_1.storage.createDrill({
                                            name: drill.name,
                                            category: category,
                                            description: drill.description,
                                            skillType: drill.skillType || category.toLowerCase(),
                                            difficulty: drill.difficulty,
                                            videoUrl: drill.videoUrl,
                                            equipment: drill.equipment,
                                            ageRange: drill.ageRange,
                                            expertSource: drill.expertSource,
                                            mechanicTags: drill.mechanicTags,
                                            issueAddressed: drill.issueAddressed,
                                        })];
                                case 4:
                                    _b.sent();
                                    imported++;
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_29 = _b.sent();
                                    errors.push("Failed to import \"".concat(drill.name, "\": ").concat(err_29 instanceof Error ? err_29.message : 'Unknown error'));
                                    return [3 /*break*/, 6];
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 7:
                                    res.status(201).json({
                                        message: "Imported ".concat(imported, " of ").concat(drills.length, " drills"),
                                        imported: imported,
                                        total: drills.length,
                                        errors: errors.length > 0 ? errors : undefined
                                    });
                                    return [3 /*break*/, 9];
                                case 8:
                                    err_30 = _b.sent();
                                    if (err_30 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({
                                                message: "Invalid JSON format",
                                                errors: err_30.errors.map(function (e) { return "".concat(e.path.join('.'), ": ").concat(e.message); })
                                            })];
                                    }
                                    console.error("Import drills error:", err_30);
                                    res.status(500).json({ message: "Failed to import drills" });
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Delete a drill
                    app.delete("/api/drills/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var err_31;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.deleteDrill(Number(req.params.id))];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "Drill deleted" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_31 = _a.sent();
                                    console.error("Delete drill error:", err_31);
                                    res.status(500).json({ message: "Failed to delete drill" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Delete Mental Edge content
                    app.delete("/api/mental-edge/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var err_32;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage_1.storage.deleteMentalEdge(Number(req.params.id))];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "Mental edge content deleted" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_32 = _a.sent();
                                    console.error("Delete mental edge error:", err_32);
                                    res.status(500).json({ message: "Failed to delete mental edge content" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === HYBRID COACHING SYSTEM ROUTES ===
                    // Get player's athlete profile
                    app.get("/api/player/athlete", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, athlete, err_33;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getAthleteByUserId(userId)];
                                case 1:
                                    athlete = _a.sent();
                                    if (!athlete) {
                                        return [2 /*return*/, res.status(404).json({ message: "No athlete profile found for your account" })];
                                    }
                                    res.json(athlete);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_33 = _a.sent();
                                    throw err_33;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get player's coaching team
                    app.get("/api/player/coaches", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coaches, err_34;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getPlayerCoaches(userId)];
                                case 1:
                                    coaches = _a.sent();
                                    res.json(coaches);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_34 = _a.sent();
                                    throw err_34;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get player settings (subscription mode)
                    app.get("/api/player/settings", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, settings, err_35;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getPlayerSettings(userId)];
                                case 1:
                                    settings = _a.sent();
                                    if (!!settings) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.createPlayerSettings({ userId: userId, subscriptionMode: "solo" })];
                                case 2:
                                    settings = _a.sent();
                                    _a.label = 3;
                                case 3:
                                    res.json(settings);
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_35 = _a.sent();
                                    throw err_35;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Update player settings
                    app.patch("/api/player/settings", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, settingsSchema, data, settings, updated, err_36;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    settingsSchema = zod_1.z.object({
                                        subscriptionMode: zod_1.z.enum(["solo", "coached"]).optional(),
                                        notificationsEnabled: zod_1.z.boolean().optional(),
                                        autoAssignDrills: zod_1.z.boolean().optional(),
                                    });
                                    data = settingsSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.getPlayerSettings(userId)];
                                case 1:
                                    settings = _a.sent();
                                    if (!!settings) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.createPlayerSettings({ userId: userId, subscriptionMode: "solo" })];
                                case 2:
                                    settings = _a.sent();
                                    _a.label = 3;
                                case 3: return [4 /*yield*/, storage_1.storage.updatePlayerSettings(userId, data)];
                                case 4:
                                    updated = _a.sent();
                                    res.json(updated);
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_36 = _a.sent();
                                    if (err_36 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_36.errors[0].message })];
                                    }
                                    throw err_36;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Send coach invite
                    app.post("/api/player/invite-coach", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, inviteSchema, data, inviteToken, expiresAt, invite, err_37;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    inviteSchema = zod_1.z.object({
                                        coachEmail: zod_1.z.string().email().optional(),
                                        coachUsername: zod_1.z.string().optional(),
                                        skillType: zod_1.z.enum(["PITCHING", "HITTING", "CATCHING", "FIELDING"]),
                                        message: zod_1.z.string().optional(),
                                    });
                                    data = inviteSchema.parse(req.body);
                                    if (!data.coachEmail && !data.coachUsername) {
                                        return [2 /*return*/, res.status(400).json({ message: "Either coach email or username is required" })];
                                    }
                                    inviteToken = crypto.randomUUID();
                                    expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                                    return [4 /*yield*/, storage_1.storage.createCoachInvite({
                                            fromPlayerId: userId,
                                            toCoachEmail: data.coachEmail || null,
                                            toCoachUsername: data.coachUsername || null,
                                            skillType: data.skillType,
                                            status: "pending",
                                            inviteToken: inviteToken,
                                            expiresAt: expiresAt,
                                            message: data.message || null,
                                        })];
                                case 1:
                                    invite = _a.sent();
                                    res.status(201).json(invite);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_37 = _a.sent();
                                    if (err_37 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_37.errors[0].message })];
                                    }
                                    throw err_37;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get player's sent invites
                    app.get("/api/player/invites", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, invites, err_38;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getPlayerInvites(userId)];
                                case 1:
                                    invites = _a.sent();
                                    res.json(invites);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_38 = _a.sent();
                                    throw err_38;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get coach's received invites
                    app.get("/api/coach/invites", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, invites, err_39;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.json([])];
                                    return [4 /*yield*/, storage_1.storage.getCoachInvites(coach.id)];
                                case 2:
                                    invites = _a.sent();
                                    res.json(invites);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_39 = _a.sent();
                                    throw err_39;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Accept or decline invite
                    app.patch("/api/coach/invites/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, actionSchema, status, inviteId, invite, err_40;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.status(404).json({ message: "Coach profile not found" })];
                                    actionSchema = zod_1.z.object({
                                        status: zod_1.z.enum(["accepted", "declined"]),
                                    });
                                    status = actionSchema.parse(req.body).status;
                                    inviteId = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.updateCoachInvite(inviteId, {
                                            status: status,
                                            toCoachId: coach.id
                                        })];
                                case 2:
                                    invite = _a.sent();
                                    if (!(status === "accepted")) return [3 /*break*/, 4];
                                    return [4 /*yield*/, storage_1.storage.createPlayerCoachRelationship({
                                            playerId: invite.fromPlayerId,
                                            coachId: coach.id,
                                            skillType: invite.skillType,
                                            status: "active",
                                            subscriptionMode: "coached",
                                        })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    res.json(invite);
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_40 = _a.sent();
                                    if (err_40 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_40.errors[0].message })];
                                    }
                                    throw err_40;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get coach's players (students)
                    app.get("/api/coach/players", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, players, err_41;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.json([])];
                                    return [4 /*yield*/, storage_1.storage.getCoachPlayers(coach.id)];
                                case 2:
                                    players = _a.sent();
                                    res.json(players);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_41 = _a.sent();
                                    throw err_41;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Remove coach from player's team
                    app.delete("/api/player/coaches/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var err_42;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    return [4 /*yield*/, storage_1.storage.deletePlayerCoachRelationship(Number(req.params.id))];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "Coach removed from your team" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_42 = _a.sent();
                                    throw err_42;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === COACH REVIEW QUEUE (Pending Assessments) ===
                    // Get assessments pending coach review
                    app.get("/api/coach/review-queue", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, pendingAssessments, err_43;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    return [4 /*yield*/, storage_1.storage.getAssessmentsByStatus("pending_coach_review", coach === null || coach === void 0 ? void 0 : coach.id)];
                                case 2:
                                    pendingAssessments = _a.sent();
                                    res.json(pendingAssessments);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_43 = _a.sent();
                                    throw err_43;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Approve assessment (release drills to player)
                    app.post("/api/coach/assessments/:id/approve", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var assessmentId, err_44;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    assessmentId = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.updateAssessment(assessmentId, { status: "coach_approved" })];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "Assessment approved, drills released to player" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_44 = _a.sent();
                                    throw err_44;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Edit and approve assessment
                    app.post("/api/coach/assessments/:id/edit-approve", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var assessmentId, editSchema, data, err_45;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    assessmentId = Number(req.params.id);
                                    editSchema = zod_1.z.object({
                                        notes: zod_1.z.string().optional(),
                                        additionalFeedback: zod_1.z.string().optional(),
                                    });
                                    data = editSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.updateAssessment(assessmentId, {
                                            status: "coach_edited",
                                            notes: data.notes
                                        })];
                                case 1:
                                    _a.sent();
                                    if (!data.additionalFeedback) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.createFeedback({
                                            assessmentId: assessmentId,
                                            feedbackText: data.additionalFeedback,
                                            priority: "High",
                                            issueDetected: "Coach Review"
                                        })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    res.json({ message: "Assessment edited and approved" });
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_45 = _a.sent();
                                    if (err_45 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_45.errors[0].message })];
                                    }
                                    throw err_45;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === HEAD COACH MODE - Team Referrals ===
                    // Generate or get team referral code (for head coaches)
                    app.get("/api/team/:teamId/referral-code", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, teamId, team, coach, code, err_46;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    teamId = Number(req.params.teamId);
                                    return [4 /*yield*/, storage_1.storage.getTeam(teamId)];
                                case 1:
                                    team = _a.sent();
                                    if (!team) {
                                        return [2 /*return*/, res.status(404).json({ message: "Team not found" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 2:
                                    coach = _a.sent();
                                    if (!coach || team.headCoachId !== coach.id) {
                                        return [2 /*return*/, res.status(403).json({ message: "Only the head coach can manage team referrals" })];
                                    }
                                    if (!!team.referralCode) return [3 /*break*/, 4];
                                    code = "TEAM_".concat(crypto.randomUUID().slice(0, 8).toUpperCase());
                                    return [4 /*yield*/, storage_1.storage.updateTeam(team.id, { referralCode: code })];
                                case 3:
                                    team = _a.sent();
                                    _a.label = 4;
                                case 4:
                                    res.json({
                                        referralCode: team.referralCode,
                                        referralUrl: "/register?ref=".concat(team.referralCode),
                                        teamId: team.id,
                                        teamName: team.name
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_46 = _a.sent();
                                    throw err_46;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get teams for current head coach
                    app.get("/api/coach/teams", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, teams, err_47;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach) {
                                        return [2 /*return*/, res.json({ teams: [] })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getTeamsByHeadCoach(coach.id)];
                                case 2:
                                    teams = _a.sent();
                                    res.json({
                                        teams: teams.map(function (t) { return ({
                                            id: t.id,
                                            name: t.name,
                                            ageDivision: t.ageDivision,
                                            season: t.season,
                                            referralCode: t.referralCode,
                                            referralUrl: t.referralCode ? "/register?ref=".concat(t.referralCode) : null
                                        }); })
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_47 = _a.sent();
                                    throw err_47;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === SPECIALIST COACH MODE ===
                    // Generate or get coach's referral code
                    app.get("/api/specialist/referral-code", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, code, err_48;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach) {
                                        return [2 /*return*/, res.status(404).json({ message: "Coach profile not found" })];
                                    }
                                    if (!!coach.referralCode) return [3 /*break*/, 3];
                                    code = "COACH_".concat(crypto.randomUUID().slice(0, 8).toUpperCase());
                                    return [4 /*yield*/, storage_1.storage.updateCoach(coach.id, { referralCode: code })];
                                case 2:
                                    coach = _a.sent();
                                    _a.label = 3;
                                case 3:
                                    res.json({
                                        referralCode: coach.referralCode,
                                        referralUrl: "/register?ref=".concat(coach.referralCode)
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_48 = _a.sent();
                                    throw err_48;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get coach's roster (My Students)
                    app.get("/api/specialist/roster", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, relationships, students, err_49;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.json({ students: [], count: 0, maxStudents: 25 })];
                                    return [4 /*yield*/, storage_1.storage.getCoachPlayers(coach.id)];
                                case 2:
                                    relationships = _a.sent();
                                    return [4 /*yield*/, Promise.all(relationships.map(function (rel) { return __awaiter(_this, void 0, void 0, function () {
                                            var onboarding, _a, baselineVideos, _b, needsReview;
                                            var _c, _d, _e, _f, _g, _h;
                                            return __generator(this, function (_j) {
                                                switch (_j.label) {
                                                    case 0:
                                                        if (!rel.player) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, storage_1.storage.getPlayerOnboarding(rel.playerId)];
                                                    case 1:
                                                        _a = _j.sent();
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        _a = null;
                                                        _j.label = 3;
                                                    case 3:
                                                        onboarding = _a;
                                                        if (!rel.player) return [3 /*break*/, 5];
                                                        return [4 /*yield*/, storage_1.storage.getBaselineVideos(rel.playerId)];
                                                    case 4:
                                                        _b = _j.sent();
                                                        return [3 /*break*/, 6];
                                                    case 5:
                                                        _b = [];
                                                        _j.label = 6;
                                                    case 6:
                                                        baselineVideos = _b;
                                                        needsReview = !(onboarding === null || onboarding === void 0 ? void 0 : onboarding.dashboardUnlocked) && baselineVideos.length >= 4;
                                                        return [2 /*return*/, {
                                                                id: rel.id,
                                                                playerId: rel.playerId,
                                                                name: ((_c = rel.player) === null || _c === void 0 ? void 0 : _c.firstName) && ((_d = rel.player) === null || _d === void 0 ? void 0 : _d.lastName)
                                                                    ? "".concat(rel.player.firstName, " ").concat(rel.player.lastName)
                                                                    : ((_e = rel.player) === null || _e === void 0 ? void 0 : _e.email) || "Unknown",
                                                                email: (_f = rel.player) === null || _f === void 0 ? void 0 : _f.email,
                                                                skillType: rel.skillType,
                                                                status: rel.status,
                                                                startDate: rel.startDate,
                                                                baselineComplete: (_g = onboarding === null || onboarding === void 0 ? void 0 : onboarding.baselineComplete) !== null && _g !== void 0 ? _g : false,
                                                                baselineVideoCount: baselineVideos.length,
                                                                dashboardUnlocked: (_h = onboarding === null || onboarding === void 0 ? void 0 : onboarding.dashboardUnlocked) !== null && _h !== void 0 ? _h : false,
                                                                needsReview: needsReview,
                                                                // Include baseline videos for students needing review
                                                                baselineVideos: needsReview ? baselineVideos.map(function (v) { return ({
                                                                    id: v.id,
                                                                    videoNumber: v.videoNumber,
                                                                    videoUrl: v.videoUrl,
                                                                    status: v.status,
                                                                }); }) : undefined,
                                                            }];
                                                }
                                            });
                                        }); }))];
                                case 3:
                                    students = _a.sent();
                                    res.json({
                                        students: students.filter(function (s) { return s.status === "active"; }),
                                        count: students.filter(function (s) { return s.status === "active"; }).length,
                                        maxStudents: coach.maxStudents || 25
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_49 = _a.sent();
                                    throw err_49;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Smart Invite - Send invite to student/parent
                    app.post("/api/specialist/invite", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, activeCount, maxStudents, inviteSchema, data, inviteToken, expiresAt, invite, err_50;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.status(404).json({ message: "Coach profile not found" })];
                                    return [4 /*yield*/, storage_1.storage.getCoachActiveStudentCount(coach.id)];
                                case 2:
                                    activeCount = _a.sent();
                                    maxStudents = coach.maxStudents || 25;
                                    if (activeCount >= maxStudents) {
                                        return [2 /*return*/, res.status(400).json({
                                                message: "You have reached your maximum of ".concat(maxStudents, " active students. Archive inactive students to add more.")
                                            })];
                                    }
                                    inviteSchema = zod_1.z.object({
                                        parentEmail: zod_1.z.string().email().optional(),
                                        studentEmail: zod_1.z.string().email().optional(),
                                        phone: zod_1.z.string().optional(),
                                        studentName: zod_1.z.string().optional(),
                                    });
                                    data = inviteSchema.parse(req.body);
                                    if (!data.parentEmail && !data.studentEmail && !data.phone) {
                                        return [2 /*return*/, res.status(400).json({ message: "At least one contact method is required (parent email, student email, or phone)" })];
                                    }
                                    inviteToken = crypto.randomUUID();
                                    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                                    return [4 /*yield*/, storage_1.storage.createStudentInvite({
                                            coachId: coach.id,
                                            parentEmail: data.parentEmail || null,
                                            studentEmail: data.studentEmail || null,
                                            phone: data.phone || null,
                                            studentName: data.studentName || null,
                                            skillType: coach.specialty || "PITCHING",
                                            inviteToken: inviteToken,
                                            status: "pending",
                                            expiresAt: expiresAt,
                                        })];
                                case 3:
                                    invite = _a.sent();
                                    res.status(201).json({
                                        invite: invite,
                                        inviteUrl: "/register?invite=".concat(inviteToken),
                                        message: "Invite created successfully"
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_50 = _a.sent();
                                    if (err_50 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_50.errors[0].message })];
                                    }
                                    throw err_50;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get coach's sent invites
                    app.get("/api/specialist/invites", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, invites, err_51;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.json([])];
                                    return [4 /*yield*/, storage_1.storage.getStudentInvitesByCoach(coach.id)];
                                case 2:
                                    invites = _a.sent();
                                    res.json(invites);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_51 = _a.sent();
                                    throw err_51;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Archive student (remove from active roster)
                    app.post("/api/specialist/roster/:id/archive", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var relationshipId, err_52;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    relationshipId = Number(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.updatePlayerCoachRelationship(relationshipId, { status: "inactive" })];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "Student archived successfully" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_52 = _a.sent();
                                    throw err_52;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === REFERRAL REGISTRATION (Public Route) ===
                    // Validate invite token and get coach info
                    app.get("/api/register/validate", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, invite, ref, studentInvite, coach, refCode, team, coach_1, _b, coach, err_53;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 11, , 12]);
                                    _a = req.query, invite = _a.invite, ref = _a.ref;
                                    if (!invite) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.getStudentInviteByToken(invite)];
                                case 1:
                                    studentInvite = _c.sent();
                                    if (!studentInvite) {
                                        return [2 /*return*/, res.status(404).json({ message: "Invalid or expired invite" })];
                                    }
                                    if (studentInvite.status !== "pending") {
                                        return [2 /*return*/, res.status(400).json({ message: "This invite has already been used" })];
                                    }
                                    if (studentInvite.expiresAt && new Date(studentInvite.expiresAt) < new Date()) {
                                        return [2 /*return*/, res.status(400).json({ message: "This invite has expired" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getCoach(studentInvite.coachId)];
                                case 2:
                                    coach = _c.sent();
                                    return [2 /*return*/, res.json({
                                            type: "invite",
                                            coachId: studentInvite.coachId,
                                            coachName: coach === null || coach === void 0 ? void 0 : coach.name,
                                            skillType: studentInvite.skillType,
                                            studentName: studentInvite.studentName,
                                            inviteToken: invite,
                                        })];
                                case 3:
                                    if (!ref) return [3 /*break*/, 10];
                                    refCode = ref;
                                    if (!refCode.startsWith("TEAM_")) return [3 /*break*/, 8];
                                    return [4 /*yield*/, storage_1.storage.getTeamByReferralCode(refCode)];
                                case 4:
                                    team = _c.sent();
                                    if (!team) {
                                        return [2 /*return*/, res.status(404).json({ message: "Invalid team referral code" })];
                                    }
                                    if (!team.headCoachId) return [3 /*break*/, 6];
                                    return [4 /*yield*/, storage_1.storage.getCoach(team.headCoachId)];
                                case 5:
                                    _b = _c.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    _b = null;
                                    _c.label = 7;
                                case 7:
                                    coach_1 = _b;
                                    return [2 /*return*/, res.json({
                                            type: "team_referral",
                                            teamId: team.id,
                                            teamName: team.name,
                                            coachId: team.headCoachId,
                                            coachName: (coach_1 === null || coach_1 === void 0 ? void 0 : coach_1.name) || "Head Coach",
                                            referralCode: refCode,
                                        })];
                                case 8: return [4 /*yield*/, storage_1.storage.getCoachByReferralCode(refCode)];
                                case 9:
                                    coach = _c.sent();
                                    if (!coach) {
                                        return [2 /*return*/, res.status(404).json({ message: "Invalid referral code" })];
                                    }
                                    return [2 /*return*/, res.json({
                                            type: "referral",
                                            coachId: coach.id,
                                            coachName: coach.name,
                                            skillType: coach.specialty,
                                            referralCode: refCode,
                                        })];
                                case 10: return [2 /*return*/, res.status(400).json({ message: "Invite token or referral code required" })];
                                case 11:
                                    err_53 = _c.sent();
                                    throw err_53;
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Complete registration with referral/invite (called after OAuth)
                    app.post("/api/register/complete", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, userClaims, completeSchema, data, coachId, teamId, skillType, isTeamReferral, invite, refCode, team, coach_2, firstName, lastName, primaryPosition, existingAthlete, existingOnboarding, settings_1, coach, onboardingType, settings, err_54;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 31, , 32]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Must be logged in to complete registration" })];
                                    userId = req.user.claims.sub;
                                    userClaims = req.user.claims;
                                    completeSchema = zod_1.z.object({
                                        inviteToken: zod_1.z.string().optional(),
                                        referralCode: zod_1.z.string().optional(),
                                        firstName: zod_1.z.string().optional(),
                                        lastName: zod_1.z.string().optional(),
                                        primaryPosition: zod_1.z.string().optional(),
                                    });
                                    data = completeSchema.parse(req.body);
                                    coachId = null;
                                    teamId = null;
                                    skillType = "PITCHING";
                                    isTeamReferral = false;
                                    if (!data.inviteToken) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.getStudentInviteByToken(data.inviteToken)];
                                case 1:
                                    invite = _a.sent();
                                    if (!(invite && invite.status === "pending")) return [3 /*break*/, 3];
                                    coachId = invite.coachId;
                                    skillType = invite.skillType;
                                    // Mark invite as used
                                    return [4 /*yield*/, storage_1.storage.updateStudentInvite(invite.id, {
                                            status: "registered",
                                            registeredUserId: userId
                                        })];
                                case 2:
                                    // Mark invite as used
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!(!coachId && data.referralCode)) return [3 /*break*/, 7];
                                    refCode = data.referralCode;
                                    if (!refCode.startsWith("TEAM_")) return [3 /*break*/, 5];
                                    return [4 /*yield*/, storage_1.storage.getTeamByReferralCode(refCode)];
                                case 4:
                                    team = _a.sent();
                                    if (team && team.headCoachId) {
                                        coachId = team.headCoachId;
                                        teamId = team.id;
                                        isTeamReferral = true;
                                    }
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, storage_1.storage.getCoachByReferralCode(refCode)];
                                case 6:
                                    coach_2 = _a.sent();
                                    if (coach_2) {
                                        coachId = coach_2.id;
                                        skillType = coach_2.specialty || "PITCHING";
                                    }
                                    _a.label = 7;
                                case 7:
                                    if (!coachId) {
                                        return [2 /*return*/, res.status(400).json({ message: "Invalid invite or referral" })];
                                    }
                                    if (!(isTeamReferral && teamId)) return [3 /*break*/, 22];
                                    firstName = data.firstName || userClaims.given_name || "Player";
                                    lastName = data.lastName || userClaims.family_name || "Name";
                                    primaryPosition = data.primaryPosition || null;
                                    return [4 /*yield*/, storage_1.storage.getAthleteByUserId(userId)];
                                case 8:
                                    existingAthlete = _a.sent();
                                    if (!existingAthlete) return [3 /*break*/, 10];
                                    // Update existing athlete with team assignment and position
                                    return [4 /*yield*/, storage_1.storage.updateAthlete(existingAthlete.id, {
                                            teamId: teamId,
                                            firstName: firstName,
                                            lastName: lastName,
                                            primaryPosition: primaryPosition
                                        })];
                                case 9:
                                    // Update existing athlete with team assignment and position
                                    _a.sent();
                                    return [3 /*break*/, 12];
                                case 10: 
                                // Create new athlete linked to the team
                                return [4 /*yield*/, storage_1.storage.createAthlete({
                                        userId: userId,
                                        firstName: firstName,
                                        lastName: lastName,
                                        teamId: teamId,
                                        primaryPosition: primaryPosition,
                                    })];
                                case 11:
                                    // Create new athlete linked to the team
                                    _a.sent();
                                    _a.label = 12;
                                case 12: return [4 /*yield*/, storage_1.storage.getPlayerOnboarding(userId)];
                                case 13:
                                    existingOnboarding = _a.sent();
                                    if (!!existingOnboarding) return [3 /*break*/, 15];
                                    return [4 /*yield*/, storage_1.storage.createPlayerOnboarding({
                                            userId: userId,
                                            coachId: coachId,
                                            teamId: teamId,
                                            onboardingType: "team_coach",
                                            skillType: primaryPosition === "P" ? "PITCHING" : "HITTING",
                                            baselineComplete: false,
                                            dashboardUnlocked: false,
                                        })];
                                case 14:
                                    _a.sent();
                                    _a.label = 15;
                                case 15: return [4 /*yield*/, storage_1.storage.getPlayerSettings(userId)];
                                case 16:
                                    settings_1 = _a.sent();
                                    if (!!settings_1) return [3 /*break*/, 18];
                                    return [4 /*yield*/, storage_1.storage.createPlayerSettings({ userId: userId, subscriptionMode: "coached" })];
                                case 17:
                                    _a.sent();
                                    return [3 /*break*/, 20];
                                case 18: return [4 /*yield*/, storage_1.storage.updatePlayerSettings(userId, { subscriptionMode: "coached" })];
                                case 19:
                                    _a.sent();
                                    _a.label = 20;
                                case 20: 
                                // CRITICAL: Set user role to "player" so they skip role selection
                                return [4 /*yield*/, storage_1.storage.updateUserRole(userId, "player")];
                                case 21:
                                    // CRITICAL: Set user role to "player" so they skip role selection
                                    _a.sent();
                                    return [2 /*return*/, res.json({
                                            message: "Welcome to the team! Please complete your baseline videos.",
                                            requiresBaseline: true,
                                            coachId: coachId,
                                            teamId: teamId,
                                            role: "player"
                                        })];
                                case 22: 
                                // For Private Instructor Mode, create player-coach relationship
                                return [4 /*yield*/, storage_1.storage.createPlayerCoachRelationship({
                                        playerId: userId,
                                        coachId: coachId,
                                        skillType: skillType,
                                        status: "active",
                                        subscriptionMode: "coached",
                                    })];
                                case 23:
                                    // For Private Instructor Mode, create player-coach relationship
                                    _a.sent();
                                    return [4 /*yield*/, storage_1.storage.getCoach(coachId)];
                                case 24:
                                    coach = _a.sent();
                                    onboardingType = "pitching_instructor";
                                    if (skillType === "CATCHING" || (coach === null || coach === void 0 ? void 0 : coach.specialty) === "CATCHING") {
                                        onboardingType = "catching_instructor";
                                    }
                                    // Create onboarding record (dashboard locked until baseline complete)
                                    return [4 /*yield*/, storage_1.storage.createPlayerOnboarding({
                                            userId: userId,
                                            coachId: coachId,
                                            onboardingType: onboardingType,
                                            skillType: skillType,
                                            baselineComplete: false,
                                            dashboardUnlocked: false,
                                        })];
                                case 25:
                                    // Create onboarding record (dashboard locked until baseline complete)
                                    _a.sent();
                                    return [4 /*yield*/, storage_1.storage.getPlayerSettings(userId)];
                                case 26:
                                    settings = _a.sent();
                                    if (!!settings) return [3 /*break*/, 28];
                                    return [4 /*yield*/, storage_1.storage.createPlayerSettings({ userId: userId, subscriptionMode: "coached" })];
                                case 27:
                                    _a.sent();
                                    return [3 /*break*/, 30];
                                case 28: return [4 /*yield*/, storage_1.storage.updatePlayerSettings(userId, { subscriptionMode: "coached" })];
                                case 29:
                                    _a.sent();
                                    _a.label = 30;
                                case 30:
                                    res.json({
                                        message: "Registration complete! Please upload your baseline videos.",
                                        requiresBaseline: true,
                                        coachId: coachId,
                                        skillType: skillType
                                    });
                                    return [3 /*break*/, 32];
                                case 31:
                                    err_54 = _a.sent();
                                    if (err_54 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_54.errors[0].message })];
                                    }
                                    throw err_54;
                                case 32: return [2 /*return*/];
                            }
                        });
                    }); });
                    VIDEO_PROMPTS = {
                        team_coach: [
                            { number: 1, category: "hitting", title: "Hitting", description: "Record your swing from the side - show full stance through follow-through", focusAreas: ["bat path", "hip rotation", "contact point"] },
                            { number: 2, category: "throwing", title: "Throwing", description: "Record your throwing motion from the side - show arm action and release", focusAreas: ["arm slot", "stride length", "follow-through"] },
                            { number: 3, category: "fielding", title: "Fielding", description: "Record yourself fielding ground balls - show ready position and transfers", focusAreas: ["glove position", "footwork", "transfer speed"] },
                            { number: 4, category: "pitching_or_catching", title: "Pitching or Catching", description: "Record your pitch (if pitcher) OR a blocking/framing drill (if catcher)", focusAreas: ["arm circle", "leg drive", "release point"] },
                        ],
                        pitching_instructor: [
                            { number: 1, category: "fastball", title: "Fastball", description: "Record 3-5 fastballs from the side view - full windmill motion", focusAreas: ["arm circle", "knee drive", "hip-shoulder separation", "release point"] },
                            { number: 2, category: "drop_ball", title: "Drop Ball", description: "Record 3-5 drop balls from the side view - focus on spin and release", focusAreas: ["wrist snap", "release angle", "leg drive"] },
                            { number: 3, category: "change_up", title: "Change-up", description: "Record 3-5 change-ups - show deceptive motion and grip release", focusAreas: ["arm speed", "deception", "grip release"] },
                            { number: 4, category: "pitchers_choice", title: "Pitcher's Choice", description: "Record your specialty pitch (rise ball, curve, screw, etc.)", focusAreas: ["spin direction", "movement", "command"] },
                        ],
                        catching_instructor: [
                            { number: 1, category: "framing", title: "Framing", description: "Record yourself receiving 5+ pitches - show glove presentation and stick", focusAreas: ["glove angle", "subtle movement", "stick presentation"] },
                            { number: 2, category: "blocking", title: "Blocking", description: "Record yourself blocking balls in the dirt - show stance and body position", focusAreas: ["drop mechanics", "glove position", "body angle"] },
                            { number: 3, category: "transfer", title: "Transfer (Pop-time)", description: "Record catch-to-throw transfer - show footwork and arm action", focusAreas: ["transfer speed", "footwork", "arm slot", "pop-time"] },
                            { number: 4, category: "bunt_coverage", title: "Bunt Coverage", description: "Record fielding bunts - show explosiveness and throw accuracy", focusAreas: ["first step", "barehand technique", "throw accuracy"] },
                        ],
                    };
                    // Get onboarding status (including baseline progress)
                    app.get("/api/player/onboarding", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, onboarding, baselineVideos, onboardingType, videoPrompts, err_55;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getPlayerOnboarding(userId)];
                                case 1:
                                    onboarding = _a.sent();
                                    if (!onboarding) {
                                        // No onboarding = solo player, dashboard unlocked by default
                                        return [2 /*return*/, res.json({ dashboardUnlocked: true, baselineComplete: true })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getBaselineVideos(userId)];
                                case 2:
                                    baselineVideos = _a.sent();
                                    onboardingType = onboarding.onboardingType || "team_coach";
                                    videoPrompts = VIDEO_PROMPTS[onboardingType] || VIDEO_PROMPTS.team_coach;
                                    res.json(__assign(__assign({}, onboarding), { baselineVideoCount: baselineVideos.length, baselineVideosRequired: 4, baselineVideos: baselineVideos, videoPrompts: videoPrompts }));
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_55 = _a.sent();
                                    throw err_55;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Upload baseline video
                    app.post("/api/player/baseline-video", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, videoSchema, data, onboarding, skillType, athlete, assessmentId, assessment, video, allVideos, coach, coach, err_56;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 15, , 16]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    videoSchema = zod_1.z.object({
                                        videoUrl: zod_1.z.string().url(),
                                        videoNumber: zod_1.z.number().min(1).max(4),
                                        videoCategory: zod_1.z.string(), // e.g., "fastball", "hitting", "framing"
                                        durationSeconds: zod_1.z.number().optional(),
                                    });
                                    data = videoSchema.parse(req.body);
                                    // Validate duration is at least 20 seconds
                                    if (data.durationSeconds && data.durationSeconds < 20) {
                                        return [2 /*return*/, res.status(400).json({ message: "Video must be at least 20 seconds long" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getPlayerOnboarding(userId)];
                                case 1:
                                    onboarding = _a.sent();
                                    if (!onboarding) {
                                        return [2 /*return*/, res.status(400).json({ message: "No onboarding record found" })];
                                    }
                                    skillType = onboarding.skillType || "GENERAL";
                                    if (["fastball", "drop_ball", "change_up", "pitchers_choice"].includes(data.videoCategory)) {
                                        skillType = "PITCHING";
                                    }
                                    else if (["framing", "blocking", "transfer", "bunt_coverage"].includes(data.videoCategory)) {
                                        skillType = "CATCHING";
                                    }
                                    else if (data.videoCategory === "hitting") {
                                        skillType = "HITTING";
                                    }
                                    else if (data.videoCategory === "throwing") {
                                        skillType = "THROWING";
                                    }
                                    else if (data.videoCategory === "fielding") {
                                        skillType = "FIELDING";
                                    }
                                    return [4 /*yield*/, storage_1.storage.getAthleteByUserId(userId)];
                                case 2:
                                    athlete = _a.sent();
                                    assessmentId = void 0;
                                    if (!athlete) return [3 /*break*/, 4];
                                    return [4 /*yield*/, storage_1.storage.createAssessment({
                                            athleteId: athlete.id,
                                            coachId: onboarding.coachId || undefined,
                                            skillType: skillType,
                                            videoUrl: data.videoUrl,
                                            notes: "Baseline ".concat(data.videoCategory, " video - ").concat(new Date().toLocaleDateString()),
                                        })];
                                case 3:
                                    assessment = _a.sent();
                                    assessmentId = assessment.id;
                                    _a.label = 4;
                                case 4: return [4 /*yield*/, storage_1.storage.createBaselineVideo({
                                        userId: userId,
                                        coachId: onboarding.coachId,
                                        skillType: skillType,
                                        videoCategory: data.videoCategory,
                                        videoNumber: data.videoNumber,
                                        videoUrl: data.videoUrl,
                                        durationSeconds: data.durationSeconds,
                                        status: "analyzing",
                                        assessmentId: assessmentId,
                                    })];
                                case 5:
                                    video = _a.sent();
                                    return [4 /*yield*/, storage_1.storage.getBaselineVideos(userId)];
                                case 6:
                                    allVideos = _a.sent();
                                    if (!(allVideos.length >= 4)) return [3 /*break*/, 11];
                                    // Mark baseline as complete but keep dashboard locked until coach approves
                                    return [4 /*yield*/, storage_1.storage.updatePlayerOnboarding(userId, { baselineComplete: true })];
                                case 7:
                                    // Mark baseline as complete but keep dashboard locked until coach approves
                                    _a.sent();
                                    if (!onboarding.coachId) return [3 /*break*/, 10];
                                    return [4 /*yield*/, storage_1.storage.getCoach(onboarding.coachId)];
                                case 8:
                                    coach = _a.sent();
                                    if (!(coach === null || coach === void 0 ? void 0 : coach.userId)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, storage_1.storage.createNotification({
                                            userId: coach.userId,
                                            type: "baseline_ready",
                                            title: "Baseline Ready for Review",
                                            message: "A new student has completed their 4-video baseline. Click to review and create their training roadmap.",
                                            linkUrl: "/roster",
                                            relatedId: userId,
                                        })];
                                case 9:
                                    _a.sent();
                                    _a.label = 10;
                                case 10: return [3 /*break*/, 14];
                                case 11:
                                    if (!onboarding.coachId) return [3 /*break*/, 14];
                                    return [4 /*yield*/, storage_1.storage.getCoach(onboarding.coachId)];
                                case 12:
                                    coach = _a.sent();
                                    if (!(coach === null || coach === void 0 ? void 0 : coach.userId)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, storage_1.storage.createNotification({
                                            userId: coach.userId,
                                            type: "video_uploaded",
                                            title: "New Video Uploaded",
                                            message: "Student uploaded baseline video ".concat(data.videoNumber, "/4. ").concat(4 - allVideos.length, " more to go."),
                                            linkUrl: "/roster",
                                            relatedId: userId,
                                        })];
                                case 13:
                                    _a.sent();
                                    _a.label = 14;
                                case 14:
                                    res.status(201).json({
                                        video: video,
                                        totalUploaded: allVideos.length,
                                        remaining: Math.max(0, 4 - allVideos.length),
                                        baselineComplete: allVideos.length >= 4,
                                    });
                                    return [3 /*break*/, 16];
                                case 15:
                                    err_56 = _a.sent();
                                    if (err_56 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_56.errors[0].message })];
                                    }
                                    throw err_56;
                                case 16: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Coach: Get students needing baseline review
                    app.get("/api/specialist/baseline-queue", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, relationships, needsReview, err_57;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach)
                                        return [2 /*return*/, res.json([])];
                                    return [4 /*yield*/, storage_1.storage.getCoachPlayers(coach.id)];
                                case 2:
                                    relationships = _a.sent();
                                    return [4 /*yield*/, Promise.all(relationships.map(function (rel) { return __awaiter(_this, void 0, void 0, function () {
                                            var onboarding, videos;
                                            var _a, _b, _c, _d;
                                            return __generator(this, function (_e) {
                                                switch (_e.label) {
                                                    case 0: return [4 /*yield*/, storage_1.storage.getPlayerOnboarding(rel.playerId)];
                                                    case 1:
                                                        onboarding = _e.sent();
                                                        return [4 /*yield*/, storage_1.storage.getBaselineVideos(rel.playerId)];
                                                    case 2:
                                                        videos = _e.sent();
                                                        if ((onboarding === null || onboarding === void 0 ? void 0 : onboarding.baselineComplete) && !(onboarding === null || onboarding === void 0 ? void 0 : onboarding.dashboardUnlocked)) {
                                                            return [2 /*return*/, {
                                                                    playerId: rel.playerId,
                                                                    playerName: ((_a = rel.player) === null || _a === void 0 ? void 0 : _a.firstName) && ((_b = rel.player) === null || _b === void 0 ? void 0 : _b.lastName)
                                                                        ? "".concat(rel.player.firstName, " ").concat(rel.player.lastName)
                                                                        : (_c = rel.player) === null || _c === void 0 ? void 0 : _c.email,
                                                                    skillType: rel.skillType,
                                                                    videos: videos,
                                                                    submittedAt: (_d = videos[videos.length - 1]) === null || _d === void 0 ? void 0 : _d.createdAt,
                                                                }];
                                                        }
                                                        return [2 /*return*/, null];
                                                }
                                            });
                                        }); }))];
                                case 3:
                                    needsReview = _a.sent();
                                    res.json(needsReview.filter(Boolean));
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_57 = _a.sent();
                                    throw err_57;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Coach: Approve baseline and unlock dashboard
                    app.post("/api/specialist/baseline/:playerId/approve", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, playerId_1, coach, relationships, isMyStudent, err_58;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    playerId_1 = req.params.playerId;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach) {
                                        return [2 /*return*/, res.status(403).json({ message: "Only instructors can approve baselines" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getCoachPlayers(coach.id)];
                                case 2:
                                    relationships = _a.sent();
                                    isMyStudent = relationships.some(function (rel) { return rel.playerId === playerId_1 && rel.status === "active"; });
                                    if (!isMyStudent) {
                                        return [2 /*return*/, res.status(403).json({ message: "You can only approve baselines for your own students" })];
                                    }
                                    // Unlock dashboard
                                    return [4 /*yield*/, storage_1.storage.updatePlayerOnboarding(playerId_1, {
                                            dashboardUnlocked: true,
                                            baselineApprovedAt: new Date(),
                                            // Set next video prompt for 2 weeks later
                                            nextVideoPromptDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        })];
                                case 3:
                                    // Unlock dashboard
                                    _a.sent();
                                    // NOTIFICATION TRIGGER: Notify player that roadmap is ready
                                    return [4 /*yield*/, storage_1.storage.createNotification({
                                            userId: playerId_1,
                                            type: "roadmap_ready",
                                            title: "Your Training Roadmap is Ready!",
                                            message: "Your coach has reviewed your baseline videos and created a personalized training plan. Your dashboard is now unlocked!",
                                            linkUrl: "/dashboard",
                                            relatedId: coach.id.toString(),
                                        })];
                                case 4:
                                    // NOTIFICATION TRIGGER: Notify player that roadmap is ready
                                    _a.sent();
                                    res.json({ message: "Baseline approved, dashboard unlocked for student" });
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_58 = _a.sent();
                                    throw err_58;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === UNIVERSAL NOTIFICATION ENGINE ===
                    // Get all notifications for current user
                    app.get("/api/notifications", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, notifications, unreadCount, err_59;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getNotifications(userId)];
                                case 1:
                                    notifications = _a.sent();
                                    return [4 /*yield*/, storage_1.storage.getUnreadNotificationCount(userId)];
                                case 2:
                                    unreadCount = _a.sent();
                                    res.json({ notifications: notifications, unreadCount: unreadCount });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_59 = _a.sent();
                                    throw err_59;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get unread notification count
                    app.get("/api/notifications/unread-count", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, count, err_60;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getUnreadNotificationCount(userId)];
                                case 1:
                                    count = _a.sent();
                                    res.json({ count: count });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_60 = _a.sent();
                                    throw err_60;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Mark notification as read (with ownership verification)
                    app.patch("/api/notifications/:id/read", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, notificationId_1, userNotifications, ownsNotification, notification, err_61;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    notificationId_1 = parseInt(req.params.id);
                                    return [4 /*yield*/, storage_1.storage.getNotifications(userId)];
                                case 1:
                                    userNotifications = _a.sent();
                                    ownsNotification = userNotifications.some(function (n) { return n.id === notificationId_1; });
                                    if (!ownsNotification) {
                                        return [2 /*return*/, res.status(403).json({ message: "You can only mark your own notifications as read" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.markNotificationRead(notificationId_1)];
                                case 2:
                                    notification = _a.sent();
                                    res.json(notification);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_61 = _a.sent();
                                    throw err_61;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Mark all notifications as read
                    app.patch("/api/notifications/read-all", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, err_62;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.markAllNotificationsRead(userId)];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "All notifications marked as read" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_62 = _a.sent();
                                    throw err_62;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === GAMECHANGER STATS IMPORT ===
                    // Import stats from CSV
                    app.post("/api/stats/import", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, statsSchema, stats, athlete, savedStats, err_63;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    userId = req.user.claims.sub;
                                    statsSchema = zod_1.z.object({
                                        name: zod_1.z.string().optional(),
                                        pos: zod_1.z.string().optional(),
                                        avg: zod_1.z.string().optional(),
                                        ops: zod_1.z.string().optional(),
                                        era: zod_1.z.string().optional(),
                                        whip: zod_1.z.string().optional(),
                                        kPercent: zod_1.z.string().optional(),
                                        firstPitchStrikePercent: zod_1.z.string().optional(),
                                        exitVelocity: zod_1.z.string().optional(),
                                    });
                                    stats = statsSchema.parse(req.body);
                                    return [4 /*yield*/, storage_1.storage.getAthleteByUserId(userId)];
                                case 1:
                                    athlete = _a.sent();
                                    return [4 /*yield*/, storage_1.storage.createGameChangerStats({
                                            userId: userId,
                                            athleteId: athlete === null || athlete === void 0 ? void 0 : athlete.id,
                                            season: "2025-2026",
                                            avg: stats.avg ? stats.avg : null,
                                            ops: stats.ops ? stats.ops : null,
                                            era: stats.era ? stats.era : null,
                                            whip: stats.whip ? stats.whip : null,
                                            kPercent: stats.kPercent ? stats.kPercent : null,
                                            firstPitchStrikePercent: stats.firstPitchStrikePercent ? stats.firstPitchStrikePercent : null,
                                            exitVelocity: stats.exitVelocity ? stats.exitVelocity : null,
                                            rawData: stats,
                                        })];
                                case 2:
                                    savedStats = _a.sent();
                                    res.json({ success: true, stats: savedStats });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_63 = _a.sent();
                                    if (err_63 instanceof zod_1.z.ZodError) {
                                        return [2 /*return*/, res.status(400).json({ message: err_63.errors[0].message })];
                                    }
                                    throw err_63;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get current user's stats
                    app.get("/api/stats", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, stats, err_64;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getGameChangerStatsByUserId(userId)];
                                case 1:
                                    stats = _a.sent();
                                    res.json(stats || null);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_64 = _a.sent();
                                    throw err_64;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === PUBLIC RECRUITING PROFILE ===
                    // Get public profile by athlete ID (no auth required)
                    app.get("/api/profile/public/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var athleteId, athlete, teamName, team, err_65;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    athleteId = parseInt(req.params.id);
                                    if (isNaN(athleteId)) {
                                        return [2 /*return*/, res.status(400).json({ message: "Invalid athlete ID" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getAthlete(athleteId)];
                                case 1:
                                    athlete = _a.sent();
                                    if (!athlete) {
                                        return [2 /*return*/, res.status(404).json({ message: "Athlete not found" })];
                                    }
                                    teamName = null;
                                    if (!athlete.teamId) return [3 /*break*/, 3];
                                    return [4 /*yield*/, storage_1.storage.getTeam(athlete.teamId)];
                                case 2:
                                    team = _a.sent();
                                    teamName = team === null || team === void 0 ? void 0 : team.name;
                                    _a.label = 3;
                                case 3:
                                    res.json({
                                        id: athlete.id,
                                        firstName: athlete.firstName,
                                        lastName: athlete.lastName,
                                        heightInches: athlete.heightInches,
                                        primaryPosition: athlete.primaryPosition,
                                        secondaryPosition: athlete.secondaryPosition,
                                        graduationYear: athlete.graduationYear,
                                        school: athlete.school,
                                        teamName: teamName,
                                        photoUrl: athlete.photoUrl,
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_65 = _a.sent();
                                    throw err_65;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get public stats by athlete ID
                    app.get("/api/stats/public/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var athleteId, stats, err_66;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    athleteId = parseInt(req.params.id);
                                    if (isNaN(athleteId)) {
                                        return [2 /*return*/, res.status(400).json({ message: "Invalid athlete ID" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getGameChangerStatsByAthleteId(athleteId)];
                                case 1:
                                    stats = _a.sent();
                                    if (!stats) {
                                        // Return demo stats for demo profile
                                        return [2 /*return*/, res.json({
                                                era: "1.25",
                                                whip: "0.89",
                                                kPercent: "35%",
                                                firstPitchStrikePercent: "68%",
                                                avg: ".385",
                                                ops: ".975",
                                                exitVelocity: "67",
                                            })];
                                    }
                                    res.json({
                                        avg: stats.avg,
                                        ops: stats.ops,
                                        era: stats.era,
                                        whip: stats.whip,
                                        kPercent: stats.kPercent ? "".concat(stats.kPercent, "%") : null,
                                        firstPitchStrikePercent: stats.firstPitchStrikePercent ? "".concat(stats.firstPitchStrikePercent, "%") : null,
                                        exitVelocity: stats.exitVelocity,
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_66 = _a.sent();
                                    throw err_66;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get public AI analysis by athlete ID
                    app.get("/api/analysis/public/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var athleteId, analysis, err_67;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    athleteId = parseInt(req.params.id);
                                    if (isNaN(athleteId)) {
                                        return [2 /*return*/, res.status(400).json({ message: "Invalid athlete ID" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getSkeletalAnalysisByAthleteId(athleteId)];
                                case 1:
                                    analysis = _b.sent();
                                    if (!analysis) {
                                        // Return demo analysis for demo profile
                                        return [2 /*return*/, res.json({
                                                highlights: [
                                                    { title: "Elite Arm Circle Speed", grade: "A" },
                                                    { title: "Strong Knee Drive", grade: "A-" },
                                                    { title: "Optimal Release Point", grade: "B+" },
                                                    { title: "Explosive Hip Rotation", grade: "A" },
                                                ]
                                            })];
                                    }
                                    res.json({
                                        highlights: ((_a = analysis.highlights) === null || _a === void 0 ? void 0 : _a.map(function (h) { return ({ title: h, grade: "A" }); })) || [],
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_67 = _b.sent();
                                    throw err_67;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get public goals by athlete ID
                    app.get("/api/goals/public/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var athleteId;
                        return __generator(this, function (_a) {
                            try {
                                athleteId = parseInt(req.params.id);
                                if (isNaN(athleteId)) {
                                    return [2 /*return*/, res.status(400).json({ message: "Invalid athlete ID" })];
                                }
                                // For now return demo goals - will integrate with actual goal storage later
                                res.json([
                                    { metric: "velocity", metricLabel: "Increase Velocity", target: 5, unit: "mph", currentBaseline: 58, progress: 60 },
                                    { metric: "spin_rate", metricLabel: "Improve Spin Rate", target: 200, unit: "rpm", currentBaseline: 1800, progress: 45 },
                                    { metric: "strike_zone", metricLabel: "Strike Zone %", target: 70, unit: "%", currentBaseline: 62, progress: 75 },
                                ]);
                            }
                            catch (err) {
                                throw err;
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // === STRIPE PAYMENT ROUTES ===
                    // Get Stripe publishable key
                    app.get("/api/stripe/config", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var publishableKey, err_68;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, (0, stripeClient_1.getStripePublishableKey)()];
                                case 1:
                                    publishableKey = _a.sent();
                                    res.json({ publishableKey: publishableKey });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_68 = _a.sent();
                                    console.error("Failed to get Stripe config:", err_68);
                                    res.status(500).json({ message: "Stripe not configured" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // List products with prices
                    app.get("/api/stripe/products", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var products, productsMap, _i, products_1, row, err_69;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, stripeService_1.stripeService.listProductsWithPrices()];
                                case 1:
                                    products = _a.sent();
                                    productsMap = new Map();
                                    for (_i = 0, products_1 = products; _i < products_1.length; _i++) {
                                        row = products_1[_i];
                                        if (!productsMap.has(row.product_id)) {
                                            productsMap.set(row.product_id, {
                                                id: row.product_id,
                                                name: row.product_name,
                                                description: row.product_description,
                                                active: row.product_active,
                                                metadata: row.product_metadata,
                                                prices: []
                                            });
                                        }
                                        if (row.price_id) {
                                            productsMap.get(row.product_id).prices.push({
                                                id: row.price_id,
                                                unit_amount: row.unit_amount,
                                                currency: row.currency,
                                                recurring: row.recurring,
                                                active: row.price_active,
                                                metadata: row.price_metadata,
                                            });
                                        }
                                    }
                                    res.json(Array.from(productsMap.values()));
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_69 = _a.sent();
                                    console.error("Failed to list products:", err_69);
                                    res.status(500).json({ message: "Failed to list products" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Validate coupon code
                    app.post("/api/stripe/validate-coupon", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var code, coupon, err_70;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    code = req.body.code;
                                    if (!code) {
                                        return [2 /*return*/, res.status(400).json({ valid: false, message: "Coupon code required" })];
                                    }
                                    return [4 /*yield*/, stripeService_1.stripeService.validateCoupon(code.toUpperCase())];
                                case 1:
                                    coupon = _b.sent();
                                    if (coupon) {
                                        res.json({
                                            valid: true,
                                            percentOff: coupon.percent_off,
                                            amountOff: coupon.amount_off,
                                            badge: ((_a = coupon.metadata) === null || _a === void 0 ? void 0 : _a.badge) || null
                                        });
                                    }
                                    else {
                                        res.json({ valid: false });
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_70 = _b.sent();
                                    console.error("Coupon validation error:", err_70);
                                    res.json({ valid: false });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Create checkout session
                    app.post("/api/stripe/checkout", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, userClaims, _a, tier, couponCode, products, priceId, _i, products_2, row, metadata, subscription, customerId, email, name, customer, baseUrl, session, err_71;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 9, , 10]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    userClaims = req.user.claims;
                                    _a = req.body, tier = _a.tier, couponCode = _a.couponCode;
                                    if (!tier) {
                                        return [2 /*return*/, res.status(400).json({ message: "Tier is required" })];
                                    }
                                    return [4 /*yield*/, stripeService_1.stripeService.listProductsWithPrices()];
                                case 1:
                                    products = _b.sent();
                                    priceId = null;
                                    for (_i = 0, products_2 = products; _i < products_2.length; _i++) {
                                        row = products_2[_i];
                                        metadata = row.product_metadata;
                                        if ((metadata === null || metadata === void 0 ? void 0 : metadata.tier) === tier && row.price_id) {
                                            priceId = String(row.price_id);
                                            break;
                                        }
                                    }
                                    if (!priceId) {
                                        return [2 /*return*/, res.status(400).json({ message: "Invalid tier" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getUserSubscription(userId)];
                                case 2:
                                    subscription = _b.sent();
                                    customerId = subscription === null || subscription === void 0 ? void 0 : subscription.stripeCustomerId;
                                    if (!!customerId) return [3 /*break*/, 5];
                                    email = userClaims.email || "".concat(userId, "@example.com");
                                    name = "".concat(userClaims.first_name || '', " ").concat(userClaims.last_name || '').trim() || undefined;
                                    return [4 /*yield*/, stripeService_1.stripeService.createCustomer(email, userId, name)];
                                case 3:
                                    customer = _b.sent();
                                    customerId = customer.id;
                                    // Save customer ID
                                    return [4 /*yield*/, storage_1.storage.upsertUserSubscription({
                                            userId: userId,
                                            stripeCustomerId: customerId,
                                            tier: tier,
                                        })];
                                case 4:
                                    // Save customer ID
                                    _b.sent();
                                    _b.label = 5;
                                case 5:
                                    baseUrl = process.env.BASE_URL || "http://localhost:".concat(process.env.PORT || 5000);
                                    return [4 /*yield*/, stripeService_1.stripeService.createCheckoutSession(customerId, priceId, "".concat(baseUrl, "/dashboard?checkout=success"), "".concat(baseUrl, "/pricing?checkout=cancelled"), couponCode)];
                                case 6:
                                    session = _b.sent();
                                    if (!((couponCode === null || couponCode === void 0 ? void 0 : couponCode.toUpperCase()) === 'DONOR100')) return [3 /*break*/, 8];
                                    return [4 /*yield*/, storage_1.storage.upsertUserSubscription({
                                            userId: userId,
                                            stripeCustomerId: customerId,
                                            tier: tier,
                                            couponCode: 'DONOR100',
                                            isFoundingMember: true,
                                        })];
                                case 7:
                                    _b.sent();
                                    _b.label = 8;
                                case 8:
                                    res.json({ url: session.url });
                                    return [3 /*break*/, 10];
                                case 9:
                                    err_71 = _b.sent();
                                    console.error("Checkout error:", err_71);
                                    res.status(500).json({ message: "Failed to create checkout session" });
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get user subscription status
                    app.get("/api/stripe/subscription", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, subscription, err_72;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getUserSubscription(userId)];
                                case 1:
                                    subscription = _a.sent();
                                    res.json(subscription || { status: "none" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_72 = _a.sent();
                                    console.error("Subscription fetch error:", err_72);
                                    res.status(500).json({ message: "Failed to get subscription" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Create customer portal session
                    app.post("/api/stripe/portal", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, subscription, baseUrl, session, err_73;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getUserSubscription(userId)];
                                case 1:
                                    subscription = _a.sent();
                                    if (!(subscription === null || subscription === void 0 ? void 0 : subscription.stripeCustomerId)) {
                                        return [2 /*return*/, res.status(400).json({ message: "No subscription found" })];
                                    }
                                    baseUrl = process.env.BASE_URL || "http://localhost:".concat(process.env.PORT || 5000);
                                    return [4 /*yield*/, stripeService_1.stripeService.createCustomerPortalSession(subscription.stripeCustomerId, "".concat(baseUrl, "/dashboard"))];
                                case 2:
                                    session = _a.sent();
                                    res.json({ url: session.url });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_73 = _a.sent();
                                    console.error("Portal error:", err_73);
                                    res.status(500).json({ message: "Failed to create portal session" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // === TEAM STATS IMPORT ===
                    // Import team stats from CSV
                    app.post("/api/team-stats/import", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, _a, teamId, csvData, season, rows, headers, dataRows, totalAvg, totalOps, totalEra, totalWhip, qabCount, avgCount, opsCount, eraCount, whipCount, _loop_1, _i, dataRows_1, row, teamStatsData, stats, err_74;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _b.sent();
                                    if (!coach) {
                                        return [2 /*return*/, res.status(403).json({ message: "Coach account required" })];
                                    }
                                    _a = req.body, teamId = _a.teamId, csvData = _a.csvData, season = _a.season;
                                    if (!csvData) {
                                        return [2 /*return*/, res.status(400).json({ message: "CSV data required" })];
                                    }
                                    rows = csvData.split('\n').filter(function (r) { return r.trim(); });
                                    if (rows.length < 2) {
                                        return [2 /*return*/, res.status(400).json({ message: "Invalid CSV format" })];
                                    }
                                    headers = rows[0].split(',').map(function (h) { return h.trim().toLowerCase(); });
                                    dataRows = rows.slice(1);
                                    totalAvg = 0, totalOps = 0, totalEra = 0, totalWhip = 0, qabCount = 0;
                                    avgCount = 0, opsCount = 0, eraCount = 0, whipCount = 0;
                                    _loop_1 = function (row) {
                                        var values = row.split(',').map(function (v) { return v.trim(); });
                                        var record = {};
                                        headers.forEach(function (h, i) {
                                            record[h] = values[i];
                                        });
                                        // Batting stats
                                        if (record.avg && !isNaN(parseFloat(record.avg))) {
                                            totalAvg += parseFloat(record.avg);
                                            avgCount++;
                                        }
                                        if (record.ops && !isNaN(parseFloat(record.ops))) {
                                            totalOps += parseFloat(record.ops);
                                            opsCount++;
                                        }
                                        // Pitching stats
                                        if (record.era && !isNaN(parseFloat(record.era))) {
                                            totalEra += parseFloat(record.era);
                                            eraCount++;
                                        }
                                        if (record.whip && !isNaN(parseFloat(record.whip))) {
                                            totalWhip += parseFloat(record.whip);
                                            whipCount++;
                                        }
                                        // Quality at-bats (estimate based on OPS > .700 or AVG > .300)
                                        var playerOps = parseFloat(record.ops) || 0;
                                        var playerAvg = parseFloat(record.avg) || 0;
                                        if (playerOps > 0.700 || playerAvg > 0.300) {
                                            qabCount += parseInt(record.ab || record.games_played || '10');
                                        }
                                    };
                                    for (_i = 0, dataRows_1 = dataRows; _i < dataRows_1.length; _i++) {
                                        row = dataRows_1[_i];
                                        _loop_1(row);
                                    }
                                    teamStatsData = {
                                        teamId: teamId || null,
                                        coachId: coach.id,
                                        season: season || "".concat(new Date().getFullYear(), " Season"),
                                        gamesPlayed: dataRows.length,
                                        teamAvg: avgCount > 0 ? (totalAvg / avgCount).toFixed(3) : null,
                                        teamOps: opsCount > 0 ? (totalOps / opsCount).toFixed(3) : null,
                                        teamEra: eraCount > 0 ? (totalEra / eraCount).toFixed(2) : null,
                                        teamWhip: whipCount > 0 ? (totalWhip / whipCount).toFixed(2) : null,
                                        totalQualityAtBats: qabCount,
                                        rawData: { headers: headers, rowCount: dataRows.length },
                                    };
                                    return [4 /*yield*/, storage_1.storage.createTeamStats(teamStatsData)];
                                case 2:
                                    stats = _b.sent();
                                    res.status(201).json(stats);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_74 = _b.sent();
                                    console.error("Team stats import error:", err_74);
                                    res.status(500).json({ message: "Failed to import team stats" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get team stats by team ID
                    app.get("/api/team-stats/:teamId", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var teamIdParam, teamId, stats, err_75;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    teamIdParam = req.params.teamId;
                                    teamId = parseInt(typeof teamIdParam === 'string' ? teamIdParam : teamIdParam[0]);
                                    if (isNaN(teamId)) {
                                        return [2 /*return*/, res.status(400).json({ message: "Invalid team ID" })];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getTeamStatsByTeamId(teamId)];
                                case 1:
                                    stats = _a.sent();
                                    res.json(stats || null);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_75 = _a.sent();
                                    throw err_75;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Get team stats for coach
                    app.get("/api/coach/team-stats", localAuth_1.isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, coach, stats, err_76;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!req.user)
                                        return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage_1.storage.getCoachByUserId(userId)];
                                case 1:
                                    coach = _a.sent();
                                    if (!coach) {
                                        return [2 /*return*/, res.json([])];
                                    }
                                    return [4 /*yield*/, storage_1.storage.getTeamStatsByCoachId(coach.id)];
                                case 2:
                                    stats = _a.sent();
                                    res.json(stats);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_76 = _a.sent();
                                    throw err_76;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Seed Data (if empty)
                    seedDatabase();
                    return [2 /*return*/, httpServer];
            }
        });
    });
}
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var teams, team;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage_1.storage.getTeams()];
                case 1:
                    teams = _a.sent();
                    if (!(teams.length === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, storage_1.storage.createTeam({
                            name: "Thunderbolts 14U",
                            ageDivision: "14U",
                            season: "Spring 2026",
                            active: true
                        })];
                case 2:
                    team = _a.sent();
                    return [4 /*yield*/, storage_1.storage.createAthlete({
                            firstName: "Sarah",
                            lastName: "Jenkins",
                            teamId: team.id,
                            primaryPosition: "P",
                            secondaryPosition: "1B",
                            jerseyNumber: 12,
                            bats: "R",
                            throws: "R"
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, storage_1.storage.createDrill({
                            name: "Towel Drill",
                            category: "Mechanics",
                            skillType: "pitching",
                            difficulty: "Beginner",
                            description: "Practice arm mechanics without a ball using a towel.",
                            equipment: ["Towel"]
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
