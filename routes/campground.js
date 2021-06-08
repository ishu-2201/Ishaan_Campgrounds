const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const CatchAsync = require("../utils/CatchAsync");
const Campground = require("../models/campground");
const { IsLoggedIn, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
//const { storage } = require("../cloudinary/index");
const { storage } = require("cloudinary/index");
const upload = multer({ storage });

router.get("/new", IsLoggedIn, campgrounds.renderNewForm);
router.get("/:id/edit", IsLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm));
router.post("/", IsLoggedIn, upload.array("image"), CatchAsync(campgrounds.createCampground));

router.get("/", CatchAsync(campgrounds.index));
router.get("/:id", CatchAsync(campgrounds.showCampground));
router.put("/:id", IsLoggedIn, isAuthor, upload.array("image"), CatchAsync(campgrounds.updateCampground));
router.delete("/:id", IsLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground));
module.exports = router;