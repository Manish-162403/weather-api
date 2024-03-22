const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const axios = require('axios')
const bodyParser = require('body-parser');
const obj = require('./cityController')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
let apikey="d6458d1ed7cdae6d47767909005585ac"



mongoose.connect("mongodb+srv://PrachiRakhonde:TidE9uPBxvyZRFOn@cluster0.vdm2ccj.mongodb.net/weather?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.get("/location", async function(req,res,next){
        // console.log("req", req.query);
        let options = {
            method: "GET",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=${apikey}`
        }
    const weatherDetails = await axios(options)


    res.send(weatherDetails.data)
})

// Post api to add new location
app.post('/locations',obj.createCity);

// Get api to get all locations
app.get('/locations',obj.fetchAllCity);

// Get api to get location by ID
app.get('/locations/:id',obj.fetchCityById);

//delete api to delete location by ID
app.delete('/locations/:id',obj.deleteCity);

//Put api to update location
app.put('/location/:id',obj.updateCity);

//Get api to get data for specific location of given day period
app.get('/history', obj.getWeatherHistory);

app.get('/cityLogData',obj.fetchAllSavedData);
app.get('/getAllCityWeatherData',obj.fetchAllCityWeather);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
