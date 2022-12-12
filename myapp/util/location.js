const secrets = require('../config/secrets');
const axios = require("axios");
const HttpError = require("../models/http-errors");

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${secrets.google_map_api_key}`
  );
  const data = response.data;
 
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("could not find location", 422);
    throw error;
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
