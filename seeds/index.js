const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedhelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const random = (arr) => {
    const r = Math.floor(Math.random() * arr.length);
    return arr[r];
}

const create = async () => {
    await Campground.deleteMany({});
    const r1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < 50; i++) {
        const camp = new Campground({
            author: "60558f3e7091e83fe00cf61e",
            title: `${random(descriptors)} ${random(places)}`,
            location: `${cities[r1000].city},${cities[r1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dzmy0hoho/image/upload/v1620029654/YelpCamp/fnccpkttioxsasxk1abp.jpg',
                    filename: 'YelpCamp/fnccpkttioxsasxk1abp'
                },
                {
                    url: 'https://res.cloudinary.com/dzmy0hoho/image/upload/v1620412118/YelpCamp/oo7exumljb4o3gyiv710.jpg',
                    filename: 'YelpCamp/oo7exumljb4o3gyiv710'
                }
            ]
        })
        await camp.save();
    }
}
create().then(() => {
    mongoose.connection.close();
})

