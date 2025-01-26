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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductDetails = void 0;
const shopeeScraperService_1 = require("../services/shopeeScraperService");
const scraper = new shopeeScraperService_1.ShopeeScraperService("la.residential.rayobyte.com", "8000", "fikrialfaraby04_gmail_com", "gMbFcxdY2T4bWAN-country-CA-region-british_columbia-city-burnaby");
const getProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storeId, dealId } = req.query;
        if (!storeId || !dealId) {
            res.status(400).json({ error: "storeId and dealId are required" });
            return;
        }
        yield scraper.initialize(storeId, dealId);
        const productData = yield scraper.fetchProduct(storeId, dealId);
        res.json(productData);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch product data" });
    }
    finally {
        yield scraper.close();
    }
});
exports.getProductDetails = getProductDetails;
