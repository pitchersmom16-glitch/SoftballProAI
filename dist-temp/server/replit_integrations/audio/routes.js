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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAudioRoutes = registerAudioRoutes;
var express_1 = __importDefault(require("express"));
var storage_1 = require("../chat/storage");
var client_1 = require("./client");
// Body parser with 50MB limit for audio payloads
var audioBodyParser = express_1.default.json({ limit: "50mb" });
function registerAudioRoutes(app) {
    var _this = this;
    // Get all conversations
    app.get("/api/conversations", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var conversations, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage_1.chatStorage.getAllConversations()];
                case 1:
                    conversations = _a.sent();
                    res.json(conversations);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching conversations:", error_1);
                    res.status(500).json({ error: "Failed to fetch conversations" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get single conversation with messages
    app.get("/api/conversations/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, conversation, messages, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = parseInt(req.params.id);
                    return [4 /*yield*/, storage_1.chatStorage.getConversation(id)];
                case 1:
                    conversation = _a.sent();
                    if (!conversation) {
                        return [2 /*return*/, res.status(404).json({ error: "Conversation not found" })];
                    }
                    return [4 /*yield*/, storage_1.chatStorage.getMessagesByConversation(id)];
                case 2:
                    messages = _a.sent();
                    res.json(__assign(__assign({}, conversation), { messages: messages }));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error fetching conversation:", error_2);
                    res.status(500).json({ error: "Failed to fetch conversation" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Create new conversation
    app.post("/api/conversations", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var title, conversation, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    title = req.body.title;
                    return [4 /*yield*/, storage_1.chatStorage.createConversation(title || "New Chat")];
                case 1:
                    conversation = _a.sent();
                    res.status(201).json(conversation);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error creating conversation:", error_3);
                    res.status(500).json({ error: "Failed to create conversation" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Delete conversation
    app.delete("/api/conversations/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = parseInt(req.params.id);
                    return [4 /*yield*/, storage_1.chatStorage.deleteConversation(id)];
                case 1:
                    _a.sent();
                    res.status(204).send();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error deleting conversation:", error_4);
                    res.status(500).json({ error: "Failed to delete conversation" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Send voice message and get streaming audio response
    // Auto-detects audio format and converts WebM/MP4/OGG to WAV
    // Uses gpt-4o-mini-transcribe for STT, gpt-audio for voice response
    app.post("/api/conversations/:id/messages", audioBodyParser, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var conversationId, _a, audio, _b, voice, rawBuffer, _c, audioBuffer, inputFormat, userTranscript, existingMessages, chatHistory, stream, assistantTranscript, _d, stream_1, stream_1_1, chunk, delta, e_1_1, error_5;
        var _e, e_1, _f, _g;
        var _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 19, , 20]);
                    conversationId = parseInt(req.params.id);
                    _a = req.body, audio = _a.audio, _b = _a.voice, voice = _b === void 0 ? "alloy" : _b;
                    if (!audio) {
                        return [2 /*return*/, res.status(400).json({ error: "Audio data (base64) is required" })];
                    }
                    rawBuffer = Buffer.from(audio, "base64");
                    return [4 /*yield*/, (0, client_1.ensureCompatibleFormat)(rawBuffer)];
                case 1:
                    _c = _m.sent(), audioBuffer = _c.buffer, inputFormat = _c.format;
                    return [4 /*yield*/, (0, client_1.speechToText)(audioBuffer, inputFormat)];
                case 2:
                    userTranscript = _m.sent();
                    // 3. Save user message
                    return [4 /*yield*/, storage_1.chatStorage.createMessage(conversationId, "user", userTranscript)];
                case 3:
                    // 3. Save user message
                    _m.sent();
                    return [4 /*yield*/, storage_1.chatStorage.getMessagesByConversation(conversationId)];
                case 4:
                    existingMessages = _m.sent();
                    chatHistory = existingMessages.map(function (m) { return ({
                        role: m.role,
                        content: m.content,
                    }); });
                    // 5. Set up SSE
                    res.setHeader("Content-Type", "text/event-stream");
                    res.setHeader("Cache-Control", "no-cache");
                    res.setHeader("Connection", "keep-alive");
                    res.write("data: ".concat(JSON.stringify({ type: "user_transcript", data: userTranscript }), "\n\n"));
                    return [4 /*yield*/, client_1.openai.chat.completions.create({
                            model: "gpt-audio",
                            modalities: ["text", "audio"],
                            audio: { voice: voice, format: "pcm16" },
                            messages: chatHistory,
                            stream: true,
                        })];
                case 5:
                    stream = _m.sent();
                    assistantTranscript = "";
                    _m.label = 6;
                case 6:
                    _m.trys.push([6, 11, 12, 17]);
                    _d = true, stream_1 = __asyncValues(stream);
                    _m.label = 7;
                case 7: return [4 /*yield*/, stream_1.next()];
                case 8:
                    if (!(stream_1_1 = _m.sent(), _e = stream_1_1.done, !_e)) return [3 /*break*/, 10];
                    _g = stream_1_1.value;
                    _d = false;
                    chunk = _g;
                    delta = (_j = (_h = chunk.choices) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.delta;
                    if (!delta)
                        return [3 /*break*/, 9];
                    if ((_k = delta === null || delta === void 0 ? void 0 : delta.audio) === null || _k === void 0 ? void 0 : _k.transcript) {
                        assistantTranscript += delta.audio.transcript;
                        res.write("data: ".concat(JSON.stringify({ type: "transcript", data: delta.audio.transcript }), "\n\n"));
                    }
                    if ((_l = delta === null || delta === void 0 ? void 0 : delta.audio) === null || _l === void 0 ? void 0 : _l.data) {
                        res.write("data: ".concat(JSON.stringify({ type: "audio", data: delta.audio.data }), "\n\n"));
                    }
                    _m.label = 9;
                case 9:
                    _d = true;
                    return [3 /*break*/, 7];
                case 10: return [3 /*break*/, 17];
                case 11:
                    e_1_1 = _m.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 17];
                case 12:
                    _m.trys.push([12, , 15, 16]);
                    if (!(!_d && !_e && (_f = stream_1.return))) return [3 /*break*/, 14];
                    return [4 /*yield*/, _f.call(stream_1)];
                case 13:
                    _m.sent();
                    _m.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 16: return [7 /*endfinally*/];
                case 17: 
                // 7. Save assistant message
                return [4 /*yield*/, storage_1.chatStorage.createMessage(conversationId, "assistant", assistantTranscript)];
                case 18:
                    // 7. Save assistant message
                    _m.sent();
                    res.write("data: ".concat(JSON.stringify({ type: "done", transcript: assistantTranscript }), "\n\n"));
                    res.end();
                    return [3 /*break*/, 20];
                case 19:
                    error_5 = _m.sent();
                    console.error("Error processing voice message:", error_5);
                    if (res.headersSent) {
                        res.write("data: ".concat(JSON.stringify({ type: "error", error: "Failed to process voice message" }), "\n\n"));
                        res.end();
                    }
                    else {
                        res.status(500).json({ error: "Failed to process voice message" });
                    }
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/];
            }
        });
    }); });
}
