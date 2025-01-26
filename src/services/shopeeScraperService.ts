import puppeteer, { puppeteerOptions } from "../config/puppeteerConfig";
import { SecurityHeaders } from "../models/securityHeaders";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { logger } from "../utils/logger";
import { Browser } from "puppeteer";

export class ShopeeScraperService {
  private browser: Browser | null = null;
  private securityHeaders: Partial<SecurityHeaders> = {};
  private proxyAgent: HttpsProxyAgent<string>;

  constructor(
    private proxyHost: string,
    private proxyPort: string,
    private proxyUsername: string,
    private proxyPassword: string
  ) {
    const proxyUrl = `http://${proxyUsername}:${proxyPassword}@${proxyHost}:${proxyPort}`;
    this.proxyAgent = new HttpsProxyAgent(proxyUrl);
  }

  async initialize(shopId: string, itemId: string): Promise<void> {
    this.browser = await puppeteer.launch({
      ...puppeteerOptions,
      args: [
        ...(puppeteerOptions.args ?? []),
        `--proxy-server=${this.proxyHost}:${this.proxyPort}`,
      ],
    });

    await this.loadSecuritySDK(shopId, itemId);
  }

  private async loadSecuritySDK(shopId: string, itemId: string): Promise<void> {
    if (!this.browser) throw new Error("Browser not initialized");

    const page = await this.browser.newPage();
    await page.authenticate({
      username: this.proxyUsername,
      password: this.proxyPassword,
    });

    await page.setRequestInterception(true);
    page.on("request", (request: any) => {
      if (request.url().includes("/api/v4/pdp/get_pc")) {
        const headers = request.headers();
        console.log(headers);
        this.securityHeaders = {
          ...this.securityHeaders,
          ...headers,
        };
      }
      request.continue();
    });

    logger.info("Navigating to product page...");
    await page.goto(`https://shopee.tw/product-i.${shopId}.${itemId}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.close();
  }

  async fetchProduct(shopId: string, itemId: string): Promise<any> {
    const headers = {
      ...this.securityHeaders,
      authority: "shopee.tw",
      accept: "application/json",
      referer: `https://shopee.tw/product-i.${shopId}.${itemId}`,
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    };

    try {
      const response = await axios.get(
        `https://shopee.tw/api/v4/pdp/get_pc?shop_id=${shopId}&item_id=${itemId}`,
        {
          headers: headers as Record<string, string>,
          httpsAgent: this.proxyAgent,
          timeout: 15000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error(`Request failed: ${error}`);
      await this.initialize(shopId, itemId);
      return this.fetchProduct(shopId, itemId);
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
