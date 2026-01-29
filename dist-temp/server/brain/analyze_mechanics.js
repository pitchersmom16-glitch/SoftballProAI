"use strict";
/**
 * SoftballProAI Brain - Holistic Analysis Engine
 *
 * Supports ALL 4 Core Skills as defined in Spec Sheet:
 * - PITCHING: Windmill mechanics, arm circle, drag foot, release
 * - HITTING: Bat speed, launch angle, hip rotation, timing
 * - CATCHING: Framing, blocking, pop-time, throw-downs
 * - THROWING: Fielding mechanics, arm slot, footwork
 *
 * Plus: Mental Module for Championship Mindset
 */
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePitching = analyzePitching;
exports.analyzeHitting = analyzeHitting;
exports.analyzeCatching = analyzeCatching;
exports.analyzeFielding = analyzeFielding;
exports.analyzeMechanics = analyzeMechanics;
exports.analyzeMental = analyzeMental;
exports.getCorrectiveDrills = getCorrectiveDrills;
exports.getDrillsByTag = getDrillsByTag;
exports.getDrillsByExpert = getDrillsByExpert;
exports.getDailyMindset = getDailyMindset;
exports.getPreGameAudio = getPreGameAudio;
var db_1 = require("../db");
var schema_1 = require("@shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
// Known biomechanical issues and their associated mechanic tags
var ISSUE_TAG_MAPPING = {
    // === PITCHING ISSUES ===
    "hunched forward": ["Posture", "Spine Angle", "Balance", "Tall and Fall"],
    "bent over": ["Posture", "Spine Angle", "Head Position"],
    "leaning forward": ["Posture", "Stay Back", "Balance"],
    "arm not brushing hip": ["Arm Circle", "Hip Brush", "Internal Rotation"],
    "short arm circle": ["Arm Circle", "Full Extension", "Fluidity"],
    "slow arm speed": ["Arm Speed", "Arm Circle", "Internal Rotation"],
    "lifting drag foot": ["Drag Foot", "Balance", "Stability", "Ground Contact"],
    "drag foot early": ["Drag Foot", "Foot Path", "Timing"],
    "inconsistent release": ["Release Point", "Timing", "Consistency"],
    "high release": ["Release Point", "Location", "Command"],
    "late release": ["Release Point", "Timing", "Wrist Snap"],
    "weak leg drive": ["Leg Drive", "Explosive Power", "Load Position"],
    "not using legs": ["Leg Drive", "Power Transfer", "Kinetic Chain"],
    "arm dominant": ["Leg Drive", "Kinetic Chain", "Power Generation"],
    "open hips": ["Hip Alignment", "Power Line", "Stride Direction"],
    "closed hips": ["Hip Rotation", "Power Line", "Kinetic Chain"],
    "no spin": ["Spin", "Wrist Snap", "Internal Rotation"],
    "wrong spin": ["Spin Axis", "Release", "Wrist Snap"],
    "rise ball flat": ["Rise Ball", "Backspin", "Wrist Snap"],
    "drop ball flat": ["Drop Ball", "Topspin", "Release"],
    // === HITTING ISSUES ===
    "uppercut swing": ["Swing Plane", "Level Swing", "High Strike"],
    "long swing": ["Hand Path", "Compact Swing", "Hands Inside", "Casting Fix"],
    "casting": ["Casting Fix", "Hands Inside", "Elbow Position", "Short Swing"],
    "lunging": ["Stay Back", "Load", "Balance", "Weight Distribution"],
    "no hip rotation": ["Hip Rotation", "Kinetic Chain", "Power Generation"],
    "no separation": ["Separation", "Load", "Coil", "Power Generation"],
    "pulling off ball": ["Stay Back", "Opposite Field", "Extension"],
    "rolling over": ["Stay Low", "Extension", "Opposite Field"],
    "weak contact": ["Power", "Drive Through", "Bat Speed"],
    "popping up": ["Swing Plane", "High Strike", "Barrel Control"],
    "getting jammed": ["Inside Pitch", "Quick Hands", "Hip Rotation"],
    "reaching": ["Outside Pitch", "Stay Back", "Extension"],
    "timing off": ["Timing", "Stride", "Load", "Rhythm"],
    "off balance": ["Balance", "Weight Transfer", "Finish"],
    "slow bat speed": ["Bat Speed", "Hand Speed", "Torque", "Hip Rotation"],
    "bad launch angle": ["Launch Angle", "Swing Plane", "Barrel Path"],
    // === CATCHING ISSUES ===
    "poor framing": ["Framing", "Glove Presentation", "Soft Hands", "Stick It"],
    "loud glove": ["Quiet Glove", "Soft Hands", "Receiving"],
    "stabbing at ball": ["Framing", "Funnel", "Smooth Receiving"],
    "slow pop time": ["Pop Time", "Quick Feet", "Exchange", "Transfer"],
    "poor blocking": ["Blocking", "Stay Low", "Centerline", "Smother"],
    "ball gets by": ["Blocking", "Reaction", "Stay Center"],
    "slow exchange": ["Exchange", "Transfer", "Quick Hands"],
    "weak throw to second": ["Arm Strength", "Footwork", "Pop Time"],
    "off target throws": ["Accuracy", "Footwork", "Follow Through"],
    "late on steal": ["Pop Time", "Quick Feet", "Anticipation"],
    // === THROWING/FIELDING ISSUES ===
    "side arm": ["Arm Slot", "Over the Top", "Arm Path"],
    "short arming": ["Arm Path", "Full Extension", "Follow Through"],
    "no follow through": ["Follow Through", "Finish", "Arm Path"],
    "poor footwork": ["Footwork", "Quick Feet", "Transition"],
    "slow release": ["Quick Release", "Exchange", "Footwork"],
    "weak arm": ["Arm Strength", "Long Toss", "Conditioning"],
    "inaccurate throws": ["Accuracy", "Target", "Follow Through"],
    "charging too fast": ["Approach", "Under Control", "Balance"],
    "fielding off center": ["Centerline", "Glove Position", "Stay Low"],
    "bobbling ball": ["Soft Hands", "Watch Into Glove", "Concentration"]
};
// Priority weights for different match types
var WEIGHTS = {
    issueAddressedMatch: 100,
    tagExactMatch: 30,
    tagPartialMatch: 15,
    categoryMatch: 10,
    difficultyPreference: 5
};
// Map skill type to drill categories
var SKILL_TO_CATEGORY = {
    "PITCHING": ["PITCHING", "Pitching"],
    "HITTING": ["HITTING", "Hitting"],
    "CATCHING": ["CATCHING", "Catching"],
    "FIELDING": ["FIELDING", "Fielding", "THROWING", "INFIELD", "OUTFIELD", "Infield", "Outfield"]
};
/**
 * PITCHING ANALYSIS
 * Analyzes windmill pitching mechanics including arm circle, drag foot, release point
 */
function analyzePitching(request) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, analyzeMechanics(__assign(__assign({}, request), { skillType: "PITCHING" }))];
        });
    });
}
/**
 * HITTING ANALYSIS
 * Analyzes bat speed, launch angle, hip rotation, timing, and swing mechanics
 */
