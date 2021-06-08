const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const CatchAsync = require("../utils/CatchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { IsLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", IsLoggedIn, CatchAsync(reviews.createReview));
router.delete("/:reviewId", IsLoggedIn, isReviewAuthor, CatchAsync(reviews.deleteReview));
module.exports = router;