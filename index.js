const express = require('express');
const app = express();
const path = require('path');
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/', (req, res) => {
    res.render("index", {error: false});
});

app.post("/", async (req, res) => {
    const city = req.body.city;    
    const apiKey = process.env.api_Key;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    try {
        const response = await axios.get(url);
        let weatherData = response.data;        
        const temp = Math.floor(weatherData.main.temp - 273.15);
        const desc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        weatherData = { city: capitalizeFirstLetter(city), temperature: `${temp}°C`, description: desc, image: imageURL };
        res.status(200).render("post", { weather: weatherData, error: false });

    } catch (error) {
        res.render('index', {error: true});
    }
});

app.listen(process.env.PORT, () => {
    console.log('Server running on http://localhost:3000');
});