function analyzeHitting(request) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, analyzeMechanics(__assign(__assign({}, request), { skillType: "HITTING" }))];
        });
    });
}
/**
 * CATCHING ANALYSIS
 * Analyzes framing, blocking, pop-time, throw-downs, and receiving mechanics
 */
function analyzeCatching(request) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, analyzeMechanics(__assign(__assign({}, request), { skillType: "CATCHING" }))];
        });
    });
}
/**
 * FIELDING ANALYSIS
 * Analyzes arm slot, footwork, exchange, accuracy, and fielding mechanics
 */
function analyzeFielding(request) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, analyzeMechanics(__assign(__assign({}, request), { skillType: "FIELDING" }))];
        });
    });
}
/**
 * Core mechanics analyzer - handles all 4 skill types
 */
function analyzeMechanics(request) {
    return __awaiter(this, void 0, Promise, function () {
        var skillType, _a, detectedIssues, _b, athleteLevel, _c, limit, validCategories, allDrills, categoryDrills, relevantTags, _i, detectedIssues_1, issue, normalizedIssue, _d, _e, _f, knownIssue, tags, scoredDrills, topDrills;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    skillType = request.skillType, _a = request.detectedIssues, detectedIssues = _a === void 0 ? [] : _a, _b = request.athleteLevel, athleteLevel = _b === void 0 ? "Intermediate" : _b, _c = request.limit, limit = _c === void 0 ? 3 : _c;
                    validCategories = SKILL_TO_CATEGORY[skillType] || [skillType];
                    return [4 /*yield*/, db_1.db.select().from(schema_1.drills)];
                case 1:
                    allDrills = _g.sent();
                    categoryDrills = allDrills.filter(function (d) {
                        return validCategories.some(function (cat) {
                            var _a;
                            return d.category.toUpperCase() === cat.toUpperCase() ||
                                ((_a = d.skillType) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === cat.toUpperCase();
                        });
                    });
                    relevantTags = new Set();
                    for (_i = 0, detectedIssues_1 = detectedIssues; _i < detectedIssues_1.length; _i++) {
                        issue = detectedIssues_1[_i];
                        normalizedIssue = issue.toLowerCase().trim();
                        for (_d = 0, _e = Object.entries(ISSUE_TAG_MAPPING); _d < _e.length; _d++) {
                            _f = _e[_d], knownIssue = _f[0], tags = _f[1];
                            if (normalizedIssue.includes(knownIssue) || knownIssue.includes(normalizedIssue)) {
                                tags.forEach(function (tag) { return relevantTags.add(tag.toLowerCase()); });
                            }
                        }
                    }
                    scoredDrills = categoryDrills.map(function (drill) {
                        var score = 0;
                        var matchReasons = [];
                        // Check if drill directly addresses any detected issue
                        if (drill.issueAddressed) {
                            for (var _i = 0, detectedIssues_2 = detectedIssues; _i < detectedIssues_2.length; _i++) {
                                var issue = detectedIssues_2[_i];
                                if (drill.issueAddressed.toLowerCase().includes(issue.toLowerCase()) ||
                                    issue.toLowerCase().includes(drill.issueAddressed.toLowerCase())) {
                                    score += WEIGHTS.issueAddressedMatch;
                                    matchReasons.push("Directly addresses: ".concat(issue));
                                }
                            }
                        }
                        // Score based on mechanic tags
                        if (drill.mechanicTags && drill.mechanicTags.length > 0) {
                            for (var _a = 0, _b = drill.mechanicTags; _a < _b.length; _a++) {
                                var tag = _b[_a];
                                var tagLower = tag.toLowerCase();
                                if (relevantTags.has(tagLower)) {
                                    score += WEIGHTS.tagExactMatch;
                                    matchReasons.push("Tag match: ".concat(tag));
                                }
                                else {
                                    for (var _c = 0, _d = Array.from(relevantTags); _c < _d.length; _c++) {
                                        var relevantTag = _d[_c];
                                        if (tagLower.includes(relevantTag) || relevantTag.includes(tagLower)) {
                                            score += WEIGHTS.tagPartialMatch;
                                            matchReasons.push("Related to: ".concat(tag));
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        // Category match bonus
                        score += WEIGHTS.categoryMatch;
                        // Prefer matching difficulty level
                        if (drill.difficulty === athleteLevel) {
                            score += WEIGHTS.difficultyPreference;
                        }
                        else if (drill.difficulty === "Intermediate") {
                            score += WEIGHTS.difficultyPreference / 2;
                        }
                        // If no issues specified, give base score to all drills in category
                        if (detectedIssues.length === 0 && score <= WEIGHTS.categoryMatch) {
                            matchReasons.push("Recommended ".concat(skillType, " drill"));
                        }
                        return {
                            id: drill.id,
                            name: drill.name,
                            category: drill.category,
                            difficulty: drill.difficulty,
                            description: drill.description,
                            videoUrl: drill.videoUrl,
                            expertSource: drill.expertSource,
                            mechanicTags: drill.mechanicTags,
                            issueAddressed: drill.issueAddressed,
                            relevanceScore: score,
                            matchReason: matchReasons.length > 0 ? matchReasons.join("; ") : "General recommendation"
                        };
                    });
                    topDrills = scoredDrills
                        .filter(function (d) { return d.relevanceScore > 0; })
                        .sort(function (a, b) { return b.relevanceScore - a.relevanceScore; })
                        .slice(0, limit);
                    return [2 /*return*/, {
                            skillType: skillType,
                            analyzedIssues: detectedIssues,
                            recommendations: topDrills,
                            totalDrillsSearched: categoryDrills.length
                        }];
            }
        });
    });
}
/**
 * MENTAL ANALYSIS
 * Serves Championship Mindset audio/content based on game situation context
 */
function analyzeMental(request) {
    return __awaiter(this, void 0, Promise, function () {
        var context, category, _a, limit, contextMapping, relevantContexts, allMental, scored, top;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    context = request.context, category = request.category, _a = request.limit, limit = _a === void 0 ? 3 : _a;
                    contextMapping = {
                        "pre-game": ["pre-game", "before game", "warmup", "focus"],
                        "post-game": ["post-game", "after game", "recovery", "reflection"],
                        "pre-at-bat": ["before at-bat", "at bat", "focus", "confidence"],
                        "after-strikeout": ["after strikeout", "bounce back", "resilience", "flush"],
                        "daily-mindset": ["daily", "morning", "mindset", "motivation"],
                        "recovery": ["recovery", "rest", "off-day", "mental reset"]
                    };
                    relevantContexts = contextMapping[context] || [context];
                    return [4 /*yield*/, db_1.db.select().from(schema_1.mentalEdge)];
                case 1:
                    allMental = _b.sent();
                    scored = allMental.map(function (item) {
                        var score = 0;
                        // Usage context match
                        if (item.usageContext) {
                            for (var _i = 0, relevantContexts_1 = relevantContexts; _i < relevantContexts_1.length; _i++) {
                                var ctx = relevantContexts_1[_i];
                                if (item.usageContext.toLowerCase().includes(ctx)) {
                                    score += 50;
                                }
                            }
                        }
                        // Category match
                        if (category && item.category.toLowerCase().includes(category.toLowerCase())) {
                            score += 30;
                        }
                        // Tag match
                        if (item.tags) {
                            for (var _a = 0, _b = item.tags; _a < _b.length; _a++) {
                                var tag = _b[_a];
                                for (var _c = 0, relevantContexts_2 = relevantContexts; _c < relevantContexts_2.length; _c++) {
                                    var ctx = relevantContexts_2[_c];
                                    if (tag.toLowerCase().includes(ctx)) {
                                        score += 20;
                                    }
                                }
                            }
                        }
                        // Base score for all content
                        score += 5;
                        return {
                            id: item.id,
                            title: item.title,
                            contentType: item.contentType,
                            category: item.category,
                            source: item.source,
                            content: item.content,
                            videoUrl: item.videoUrl,
                            tags: item.tags,
                            usageContext: item.usageContext,
                            score: score
                        };
                    });
                    top = scored
                        .sort(function (a, b) { return b.score - a.score; })
                        .slice(0, limit)
                        .map(function (_a) {
                        var score = _a.score, rest = __rest(_a, ["score"]);
                        return rest;
                    });
                    return [2 /*return*/, {
                            context: context,
                            recommendations: top,
                            totalSearched: allMental.length
                        }];
            }
        });
    });
}
// === HELPER FUNCTIONS ===
/**
 * Quick helper to get correction drills for a simple tag/issue search.
 */
