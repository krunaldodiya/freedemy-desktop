"use strict";

const DEV = "http://localhost:3000";
const PROD = "http://streamly.tk";

const BASE_URL = process.env.NODE_ENV == "development" ? DEV : PROD;
const API_URL = BASE_URL + "/api/v1";

const apiEndPoints = {
  fetch_tv_links: API_URL + "/links/fetch-tv-links"
};

export { apiEndPoints, BASE_URL, API_URL };
