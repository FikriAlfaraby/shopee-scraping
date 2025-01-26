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
exports.scrapeProductData = scrapeProductData;
exports.fetchFromShopeeAPI = fetchFromShopeeAPI;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = __importDefault(require("selenium-webdriver/chrome"));
const utils_1 = require("./utils");
// Captcha resolver configuration
const CAPTCHA_API_URL = "https://api.scrapeless.com/api/v1/createTask";
const CAPTCHA_API_TOKEN = "sk_FKdlB3u21YpesvXqM1VQ62ShcgbDXkzwS09GVzBGVCpMCbq1T0KJ6Wp0UFkyxkIe";
function solveCaptcha(pageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = { "x-api-token": CAPTCHA_API_TOKEN };
        const inputData = {
            version: "v2",
            pageURL: pageUrl,
            siteKey: "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-",
            pageAction: "submit",
            invisible: false,
        };
        const payload = {
            actor: "captcha.recaptcha",
            input: inputData,
            proxy: {},
        };
        try {
            // Create task
            const createResponse = yield axios_1.default.post(CAPTCHA_API_URL, payload, {
                headers,
            });
            const taskId = createResponse.data.taskId;
            if (!taskId) {
                throw new Error("Failed to create captcha task");
            }
            // Poll for result
            for (let i = 0; i < 10; i++) {
                yield new Promise((res) => setTimeout(res, 1000));
                const getResultUrl = `${CAPTCHA_API_URL}/getTaskResult/${taskId}`;
                const resultResponse = yield axios_1.default.get(getResultUrl, { headers });
                if (resultResponse.data.code > 0) {
                    throw new Error("Captcha task failed");
                }
                if (resultResponse.data.success) {
                    return resultResponse.data.solution.token;
                }
            }
            throw new Error("Captcha resolution timeout");
        }
        catch (error) {
            console.error("Captcha resolution error:", error);
            throw error;
        }
    });
}
// Configure Chrome options with proxy support
const proxyEndpoints = [
    "gate.smartproxy.com:10001:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10002:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10003:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10004:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10005:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10006:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10007:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10008:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10009:spsdxii5lv:L76qn0xnfkw1=BPktF",
    "gate.smartproxy.com:10010:spsdxii5lv:L76qn0xnfkw1=BPktF",
];
const getRandomProxy = () => {
    const proxy = proxyEndpoints[Math.floor(Math.random() * proxyEndpoints.length)];
    const [host, port, username, password] = proxy.split(":");
    return `http://${username}:${password}@${host}:${port}`;
};
const chromeOptions = new chrome_1.default.Options();
chromeOptions.addArguments(`--proxy-server=${getRandomProxy()}`, "--disable-blink-features=AutomationControlled", "--disable-infobars", "--disable-dev-shm-usage", "--no-sandbox", "--disable-gpu", "--disable-extensions", "--disable-popup-blocking", "--disable-notifications", "--disable-web-security", "--disable-logging", "--log-level=3", "--silent", "--headless=new", "--window-size=1920,1080", "--start-maximized", "--disable-blink-features", "--disable-features=IsolateOrigins,site-per-process", "--disable-software-rasterizer", "--disable-background-networking", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows", "--disable-breakpad", "--disable-client-side-phishing-detection", "--disable-component-update", "--disable-default-apps", "--disable-domain-reliability", "--disable-hang-monitor", "--disable-ipc-flooding-protection", "--disable-renderer-backgrounding", "--disable-sync", "--force-color-profile=srgb", "--metrics-recording-only", "--no-first-run", "--safebrowsing-disable-auto-update", "--password-store=basic", "--use-mock-keychain", "--enable-webgl", "--enable-3d-apis", "--enable-features=WebRTC-HideLocalIPs", "--disable-webgl-image-chromium", "--disable-reading-from-canvas", "--disable-canvas-aa", "--disable-2d-canvas-clip-aa", "--disable-gl-drawing-for-tests", "--disable-accelerated-2d-canvas", "--disable-accelerated-video-decode", "--disable-accelerated-video-encode", "--disable-accelerated-mjpeg-decode", "--disable-gpu-compositing", "--disable-gpu-rasterization", "--disable-gpu-sandbox", "--disable-oop-rasterization", "--disable-software-rasterizer", "--disable-threaded-animation", "--disable-threaded-scrolling", "--disable-vulkan", "--disable-webgl2", "--disable-webgl-draft-extensions", "--disable-webgl-image-chromium", "--disable-webgl2-compute-context", "--disable-webgl2-context", "--disable-webgl2-debug-renderer-info", "--disable-webgl2-extensions", "--disable-webgl2-multisampling", "--disable-webgl2-shader-translator", "--disable-webgl2-vao", "--disable-webgl2-vertex-array-object", "--disable-webgl2-webgl-context", "--disable-webgl2-webgl2-context", "--disable-webgl2-webgl2-debug-renderer-info", "--disable-webgl2-webgl2-extensions", "--disable-webgl2-webgl2-multisampling", "--disable-webgl2-webgl2-shader-translator", "--disable-webgl2-webgl2-vao", "--disable-webgl2-webgl2-vertex-array-object", "--disable-webgl2-webgl2-webgl-context", "--disable-webgl2-webgl2-webgl2-context", "--disable-webgl2-webgl2-webgl2-debug-renderer-info", "--disable-webgl2-webgl2-webgl2-extensions", "--disable-webgl2-webgl2-webgl2-multisampling", "--disable-webgl2-webgl2-webgl2-shader-translator", "--disable-webgl2-webgl2-webgl2-vao", "--disable-webgl2-webgl2-webgl2-vertex-array-object");
// Configure experimental options using correct API
chromeOptions.addArguments("--disable-blink-features=AutomationControlled", "--disable-infobars", "--disable-dev-shm-usage", "--no-sandbox", "--disable-gpu", "--disable-extensions", "--disable-popup-blocking", "--disable-notifications", "--disable-web-security", "--disable-logging", "--log-level=3", "--silent", "--headless=new", "--window-size=1920,1080", "--start-maximized");
// Set experimental options through proper API
chromeOptions.addArguments("--excludeSwitches=enable-automation");
chromeOptions.addArguments("--useAutomationExtension=false");
// Set user preferences without duplicates
chromeOptions.addArguments("--webrtc.ip_handling_policy=disable_non_proxied_udp", "--webrtc.multiple_routes_enabled=false", "--webrtc.nonproxied_udp_enabled=false");
chromeOptions.setUserPreferences({
    "webrtc.ip_handling_policy": "disable_non_proxied_udp",
    "webrtc.multiple_routes_enabled": false,
    "webrtc.nonproxied_udp_enabled": false,
    "profile.managed_default_content_settings.images": 1,
    "profile.default_content_setting_values.notifications": 2,
    "profile.managed_default_content_settings.cookies": 1,
    "profile.managed_default_content_settings.javascript": 1,
    "profile.managed_default_content_settings.plugins": 1,
    "profile.managed_default_content_settings.popups": 2,
    "profile.managed_default_content_settings.geolocation": 2,
    "profile.managed_default_content_settings.media_stream": 2,
    "profile.default_content_setting_values.media_stream_mic": 1,
    "profile.default_content_setting_values.media_stream_camera": 1,
    "profile.default_content_setting_values.geolocation": 1,
    "profile.default_content_setting_values.protocol_handlers": 1,
    "profile.default_content_setting_values.register_protocol_handler": 1,
});
// Function to get dynamic headers from browser
function getDynamicHeaders(driver, productUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if we're on captcha page
            const currentUrl = yield driver.getCurrentUrl();
            if (currentUrl.includes("verify/traffic")) {
                console.log("Captcha detected, attempting to solve...");
                const captchaToken = yield solveCaptcha(currentUrl);
                yield driver.executeScript(`document.getElementById('g-recaptcha-response').value='${captchaToken}';`);
                yield driver.executeScript(`document.getElementById('recaptcha-form').submit();`);
                yield (0, utils_1.randomDelay)(3000, 5000); // Wait for captcha submission
                // Check if we're still on captcha page
                const newUrl = yield driver.getCurrentUrl();
                if (newUrl.includes("verify/traffic")) {
                    throw new Error("Failed to solve captcha");
                }
            }
            // Get cookies and format them
            const cookies = yield driver.manage().getCookies();
            const cookieString = cookies
                .map((c) => `${c.name}=${c.value}`)
                .join("; ");
            // Get additional dynamic values from page
            const dynamicValues = yield driver.executeScript(() => {
                const metaTags = document.querySelectorAll('meta[name^="shopee"]');
                const values = {};
                metaTags.forEach((tag) => {
                    const meta = tag;
                    if (meta.name && meta.content) {
                        values[meta.name] = meta.content;
                    }
                });
                return values;
            });
            // Construct headers with dynamic values and additional anti-bot measures
            const headers = {
                "User-Agent": (0, utils_1.rotateUserAgent)(),
                Cookie: cookieString,
                Referer: productUrl, // Use the actual product URL as referer
                "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                Accept: "application/json, text/plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-Shopee-Language": "zh",
                "X-API-Source": "pc",
                "af-ac-enc-dat": dynamicValues["shopee-af-ac-enc-dat"] || "null",
                "X-CSRFToken": dynamicValues["shopee-csrf-token"] || "",
                "X-Shopee-Token": dynamicValues["shopee-token"] || "",
                Origin: "https://shopee.tw",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                Connection: "keep-alive",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                "X-Forwarded-For": `127.0.0.${Math.floor(Math.random() * 255)}`, // Random IP
                "X-Real-IP": `127.0.0.${Math.floor(Math.random() * 255)}`, // Random IP
            };
            return headers;
        }
        catch (error) {
            console.error("Error getting dynamic headers:", error);
            throw error;
        }
    });
}
function scrapeProductData(storeId, dealId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://shopee.tw/a-i.${storeId}.${dealId}`;
        // Initialize Selenium WebDriver with local ChromeDriver
        const service = new chrome_1.default.ServiceBuilder(require("chromedriver").path);
        const driver = yield new selenium_webdriver_1.Builder()
            .forBrowser("chrome")
            .setChromeOptions(chromeOptions)
            .setChromeService(service)
            .build();
        try {
            console.log("Navigating to product page:", url);
            yield driver.get(url);
            yield (0, utils_1.randomDelay)(2000, 4000); // Random delay to mimic human behavior
            // Wait for page to load completely
            console.log("Waiting for JSON-LD script tag...");
            try {
                yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css('script[type="application/ld+json"]')), 15000);
            }
            catch (err) {
                console.error("Timeout waiting for JSON-LD script:", err);
                // Take screenshot for debugging
                const screenshot = yield driver.takeScreenshot();
                console.error("Page screenshot:", screenshot);
                throw new Error("Timeout waiting for product data");
            }
            // Check for captcha page
            const currentUrl = yield driver.getCurrentUrl();
            console.log(currentUrl);
            if (currentUrl.includes("verify/traffic")) {
                throw new Error("Captcha page detected. Please solve manually or use a captcha solving service.");
            }
            // Get dynamic headers with additional security checks
            const headers = yield getDynamicHeaders(driver, url);
            // Extract JSON data
            const jsonData = yield driver.executeScript(() => {
                const scriptTag = document.querySelector('script[type="application/ld+json"]');
                return scriptTag ? JSON.parse(scriptTag.innerHTML) : null;
            });
            if (!jsonData) {
                throw new Error("Failed to extract JSON data from the page.");
            }
            return { jsonData, headers };
        }
        finally {
            yield driver.quit();
        }
    });
}
function fetchFromShopeeAPI(storeId_1, dealId_1) {
    return __awaiter(this, arguments, void 0, function* (storeId, dealId, retries = 3, delay = 1000) {
        const apiUrl = `https://shopee.tw/api/v4/pdp/get_pc?shopid=${storeId}&itemid=${dealId}`;
        try {
            // First get the dynamic headers by scraping the product page
            const { headers } = yield scrapeProductData(storeId, dealId);
            const proxyConfig = {
                host: "gate.smartproxy.com",
                port: parseInt(proxyEndpoints[Math.floor(Math.random() * proxyEndpoints.length)].split(":")[1]),
                auth: {
                    username: proxyEndpoints[0].split(":")[2],
                    password: proxyEndpoints[0].split(":")[3],
                },
            };
            console.log("Making API request with headers:", headers);
            const response = yield axios_1.default.get(apiUrl, {
                headers,
                httpsAgent: new https_1.default.Agent({
                    rejectUnauthorized: false,
                }),
                proxy: proxyConfig,
                timeout: 15000, // Add timeout to prevent hanging
            });
            if (typeof response.data === "string") {
                const jsonMatch = response.data.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error("Invalid API response format");
            }
            return response.data;
        }
        catch (error) {
            // if (retries > 0) {
            //   console.log(`Retrying... Attempts left: ${retries - 1}`);
            //   await new Promise((resolve) => setTimeout(resolve, delay));
            //   return fetchFromShopeeAPI(storeId, dealId, retries - 1, delay * 2);
            // }
            // if (axios.isAxiosError(error)) {
            //   console.error("Shopee API Error:", error.response?.data || error.message);
            //   if (error.response?.status === 403) {
            //     console.error(
            //       "Captcha or rate limit detected. Please solve manually or use a captcha solving service."
            //     );
            //   }
            // }
            throw error;
        }
    });
}