function getCorrectiveDrills(skillType_1, issue_1) {
    return __awaiter(this, arguments, Promise, function (skillType, issue, limit) {
        var result;
        if (limit === void 0) { limit = 3; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, analyzeMechanics({
                        skillType: skillType,
                        detectedIssues: [issue],
                        limit: limit
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.recommendations];
            }
        });
    });
}
/**
 * Get all drills for a specific mechanic tag.
 */
function getDrillsByTag(tag_1) {
    return __awaiter(this, arguments, Promise, function (tag, limit) {
        var allDrills, matchingDrills;
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.drills)];
                case 1:
                    allDrills = _a.sent();
                    matchingDrills = allDrills
                        .filter(function (drill) {
                        var _a;
                        return (_a = drill.mechanicTags) === null || _a === void 0 ? void 0 : _a.some(function (t) {
                            return t.toLowerCase().includes(tag.toLowerCase()) ||
                                tag.toLowerCase().includes(t.toLowerCase());
                        });
                    })
                        .slice(0, limit)
                        .map(function (drill) { return ({
                        id: drill.id,
                        name: drill.name,
                        category: drill.category,
                        difficulty: drill.difficulty,
                        description: drill.description,
                        videoUrl: drill.videoUrl,
                        expertSource: drill.expertSource,
                        mechanicTags: drill.mechanicTags,
                        issueAddressed: drill.issueAddressed,
                        relevanceScore: 100,
                        matchReason: "Matches tag: ".concat(tag)
                    }); });
                    return [2 /*return*/, matchingDrills];
            }
        });
    });
}
/**
 * Get drills by expert source.
 */
