
const {v4 : uuidv4} = require('uuid');
const axios = require("axios");
const cityModel = require('./city');
const logModel = require('./log');
const {forEach} = require('p-iteration');

let apikey="d6458d1ed7cdae6d47767909005585ac"

const cityObj = {
    createCity : async function(req,res,next){

        let {city,city_id} = req.body;
        let duplicateId = await cityModel.findOne({city_id : city_id});
        if(duplicateId){
            return res.send({
                status : false,
                message : "City is already present with this Id."
            })
        }
        let id = uuidv4();
        let createData = {
            _id : id,
            city : city,
            city_id : city_id
        }
    
        let addData = await cityModel.create(createData);
        console.log('data added',addData)

        return res.json({
            msg : "Data added",
            status : "success",
            data : addData
        })
    
    },

    fetchCityById : async function (req,res){
        // console.log('city',req)

        try{
            console.log('req....',req.params)
            let city_id = req.params.id;
            let fetchData = await cityModel.findOne({city_id : city_id}).select({city:1});
            let city = fetchData.city;

            let options = {
                method: "GET",
                url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`
            }

            let weatherDetails = await axios(options)
            weatherDetails=weatherDetails.data
            let obj = {
                city: weatherDetails.name,
                long: weatherDetails.coord.lon,
                lat: weatherDetails.coord.lat,
                humidity: weatherDetails.main.humidity,
                temp: weatherDetails.main.temp,
                windSpeed: weatherDetails.wind.speed,
            }
             let logId = uuidv4();
             log = {
                _id : logId,
                city: weatherDetails.name,
                long: weatherDetails.coord.lon,
                lat: weatherDetails.coord.lat,
                humidity: weatherDetails.main.humidity,
                temp: weatherDetails.main.temp,
                windSpeed: weatherDetails.wind.speed,
             }
             
             await logModel.create(log);
             console.log('log saved');

            res.json({
                status : "success",
                city : obj
            })


        }
        catch(err){
            return res.json({status:false, message: err.message})

        }
    },

    updateCity : async function(req,res){
        let result = {};
        try{
            let {city} = req.body;
            let query = {city_id : req.params.id}
            let updateData = {
                city : city
            }
            let findCity = await cityModel.updateOne(query,{$set : updateData})
            let citydata = await cityModel.findOne(query).lean()

            result["success"] = true;
            result["message"] = "City is updated";
            result["data"] = citydata

        }
        catch(err){
            result["success"] = false;
            result["message"] = err.message
        }
        res.send(result)

    },

    deleteCity : async function(req,res){
        let result = {}

       try{
        console.log('id is', req.params.id)
        let city_id = req.params.id;
        let fetchData = await cityModel.deleteOne({city_id : city_id});
        
        result["suceess"] = true,
        result["message"] = "City is deleted"

       }
       catch(err){
        result = {
            success : false,
            message : err.message
        }
       }
       return res.json(result);
    },

    fetchAllCity : async function(req,res){
        let result = {}

        try{
            let cityData = await cityModel.find().lean();
            if(!cityData){
                result = {
                    success : false,
                    message : "No data found"
                }
            }

            result["success"] = true,
            result["data"] = cityData

        }
        catch(err){
           result = {
             status : false,
             message : err.message
           }
        }

        return res.json(result)
    },

    fetchAllSavedData : async function(req,res,next) {
        let result = {}
        try{
            let logData = await logModel.find().lean();
            if(!logData){
                result = {
                    success : false,
                    message : "No data found"
                }
            }

            result["success"] = true,
            result["data"] = logData

        }
        catch(err){
            result = {
                status : false,
                message : err.message
              }
        }

        res.json(result)
    },

    fetchAllCityWeather : async function(req,res){
        let result = {};
        try{
            let data = [];
            let allCity = await cityModel.find().select({city:1,city_id:1}).lean();
                allCity = allCity.sort((a,b)=>b.city_id-a.city_id)

            await forEach(allCity,async (current)=>{
                let options = {
                    method: "GET",
                    url: `http://api.openweathermap.org/data/2.5/weather?q=${current.city}&appid=${apikey}`
                }
    
                let weatherDetails = await axios(options)
                weatherDetails=weatherDetails.data
                let obj = {
                    city: weatherDetails.name,
                    city_id : current.city_id,
                    long: weatherDetails.coord.lon,
                    lat: weatherDetails.coord.lat,
                    humidity: weatherDetails.main.humidity,
                    temp: weatherDetails.main.temp,
                    windSpeed: weatherDetails.wind.speed,
                }

                data.push(obj)

            })

            result =  {
               status : true,
               weatherData : data
            }

        }
        catch(err){
            result = {
                status : false,
                message : err.message
            }

        }

        res.send(result)
    },

    getWeatherHistory : async function(req,res){
        let result = {};
        try{
            let city = req.query.q
            let days = req.query.cnt
            let options = {
                method : "Get",
                url : `http://api.openweathermap.org/data/2.5/forcast/daily?q=${city}&cnt=${days}&appid=${apikey}`
            }

            let getData = await axios(options);
            console.log(getData.data);

            result = {
                status : true,
                data : getData.data
            }
            
        }
        catch(err){
            result = {
                status : false,
                message : err.message
            }

        }
        
        res.send(result);
    }

}



module.exports = cityObj;