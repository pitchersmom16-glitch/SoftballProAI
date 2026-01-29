"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.stripeService = exports.StripeService = void 0;
var stripeClient_1 = require("./stripeClient");
var db_1 = require("./db");
var drizzle_orm_1 = require("drizzle-orm");
var StripeService = /** @class */ (function () {
    function StripeService() {
    }
    StripeService.prototype.createCustomer = function (email, userId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var stripe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, stripeClient_1.getUncachableStripeClient)()];
                    case 1:
                        stripe = _a.sent();
                        return [4 /*yield*/, stripe.customers.create({
                                email: email,
                                name: name,
                                metadata: { userId: userId },
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StripeService.prototype.createCheckoutSession = function (customerId, priceId, successUrl, cancelUrl, couponCode) {
        return __awaiter(this, void 0, void 0, function () {
            var stripe, sessionConfig, coupon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, stripeClient_1.getUncachableStripeClient)()];
                    case 1:
                        stripe = _a.sent();
                        sessionConfig = {
                            customer: customerId,
                            payment_method_types: ['card'],
                            line_items: [{ price: priceId, quantity: 1 }],
                            mode: 'subscription',
                            success_url: successUrl,
                            cancel_url: cancelUrl,
                            allow_promotion_codes: true,
                        };
                        if (!couponCode) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validateCoupon(couponCode)];
                    case 2:
                        coupon = _a.sent();
                        if (coupon) {
                            sessionConfig.discounts = [{ coupon: coupon.id }];
                            delete sessionConfig.allow_promotion_codes;
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, stripe.checkout.sessions.create(sessionConfig)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StripeService.prototype.createCustomerPortalSession = function (customerId, returnUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var stripe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, stripeClient_1.getUncachableStripeClient)()];
                    case 1:
                        stripe = _a.sent();
                        return [4 /*yield*/, stripe.billingPortal.sessions.create({
                                customer: customerId,
                                return_url: returnUrl,
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StripeService.prototype.validateCoupon = function (code) {
        return __awaiter(this, void 0, Promise, function () {
            var localCoupons, upperCode, stripe, coupon, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        localCoupons = {
                            'DONOR100': {
                                id: 'DONOR100',
                                valid: true,
                                percent_off: 100,
                                amount_off: null,
                                duration: 'forever',
                                metadata: { badge: 'founding_member' }
                            },
                            'FRIEND50': {
                                id: 'FRIEND50',
                                valid: true,
                                percent_off: 50,
                                amount_off: null,
                                duration: 'forever',
                                metadata: {}
                            }
                        };
                        upperCode = code.toUpperCase();
                        // Check local coupons first (bypass Stripe for testing)
                        if (localCoupons[upperCode]) {
                            return [2 /*return*/, localCoupons[upperCode]];
                        }
                        return [4 /*yield*/, (0, stripeClient_1.getUncachableStripeClient)()];
                    case 1:
                        stripe = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, stripe.coupons.retrieve(code)];
                    case 3:
                        coupon = _a.sent();
                        if (coupon.valid) {
                            return [2 /*return*/, coupon];
                        }
                        return [2 /*return*/, null];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    StripeService.prototype.getProduct = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM stripe.products WHERE id = ", ""], ["SELECT * FROM stripe.products WHERE id = ", ""])), productId))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    StripeService.prototype.listProducts = function () {
        return __awaiter(this, arguments, void 0, function (active, limit, offset) {
            var result;
            if (active === void 0) { active = true; }
            if (limit === void 0) { limit = 20; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT * FROM stripe.products WHERE active = ", " LIMIT ", " OFFSET ", ""], ["SELECT * FROM stripe.products WHERE active = ", " LIMIT ", " OFFSET ", ""])), active, limit, offset))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    StripeService.prototype.listProductsWithPrices = function () {
        return __awaiter(this, arguments, void 0, function (active, limit, offset) {
            var result;
            if (active === void 0) { active = true; }
            if (limit === void 0) { limit = 20; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        WITH paginated_products AS (\n          SELECT id, name, description, metadata, active\n          FROM stripe.products\n          WHERE active = ", "\n          ORDER BY id\n          LIMIT ", " OFFSET ", "\n        )\n        SELECT \n          p.id as product_id,\n          p.name as product_name,\n          p.description as product_description,\n          p.active as product_active,\n          p.metadata as product_metadata,\n          pr.id as price_id,\n          pr.unit_amount,\n          pr.currency,\n          pr.recurring,\n          pr.active as price_active,\n          pr.metadata as price_metadata\n        FROM paginated_products p\n        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true\n        ORDER BY p.id, pr.unit_amount\n      "], ["\n        WITH paginated_products AS (\n          SELECT id, name, description, metadata, active\n          FROM stripe.products\n          WHERE active = ", "\n          ORDER BY id\n          LIMIT ", " OFFSET ", "\n        )\n        SELECT \n          p.id as product_id,\n          p.name as product_name,\n          p.description as product_description,\n          p.active as product_active,\n          p.metadata as product_metadata,\n          pr.id as price_id,\n          pr.unit_amount,\n          pr.currency,\n          pr.recurring,\n          pr.active as price_active,\n          pr.metadata as price_metadata\n        FROM paginated_products p\n        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true\n        ORDER BY p.id, pr.unit_amount\n      "])), active, limit, offset))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    StripeService.prototype.getSubscription = function (subscriptionId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT * FROM stripe.subscriptions WHERE id = ", ""], ["SELECT * FROM stripe.subscriptions WHERE id = ", ""])), subscriptionId))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    return StripeService;
}());
exports.StripeService = StripeService;
exports.stripeService = new StripeService();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