function getDrillsByExpert(expertName) {
    return __awaiter(this, void 0, Promise, function () {
        var expertDrills;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.drills).where((0, drizzle_orm_1.ilike)(schema_1.drills.expertSource, "%".concat(expertName, "%")))];
                case 1:
                    expertDrills = _a.sent();
                    return [2 /*return*/, expertDrills.map(function (drill) { return ({
                            id: drill.id,
                            name: drill.name,
                            category: drill.category,
                            difficulty: drill.difficulty,
                            description: drill.description,
                            videoUrl: drill.videoUrl,
                            expertSource: drill.expertSource,
                            mechanicTags: drill.mechanicTags,
                            issueAddressed: drill.issueAddressed,
                            relevanceScore: 100,
                            matchReason: "From expert: ".concat(expertName)
                        }); })];
            }
        });
    });
}
/**
 * Get daily championship mindset content
 */
function getDailyMindset() {
    return __awaiter(this, void 0, Promise, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, analyzeMental({ context: "daily-mindset", limit: 1 })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.recommendations[0] || null];
            }
        });
    });
}
/**
 * Get pre-game visualization audio content
 */
function getPreGameAudio() {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, analyzeMental({ context: "pre-game", limit: 3 })];
                case 1: return [2 /*return*/, (_a.sent()).recommendations];
            }
        });
    });
}
