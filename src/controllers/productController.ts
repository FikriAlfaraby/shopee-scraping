import {  RequestHandler } from "express";
import { ShopeeScraperService } from "../services/shopeeScraperService";

const scraper = new ShopeeScraperService(
  "la.residential.rayobyte.com",
  "8000",
  "fikrialfaraby04_gmail_com",
  "gMbFcxdY2T4bWAN-country-CA-region-british_columbia-city-burnaby"
);

export const getProductDetails: RequestHandler = async (req, res) => {
  try {
    const { storeId, dealId } = req.query as {
      storeId: string;
      dealId: string;
    };

    if (!storeId || !dealId) {
      res.status(400).json({ error: "storeId and dealId are required" });
      return;
    }

    await scraper.initialize(storeId, dealId);
    const productData = await scraper.fetchProduct(storeId, dealId);
    res.json(productData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product data" });
  } finally {
    await scraper.close();
  }
};
