"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ShopeeScraperService = void 0;
const puppeteerConfig_1 = __importStar(require("../config/puppeteerConfig"));
const axios_1 = __importDefault(require("axios"));
const https_proxy_agent_1 = require("https-proxy-agent");
const logger_1 = require("../utils/logger");
class ShopeeScraperService {
    constructor(proxyHost, proxyPort, proxyUsername, proxyPassword) {
        this.proxyHost = proxyHost;
        this.proxyPort = proxyPort;
        this.proxyUsername = proxyUsername;
        this.proxyPassword = proxyPassword;
        this.browser = null;
        this.securityHeaders = {};
        const proxyUrl = `http://${proxyUsername}:${proxyPassword}@${proxyHost}:${proxyPort}`;
        this.proxyAgent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
    }
    initialize(shopId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.browser = yield puppeteerConfig_1.default.launch(Object.assign(Object.assign({}, puppeteerConfig_1.puppeteerOptions), { args: [
                    ...((_a = puppeteerConfig_1.puppeteerOptions.args) !== null && _a !== void 0 ? _a : []),
                    `--proxy-server=${this.proxyHost}:${this.proxyPort}`,
                ] }));
            yield this.loadSecuritySDK(shopId, itemId);
        });
    }
    loadSecuritySDK(shopId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.browser)
                throw new Error("Browser not initialized");
            const page = yield this.browser.newPage();
            yield page.authenticate({
                username: this.proxyUsername,
                password: this.proxyPassword,
            });
            yield page.setRequestInterception(true);
            page.on("request", (request) => {
                if (request.url().includes("/api/v4/pdp/get_pc")) {
                    const headers = request.headers();
                    console.log(headers);
                    this.securityHeaders = Object.assign(Object.assign({}, this.securityHeaders), headers);
                }
                request.continue();
            });
            logger_1.logger.info("Navigating to product page...");
            yield page.goto(`https://shopee.tw/product-i.${shopId}.${itemId}`, {
                waitUntil: "networkidle2",
                timeout: 60000,
            });
            yield page.close();
        });
    }
    fetchProduct(shopId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = Object.assign(Object.assign({}, this.securityHeaders), { authority: "shopee.tw", accept: "application/json", referer: `https://shopee.tw/product-i.${shopId}.${itemId}`, "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..." });
            try {
                const response = yield axios_1.default.get(`https://shopee.tw/api/v4/pdp/get_pc?shop_id=${shopId}&item_id=${itemId}`, {
                    headers: headers,
                    httpsAgent: this.proxyAgent,
                    timeout: 15000,
                });
                return response.data;
            }
            catch (error) {
                logger_1.logger.error(`Request failed: ${error}`);
                yield this.initialize(shopId, itemId);
                return this.fetchProduct(shopId, itemId);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
                this.browser = null;
            }
        });
    }
}
exports.ShopeeScraperService = ShopeeScraperService;
