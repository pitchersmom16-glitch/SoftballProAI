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
exports.storage = exports.DatabaseStorage = void 0;
var db_1 = require("./db");
var schema_1 = require("@shared/schema");
var auth_1 = require("@shared/models/auth");
var drizzle_orm_1 = require("drizzle-orm");
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
    }
    // Coaches
    DatabaseStorage.prototype.getCoach = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var coach;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.coaches).where((0, drizzle_orm_1.eq)(schema_1.coaches.id, id))];
                    case 1:
                        coach = (_a.sent())[0];
                        return [2 /*return*/, coach];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCoachByUserId = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var coach;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.coaches).where((0, drizzle_orm_1.eq)(schema_1.coaches.userId, userId))];
                    case 1:
                        coach = (_a.sent())[0];
                        return [2 /*return*/, coach];
                }
            });
        });
    };
    DatabaseStorage.prototype.createCoach = function (coach) {
        return __awaiter(this, void 0, Promise, function () {
            var newCoach;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.coaches).values(coach).returning()];
                    case 1:
                        newCoach = (_a.sent())[0];
                        return [2 /*return*/, newCoach];
                }
            });
        });
    };
    // Teams
    DatabaseStorage.prototype.getTeam = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var team;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.teams).where((0, drizzle_orm_1.eq)(schema_1.teams.id, id))];
                    case 1:
                        team = (_a.sent())[0];
                        return [2 /*return*/, team];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTeams = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.teams)];
            });
        });
    };
    DatabaseStorage.prototype.createTeam = function (team) {
        return __awaiter(this, void 0, Promise, function () {
            var newTeam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.teams).values(team).returning()];
                    case 1:
                        newTeam = (_a.sent())[0];
                        return [2 /*return*/, newTeam];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteTeam = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // First unassign all athletes from this team
                    return [4 /*yield*/, db_1.db.update(schema_1.athletes).set({ teamId: null }).where((0, drizzle_orm_1.eq)(schema_1.athletes.teamId, id))];
                    case 1:
                        // First unassign all athletes from this team
                        _a.sent();
                        // Then delete the team
                        return [4 /*yield*/, db_1.db.delete(schema_1.teams).where((0, drizzle_orm_1.eq)(schema_1.teams.id, id))];
                    case 2:
                        // Then delete the team
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Athletes
    DatabaseStorage.prototype.getAthletes = function (teamId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                if (teamId) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.athletes).where((0, drizzle_orm_1.eq)(schema_1.athletes.teamId, teamId))];
                }
                return [2 /*return*/, db_1.db.select().from(schema_1.athletes)];
            });
        });
    };
    DatabaseStorage.prototype.getAthlete = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var athlete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.athletes).where((0, drizzle_orm_1.eq)(schema_1.athletes.id, id))];
                    case 1:
                        athlete = (_a.sent())[0];
                        return [2 /*return*/, athlete];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAthleteByUserId = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var athlete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.athletes).where((0, drizzle_orm_1.eq)(schema_1.athletes.userId, userId))];
                    case 1:
                        athlete = (_a.sent())[0];
                        return [2 /*return*/, athlete];
                }
            });
        });
    };
    DatabaseStorage.prototype.createAthlete = function (athlete) {
        return __awaiter(this, void 0, Promise, function () {
            var newAthlete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.athletes).values(athlete).returning()];
                    case 1:
                        newAthlete = (_a.sent())[0];
                        return [2 /*return*/, newAthlete];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateAthlete = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.athletes).set(update).where((0, drizzle_orm_1.eq)(schema_1.athletes.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteAthlete = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.delete(schema_1.athletes).where((0, drizzle_orm_1.eq)(schema_1.athletes.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Drills
    DatabaseStorage.prototype.getDrills = function (category) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                if (category) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.drills).where((0, drizzle_orm_1.eq)(schema_1.drills.category, category))];
                }
                return [2 /*return*/, db_1.db.select().from(schema_1.drills)];
            });
        });
    };
    DatabaseStorage.prototype.createDrill = function (drill) {
        return __awaiter(this, void 0, Promise, function () {
            var newDrill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.drills).values(drill).returning()];
                    case 1:
                        newDrill = (_a.sent())[0];
                        return [2 /*return*/, newDrill];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteDrill = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.delete(schema_1.drills).where((0, drizzle_orm_1.eq)(schema_1.drills.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Mental Edge
    DatabaseStorage.prototype.getMentalEdge = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.mentalEdge)];
            });
        });
    };
    DatabaseStorage.prototype.createMentalEdge = function (content) {
        return __awaiter(this, void 0, Promise, function () {
            var newContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.mentalEdge).values(content).returning()];
                    case 1:
                        newContent = (_a.sent())[0];
                        return [2 /*return*/, newContent];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteMentalEdge = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.delete(schema_1.mentalEdge).where((0, drizzle_orm_1.eq)(schema_1.mentalEdge.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Assessments
    DatabaseStorage.prototype.getAssessments = function (athleteId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                if (athleteId) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.assessments).where((0, drizzle_orm_1.eq)(schema_1.assessments.athleteId, athleteId)).orderBy((0, drizzle_orm_1.desc)(schema_1.assessments.createdAt))];
                }
                return [2 /*return*/, db_1.db.select().from(schema_1.assessments).orderBy((0, drizzle_orm_1.desc)(schema_1.assessments.createdAt))];
            });
        });
    };
    DatabaseStorage.prototype.getAssessment = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var assessment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.assessments).where((0, drizzle_orm_1.eq)(schema_1.assessments.id, id))];
                    case 1:
                        assessment = (_a.sent())[0];
                        return [2 /*return*/, assessment];
                }
            });
        });
    };
    DatabaseStorage.prototype.createAssessment = function (assessment) {
        return __awaiter(this, void 0, Promise, function () {
            var newAssessment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.assessments).values(assessment).returning()];
                    case 1:
                        newAssessment = (_a.sent())[0];
                        return [2 /*return*/, newAssessment];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateAssessment = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.assessments).set(update).where((0, drizzle_orm_1.eq)(schema_1.assessments.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Feedback
    DatabaseStorage.prototype.getFeedback = function (assessmentId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.assessmentFeedback).where((0, drizzle_orm_1.eq)(schema_1.assessmentFeedback.assessmentId, assessmentId))];
            });
        });
    };
    DatabaseStorage.prototype.createFeedback = function (feedback) {
        return __awaiter(this, void 0, Promise, function () {
            var newFeedback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.assessmentFeedback).values(feedback).returning()];
                    case 1:
                        newFeedback = (_a.sent())[0];
                        return [2 /*return*/, newFeedback];
                }
            });
        });
    };
    // User Role
    DatabaseStorage.prototype.getUser = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select({ id: auth_1.users.id, role: auth_1.users.role }).from(auth_1.users).where((0, drizzle_orm_1.eq)(auth_1.users.id, userId))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUserRole = function (userId, role) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(auth_1.users).set({ role: role }).where((0, drizzle_orm_1.eq)(auth_1.users.id, userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Player Check-ins
    DatabaseStorage.prototype.getPlayerCheckinByDate = function (userId, date) {
        return __awaiter(this, void 0, Promise, function () {
            var checkin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.playerCheckins)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.playerCheckins.userId, userId), (0, drizzle_orm_1.eq)(schema_1.playerCheckins.date, date)))];
                    case 1:
                        checkin = (_a.sent())[0];
                        return [2 /*return*/, checkin];
                }
            });
        });
    };
    DatabaseStorage.prototype.createPlayerCheckin = function (checkin) {
        return __awaiter(this, void 0, Promise, function () {
            var newCheckin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.playerCheckins).values(checkin).returning()];
                    case 1:
                        newCheckin = (_a.sent())[0];
                        return [2 /*return*/, newCheckin];
                }
            });
        });
    };
    // Practice Plans
    DatabaseStorage.prototype.getPracticePlans = function (teamId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                if (teamId) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.practicePlans).where((0, drizzle_orm_1.eq)(schema_1.practicePlans.teamId, teamId)).orderBy((0, drizzle_orm_1.desc)(schema_1.practicePlans.createdAt))];
                }
                return [2 /*return*/, db_1.db.select().from(schema_1.practicePlans).orderBy((0, drizzle_orm_1.desc)(schema_1.practicePlans.createdAt))];
            });
        });
    };
    DatabaseStorage.prototype.createPracticePlan = function (plan) {
        return __awaiter(this, void 0, Promise, function () {
            var newPlan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.practicePlans).values(plan).returning()];
                    case 1:
                        newPlan = (_a.sent())[0];
                        return [2 /*return*/, newPlan];
                }
            });
        });
    };
    // Coach Students (Stable)
    DatabaseStorage.prototype.getCoachStudents = function (coachId) {
        return __awaiter(this, void 0, Promise, function () {
            var students, enrichedStudents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.coachStudents).where((0, drizzle_orm_1.eq)(schema_1.coachStudents.coachId, coachId))];
                    case 1:
                        students = _a.sent();
                        return [4 /*yield*/, Promise.all(students.map(function (student) { return __awaiter(_this, void 0, void 0, function () {
                                var athlete;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!student.athleteId) return [3 /*break*/, 2];
                                            return [4 /*yield*/, db_1.db.select().from(schema_1.athletes).where((0, drizzle_orm_1.eq)(schema_1.athletes.id, student.athleteId))];
                                        case 1:
                                            athlete = (_a.sent())[0];
                                            return [2 /*return*/, __assign(__assign({}, student), { athlete: athlete })];
                                        case 2: return [2 /*return*/, student];
                                    }
                                });
                            }); }))];
                    case 2:
                        enrichedStudents = _a.sent();
                        return [2 /*return*/, enrichedStudents];
                }
            });
        });
    };
    DatabaseStorage.prototype.createCoachStudent = function (student) {
        return __awaiter(this, void 0, Promise, function () {
            var newStudent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.coachStudents).values(student).returning()];
                    case 1:
                        newStudent = (_a.sent())[0];
                        return [2 /*return*/, newStudent];
                }
            });
        });
    };
    // Homework Assignments
    DatabaseStorage.prototype.getHomeworkAssignments = function (coachId, athleteId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                if (coachId && athleteId) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.homeworkAssignments)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.homeworkAssignments.coachId, coachId), (0, drizzle_orm_1.eq)(schema_1.homeworkAssignments.athleteId, athleteId)))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.homeworkAssignments.createdAt))];
                }
                if (coachId) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.homeworkAssignments).where((0, drizzle_orm_1.eq)(schema_1.homeworkAssignments.coachId, coachId)).orderBy((0, drizzle_orm_1.desc)(schema_1.homeworkAssignments.createdAt))];
                }
                if (athleteId) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.homeworkAssignments).where((0, drizzle_orm_1.eq)(schema_1.homeworkAssignments.athleteId, athleteId)).orderBy((0, drizzle_orm_1.desc)(schema_1.homeworkAssignments.createdAt))];
                }
                return [2 /*return*/, db_1.db.select().from(schema_1.homeworkAssignments).orderBy((0, drizzle_orm_1.desc)(schema_1.homeworkAssignments.createdAt))];
            });
        });
    };
    DatabaseStorage.prototype.createHomeworkAssignment = function (assignment) {
        return __awaiter(this, void 0, Promise, function () {
            var newAssignment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.homeworkAssignments).values(assignment).returning()];
                    case 1:
                        newAssignment = (_a.sent())[0];
                        return [2 /*return*/, newAssignment];
                }
            });
        });
    };
    // Player-Coach Relationships (Hybrid Coaching)
    DatabaseStorage.prototype.getPlayerCoaches = function (playerId) {
        return __awaiter(this, void 0, Promise, function () {
            var relationships, enriched;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.playerCoachRelationships)
                            .where((0, drizzle_orm_1.eq)(schema_1.playerCoachRelationships.playerId, playerId))];
                    case 1:
                        relationships = _a.sent();
                        return [4 /*yield*/, Promise.all(relationships.map(function (rel) { return __awaiter(_this, void 0, void 0, function () {
                                var coach;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.coaches).where((0, drizzle_orm_1.eq)(schema_1.coaches.id, rel.coachId))];
                                        case 1:
                                            coach = (_a.sent())[0];
                                            return [2 /*return*/, __assign(__assign({}, rel), { coach: coach })];
                                    }
                                });
                            }); }))];
                    case 2:
                        enriched = _a.sent();
                        return [2 /*return*/, enriched];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCoachPlayers = function (coachId) {
        return __awaiter(this, void 0, Promise, function () {
            var relationships, enriched;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.playerCoachRelationships)
                            .where((0, drizzle_orm_1.eq)(schema_1.playerCoachRelationships.coachId, coachId))];
                    case 1:
                        relationships = _a.sent();
                        return [4 /*yield*/, Promise.all(relationships.map(function (rel) { return __awaiter(_this, void 0, void 0, function () {
                                var player;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db_1.db.select().from(auth_1.users).where((0, drizzle_orm_1.eq)(auth_1.users.id, rel.playerId))];
                                        case 1:
                                            player = (_a.sent())[0];
                                            return [2 /*return*/, __assign(__assign({}, rel), { player: player })];
                                    }
                                });
                            }); }))];
                    case 2:
                        enriched = _a.sent();
                        return [2 /*return*/, enriched];
                }
            });
        });
    };
    DatabaseStorage.prototype.createPlayerCoachRelationship = function (rel) {
        return __awaiter(this, void 0, Promise, function () {
            var newRel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.playerCoachRelationships).values(rel).returning()];
                    case 1:
                        newRel = (_a.sent())[0];
                        return [2 /*return*/, newRel];
                }
            });
        });
    };
    DatabaseStorage.prototype.updatePlayerCoachRelationship = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.playerCoachRelationships).set(update).where((0, drizzle_orm_1.eq)(schema_1.playerCoachRelationships.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.deletePlayerCoachRelationship = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.delete(schema_1.playerCoachRelationships).where((0, drizzle_orm_1.eq)(schema_1.playerCoachRelationships.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Coach Invites
    DatabaseStorage.prototype.getPlayerInvites = function (playerId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.coachInvites)
                        .where((0, drizzle_orm_1.eq)(schema_1.coachInvites.fromPlayerId, playerId))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.coachInvites.createdAt))];
            });
        });
    };
    DatabaseStorage.prototype.getCoachInvites = function (coachId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.coachInvites)
                        .where((0, drizzle_orm_1.eq)(schema_1.coachInvites.toCoachId, coachId))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.coachInvites.createdAt))];
            });
        });
    };
    DatabaseStorage.prototype.getInviteByToken = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var invite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.coachInvites)
                            .where((0, drizzle_orm_1.eq)(schema_1.coachInvites.inviteToken, token))];
                    case 1:
                        invite = (_a.sent())[0];
                        return [2 /*return*/, invite];
                }
            });
        });
    };
    DatabaseStorage.prototype.createCoachInvite = function (invite) {
        return __awaiter(this, void 0, Promise, function () {
            var newInvite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.coachInvites).values(invite).returning()];
                    case 1:
                        newInvite = (_a.sent())[0];
                        return [2 /*return*/, newInvite];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateCoachInvite = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.coachInvites).set(update).where((0, drizzle_orm_1.eq)(schema_1.coachInvites.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Player Settings
    DatabaseStorage.prototype.getPlayerSettings = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var settings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.playerSettings)
                            .where((0, drizzle_orm_1.eq)(schema_1.playerSettings.userId, userId))];
                    case 1:
                        settings = (_a.sent())[0];
                        return [2 /*return*/, settings];
                }
            });
        });
    };
    DatabaseStorage.prototype.createPlayerSettings = function (settings) {
        return __awaiter(this, void 0, Promise, function () {
            var newSettings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.playerSettings).values(settings).returning()];
                    case 1:
                        newSettings = (_a.sent())[0];
                        return [2 /*return*/, newSettings];
                }
            });
        });
    };
    DatabaseStorage.prototype.updatePlayerSettings = function (userId, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.playerSettings)
                            .set(__assign(__assign({}, update), { updatedAt: new Date() }))
                            .where((0, drizzle_orm_1.eq)(schema_1.playerSettings.userId, userId))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Assessments by status (for coach review queue)
    DatabaseStorage.prototype.getAssessmentsByStatus = function (status, coachId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                if (coachId) {
                    return [2 /*return*/, db_1.db.select().from(schema_1.assessments)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.assessments.status, status), (0, drizzle_orm_1.eq)(schema_1.assessments.coachId, coachId)))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.assessments.createdAt))];
                }
                return [2 /*return*/, db_1.db.select().from(schema_1.assessments)
                        .where((0, drizzle_orm_1.eq)(schema_1.assessments.status, status))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.assessments.createdAt))];
            });
        });
    };
    // === SPECIALIST COACH MODE ===
    // Student Invites (Smart Invite System)
    DatabaseStorage.prototype.getStudentInvitesByCoach = function (coachId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.studentInvites)
                        .where((0, drizzle_orm_1.eq)(schema_1.studentInvites.coachId, coachId))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.studentInvites.createdAt))];
            });
        });
    };
    DatabaseStorage.prototype.getStudentInviteByToken = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var invite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.studentInvites)
                            .where((0, drizzle_orm_1.eq)(schema_1.studentInvites.inviteToken, token))];
                    case 1:
                        invite = (_a.sent())[0];
                        return [2 /*return*/, invite];
                }
            });
        });
    };
    DatabaseStorage.prototype.createStudentInvite = function (invite) {
        return __awaiter(this, void 0, Promise, function () {
            var newInvite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.studentInvites).values(invite).returning()];
                    case 1:
                        newInvite = (_a.sent())[0];
                        return [2 /*return*/, newInvite];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateStudentInvite = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.studentInvites).set(update).where((0, drizzle_orm_1.eq)(schema_1.studentInvites.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCoachActiveStudentCount = function (coachId) {
        return __awaiter(this, void 0, Promise, function () {
            var relationships;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.playerCoachRelationships)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.playerCoachRelationships.coachId, coachId), (0, drizzle_orm_1.eq)(schema_1.playerCoachRelationships.status, "active")))];
                    case 1:
                        relationships = _a.sent();
                        return [2 /*return*/, relationships.length];
                }
            });
        });
    };
    // Baseline Videos
    DatabaseStorage.prototype.getBaselineVideos = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.baselineVideos)
                        .where((0, drizzle_orm_1.eq)(schema_1.baselineVideos.userId, userId))
                        .orderBy(schema_1.baselineVideos.videoNumber)];
            });
        });
    };
    DatabaseStorage.prototype.createBaselineVideo = function (video) {
        return __awaiter(this, void 0, Promise, function () {
            var newVideo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.baselineVideos).values(video).returning()];
                    case 1:
                        newVideo = (_a.sent())[0];
                        return [2 /*return*/, newVideo];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateBaselineVideo = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.baselineVideos).set(update).where((0, drizzle_orm_1.eq)(schema_1.baselineVideos.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Player Onboarding
    DatabaseStorage.prototype.getPlayerOnboarding = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var onboarding;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.playerOnboarding)
                            .where((0, drizzle_orm_1.eq)(schema_1.playerOnboarding.userId, userId))];
                    case 1:
                        onboarding = (_a.sent())[0];
                        return [2 /*return*/, onboarding];
                }
            });
        });
    };
    DatabaseStorage.prototype.createPlayerOnboarding = function (onboarding) {
        return __awaiter(this, void 0, Promise, function () {
            var newOnboarding;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.playerOnboarding).values(onboarding).returning()];
                    case 1:
                        newOnboarding = (_a.sent())[0];
                        return [2 /*return*/, newOnboarding];
                }
            });
        });
    };
    DatabaseStorage.prototype.updatePlayerOnboarding = function (userId, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.playerOnboarding)
                            .set(__assign(__assign({}, update), { updatedAt: new Date() }))
                            .where((0, drizzle_orm_1.eq)(schema_1.playerOnboarding.userId, userId))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Coach by referral code
    DatabaseStorage.prototype.getCoachByReferralCode = function (code) {
        return __awaiter(this, void 0, Promise, function () {
            var coach;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.coaches)
                            .where((0, drizzle_orm_1.eq)(schema_1.coaches.referralCode, code))];
                    case 1:
                        coach = (_a.sent())[0];
                        return [2 /*return*/, coach];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateCoach = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.coaches).set(update).where((0, drizzle_orm_1.eq)(schema_1.coaches.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Team referral and update
    DatabaseStorage.prototype.getTeamByReferralCode = function (code) {
        return __awaiter(this, void 0, Promise, function () {
            var team;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.teams)
                            .where((0, drizzle_orm_1.eq)(schema_1.teams.referralCode, code))];
                    case 1:
                        team = (_a.sent())[0];
                        return [2 /*return*/, team];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateTeam = function (id, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.teams).set(update).where((0, drizzle_orm_1.eq)(schema_1.teams.id, id)).returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTeamsByHeadCoach = function (coachId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.teams)
                        .where((0, drizzle_orm_1.eq)(schema_1.teams.headCoachId, coachId))];
            });
        });
    };
    // === NOTIFICATIONS ===
    DatabaseStorage.prototype.getNotifications = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.notifications)
                        .where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, userId))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt))];
            });
        });
    };
    DatabaseStorage.prototype.getUnreadNotificationCount = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var unread;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.notifications)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.userId, userId), (0, drizzle_orm_1.eq)(schema_1.notifications.read, false)))];
                    case 1:
                        unread = _a.sent();
                        return [2 /*return*/, unread.length];
                }
            });
        });
    };
    DatabaseStorage.prototype.createNotification = function (notification) {
        return __awaiter(this, void 0, Promise, function () {
            var newNotification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.notifications).values(notification).returning()];
                    case 1:
                        newNotification = (_a.sent())[0];
                        return [2 /*return*/, newNotification];
                }
            });
        });
    };
    DatabaseStorage.prototype.markNotificationRead = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.notifications)
                            .set({ read: true })
                            .where((0, drizzle_orm_1.eq)(schema_1.notifications.id, id))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.markAllNotificationsRead = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.notifications)
                            .set({ read: true })
                            .where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // === GAMECHANGER STATS ===
    DatabaseStorage.prototype.createGameChangerStats = function (stats) {
        return __awaiter(this, void 0, Promise, function () {
            var newStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.gameChangerStats).values(stats).returning()];
                    case 1:
                        newStats = (_a.sent())[0];
                        return [2 /*return*/, newStats];
                }
            });
        });
    };
    DatabaseStorage.prototype.getGameChangerStatsByUserId = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.gameChangerStats)
                            .where((0, drizzle_orm_1.eq)(schema_1.gameChangerStats.userId, userId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.gameChangerStats.createdAt))];
                    case 1:
                        stats = (_a.sent())[0];
                        return [2 /*return*/, stats];
                }
            });
        });
    };
    DatabaseStorage.prototype.getGameChangerStatsByAthleteId = function (athleteId) {
        return __awaiter(this, void 0, Promise, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.gameChangerStats)
                            .where((0, drizzle_orm_1.eq)(schema_1.gameChangerStats.athleteId, athleteId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.gameChangerStats.createdAt))];
                    case 1:
                        stats = (_a.sent())[0];
                        return [2 /*return*/, stats];
                }
            });
        });
    };
    // === SKELETAL ANALYSIS ===
    DatabaseStorage.prototype.createSkeletalAnalysis = function (analysis) {
        return __awaiter(this, void 0, Promise, function () {
            var newAnalysis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.skeletalAnalysis).values(analysis).returning()];
                    case 1:
                        newAnalysis = (_a.sent())[0];
                        return [2 /*return*/, newAnalysis];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSkeletalAnalysisByAthleteId = function (athleteId) {
        return __awaiter(this, void 0, Promise, function () {
            var analysis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.skeletalAnalysis)
                            .where((0, drizzle_orm_1.eq)(schema_1.skeletalAnalysis.athleteId, athleteId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.skeletalAnalysis.createdAt))];
                    case 1:
                        analysis = (_a.sent())[0];
                        return [2 /*return*/, analysis];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSkeletalAnalysisByUserId = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var analysis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.skeletalAnalysis)
                            .where((0, drizzle_orm_1.eq)(schema_1.skeletalAnalysis.userId, userId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.skeletalAnalysis.createdAt))];
                    case 1:
                        analysis = (_a.sent())[0];
                        return [2 /*return*/, analysis];
                }
            });
        });
    };
    // === TEAM STATS ===
    DatabaseStorage.prototype.createTeamStats = function (stats) {
        return __awaiter(this, void 0, Promise, function () {
            var newStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.teamStats).values(stats).returning()];
                    case 1:
                        newStats = (_a.sent())[0];
                        return [2 /*return*/, newStats];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTeamStatsByTeamId = function (teamId) {
        return __awaiter(this, void 0, Promise, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.teamStats)
                            .where((0, drizzle_orm_1.eq)(schema_1.teamStats.teamId, teamId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.teamStats.createdAt))];
                    case 1:
                        stats = (_a.sent())[0];
                        return [2 /*return*/, stats];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTeamStatsByCoachId = function (coachId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.select().from(schema_1.teamStats)
                        .where((0, drizzle_orm_1.eq)(schema_1.teamStats.coachId, coachId))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.teamStats.createdAt))];
            });
        });
    };
    // === USER SUBSCRIPTIONS ===
    DatabaseStorage.prototype.getUserSubscription = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var sub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.userSubscriptions)
                            .where((0, drizzle_orm_1.eq)(schema_1.userSubscriptions.userId, userId))];
                    case 1:
                        sub = (_a.sent())[0];
                        return [2 /*return*/, sub];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUserSubscription = function (sub) {
        return __awaiter(this, void 0, Promise, function () {
            var newSub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.insert(schema_1.userSubscriptions).values(sub).returning()];
                    case 1:
                        newSub = (_a.sent())[0];
                        return [2 /*return*/, newSub];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUserSubscription = function (userId, update) {
        return __awaiter(this, void 0, Promise, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.update(schema_1.userSubscriptions)
                            .set(update)
                            .where((0, drizzle_orm_1.eq)(schema_1.userSubscriptions.userId, userId))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseStorage.prototype.upsertUserSubscription = function (sub) {
        return __awaiter(this, void 0, Promise, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserSubscription(sub.userId)];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            return [2 /*return*/, this.updateUserSubscription(sub.userId, sub)];
                        }
                        return [2 /*return*/, this.createUserSubscription(sub)];
                }
            });
        });
    };
    return DatabaseStorage;
}());
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
