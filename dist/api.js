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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const scraper_1 = require("./scraper");
exports.app = (0, express_1.default)(); // Export the app object
// Endpoint to retrieve product details
exports.app.get("/shopee", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, dealId } = req.query;
    if (!storeId || !dealId) {
        return res.status(400).json({ error: "storeId and dealId are required" });
    }
    try {
        // Fetch data from Shopee's API
        const productData = yield (0, scraper_1.fetchFromShopeeAPI)(storeId, dealId);
        // Return the actual product data from Shopee's API
        res.json({
            success: true,
            data: productData
        });
    }
    catch (error) {
        console.error("Error fetching product data:", error);
        res.status(500).json({ error: "Failed to fetch product data" });
    }
}));
