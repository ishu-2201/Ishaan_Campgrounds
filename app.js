require("dotenv").config();

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
const ExpressError = require("./utils/ExpressError");
const CatchAsync = require("./utils/CatchAsync");
const mongoose = require('mongoose');
const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
//const MongoDBStore = new MongoStore(session);
// const helmet = require("helmet");
// const mongoSanitize = require('express-mongo-sanitize');
// app.use(mongoSanitize({
//     replaceWith: '_'
// }));

//const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const dbUrl = process.env.DB_URL;
//const dbUrl = 'mongodb+srv://ishu_2201:EP9RrbHCtWFC9Nwf@cluster0.yxtl7.mongodb.net/ICS_DB?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//  const secret = process.env.SECRET || "thisismysecret";
const secret = "thisismysecret";
/*const store = new MongoStore({
    db: mongoose.connection.db
})*/
const store = new MongoStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
});


const SessionConfig = {
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true
    },
    store: store
}


app.use(session(SessionConfig));

store.on("error", function (e) {
    console.log("Session store error", e);
})

app.use(flash());
// app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
const campgrounds = require("./routes/campground");
app.use("/campgrounds", campgrounds);

const review = require("./routes/review");
app.use("/campgrounds/:id/reviews", review);

const users = require("./routes/users");
app.use("/", users);
app.get("/", (req, res) => {
    res.render("home");
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong!!!" } = err;
    if (!err.message)
        err.message = "Something went wrong!!!";
    res.status(statuscode).render("error", { err });
})





const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port 3000");
})