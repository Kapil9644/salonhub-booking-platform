const express = require("express");
const router = express.Router();

const {
  getPublicSupportSettings,
} = require("../controllers/publicSettingsController");

router.get("/support", getPublicSupportSettings);

module.exports = router;
