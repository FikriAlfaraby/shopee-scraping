
# Shopee Scraping Project

## Overview
This project is designed to scrape product details from Shopee using a headless browser automation approach. The strategy involves utilizing residential proxies, bypassing anti-bot mechanisms, and collecting the necessary headers to interact with Shopee's API for retrieving product data.

## **Endpoint**

### `GET /shopee`

This endpoint retrieves product details from Shopee based on the provided `storeId` and `dealId`.

#### **Request Parameters**

- `storeId` (required): The ID of the Shopee shop (equivalent to `shopId`).
- `dealId` (required): The ID of the product deal (equivalent to `itemId`).

#### **Query Example**

```
GET https://fikri-scrape-shopee.vercel.app/shopee?storeId=${storeId}&dealId=${dealId}
```

### **Request Example**

```bash
curl "https://fikri-scrape-shopee.vercel.app/shopee?storeId=178926468&dealId=2144812354"
```

#### **Response**

If the request is successful, the API will return a JSON response containing the product details.

##### **Success Response**

```json
{
  "status": "success",
  "message": "Product details fetched successfully",
  "data": {
    "shopId": "178926468",
    "itemId": "21448123549",
    "productData": {
      "name": "Product Name",
      "price": 123456,
      ......................
    }
  }
}
```

##### **Error Response**

In case of an error (e.g., invalid parameters or issues with Scrapeless service), the API will return an error response.

```json
{
  "status": "error",
  "message": "Failed to fetch product details",
  "error": "Error message or details here"
}
```

#### **Error Codes**

- **400** - Bad Request: Missing required parameters (`storeId` or `dealId`).
- **500** - Internal Server Error: Issue with Scrapeless service or scraping logic.

---

## **How It Works**

1. **Proxy Configuration**: 
   - The API connects through a secure residential proxy to avoid IP blocking.
   - Proxy authentication and secure HTTPS requests are configured.

2. **Browser Automation**: 
   - A headless browser (Puppeteer) is used with stealth plugins to simulate human browsing behavior.
   - The browser bypasses anti-bot mechanisms and intercepts network requests for headers.

3. **Security Token Acquisition**: 
   - The API extracts CSRF tokens and other necessary security headers during the scraping process.

4. **API Request Execution**: 
   - Authenticated API requests are made to Shopee to fetch product data.
   - Retry mechanisms are implemented to handle failed requests.

---

## Scraping Workflow
The scraping strategy follows a systematic approach, which can be broken down into the following key steps:

### 1. Proxy Configuration
- Establish a secure connection through residential proxies to avoid IP blocking.
- Implement proxy authentication using provided credentials to ensure anonymity and security.
- Configure an HTTPS proxy agent to securely handle all requests.

### 2. Browser Automation
- Initialize a headless browser instance using Puppeteer with Stealth Plugin to mimic human-like browsing behavior.
- Configure the browser to bypass common bot detection mechanisms employed by Shopee.
- Set up request interception to collect important headers such as security tokens.

### 3. Security Token Acquisition
- Navigate to the target product page to initiate a session.
- Intercept network requests during page loading to capture the necessary security headers.
- Extract the CSRF token from the browser's cookies to use in subsequent API requests.

### 4. API Request Execution
- Construct authenticated API requests using the collected headers, including the CSRF token.
- Implement a retry mechanism for failed requests to handle temporary network issues.
- Handle rate-limiting and session expiration to ensure the scraper can run continuously without interruptions.

This approach ensures reliable data collection while maintaining proper security protocols and respecting Shopee's anti-scraping measures.

## Setup
To run the project locally, follow these steps:

### Prerequisites
- Node.js (version 14.x or higher)
- NPM (Node Package Manager)
- A valid proxy account (residential proxies)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shopee-scraping.git
   ```

2. Navigate to the project directory:
   ```bash
   cd shopee-scraping
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your proxy credentials and other configurations in the environment variables or directly in the code.

### Running the Scraper
Start the server by running:
```bash
npm run dev
```

## Known Issues & Challenges
- **Authentication and Redirection:** When attempting to access the product details via automation, the scraper often encounters a redirection to a verification page (e.g., `/verify/traffic`, `/verify/bot`, or login page). This happens because Shopee detects bot-like behavior and triggers CAPTCHA or other verification measures.
  
- **Session Expiration:** The scraping process might experience session expiration, requiring the scraper to re-authenticate or restart the session.

## Current Skill Level
I am currently improving my scraping skills. As of now, I have been able to implement basic automation for scraping product data, but there are still challenges in handling advanced anti-scraping measures. Specifically, bypassing CAPTCHA, handling session expiration, and overcoming other bot-detection mechanisms are areas I am still working on.

If you have any suggestions or advice on how to overcome these issues, feel free to contribute or reach out!
