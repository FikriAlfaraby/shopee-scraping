"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateUserAgent = rotateUserAgent;
exports.generateShopeeHeaders = generateShopeeHeaders;
exports.randomDelay = randomDelay;
exports.getRandomIP = getRandomIP;
exports.getRandomReferer = getRandomReferer;
exports.getRandomAcceptLanguage = getRandomAcceptLanguage;
function rotateUserAgent() {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}
function generateShopeeHeaders() {
    const timestamp = Date.now();
    return {
        afAcEncDat: Buffer.from(`${timestamp}`).toString('base64'),
        afAcEncSzToken: Buffer.from(`${timestamp}-${Math.random().toString(36).substring(2)}`).toString('base64'),
        xSapRi: `${Math.random().toString(36).substring(2)}-${timestamp}`,
        xSapSec: Math.random().toString(36).substring(2, 15),
        cookie: `SPC_EC=${Math.random().toString(36).substring(2)}`
    };
}
function randomDelay(min, max) {
    const delayMs = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, delayMs));
}
function getRandomIP() {
    const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 255));
    return octets.join('.');
}
function getRandomReferer() {
    const referers = [
        "https://www.google.com/",
        "https://www.bing.com/",
        "https://www.yahoo.com/",
        "https://www.duckduckgo.com/",
        "https://www.baidu.com/"
    ];
    return referers[Math.floor(Math.random() * referers.length)];
}
function getRandomAcceptLanguage() {
    const languages = [
        "en-US,en;q=0.9",
        "zh-CN,zh;q=0.9",
        "ja-JP,ja;q=0.9",
        "ko-KR,ko;q=0.9",
        "th-TH,th;q=0.9"
    ];
    return languages[Math.floor(Math.random() * languages.length)];
}
