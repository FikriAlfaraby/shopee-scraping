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
exports.getShopeeProductDetails = void 0;
const shopeeScraperService_1 = require("../services/shopeeScraperService");
const getShopeeProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, dealId } = req.query;
    if (!storeId || !dealId) {
        return res.status(400).json({ error: "storeId and dealId are required" });
    }
    try {
        const productData = yield (0, shopeeScraperService_1.fetchProductDetails)(storeId, dealId);
        res.json({
            success: true,
            data: productData,
        });
    }
    catch (error) {
        console.error("Error fetching product data:", error);
        res.status(500).json({ error: "Failed to fetch product data" });
    }
});
exports.getShopeeProductDetails = getShopeeProductDetails;
