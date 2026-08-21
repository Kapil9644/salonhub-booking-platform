const express = require("express");
const { reverseGeocode } = require("../controllers/locationController");

const router = express.Router();

router.post("/reverse-geocode", reverseGeocode);

module.exports = router;
