var sys = require("sys");
var fs = require('fs');
var stdin = process.openStdin();
var request = require("supertest");
var forecastURL= "https://api.forecast.io/"
var forecastAPI= "a0b1e44385fe714bf22939acb7554175"
var forecastPath= "forecast/"

console.log("Enter your address to get the weather.")

stdin.addListener("data", function(address) {
  var addressInput=  address.toString().substring(0, address.length-1);
  var googleAPIKey = "AIzaSyD1nyD8j7fGxJqwasfCcvDWjb4dp53Jilk";
  var googleAPIUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(addressInput) + "&key=" + googleAPIKey; 

  request("https://maps.googleapis.com/maps/api/geocode/json")
    .get("?address=" + encodeURIComponent(addressInput) + "&key=" + googleAPIKey)
    .end(function(err, res){
      if (err){
        console.log("Error with your Google request")
      }
      else {
        var lat= res.body.results[0].geometry.location.lat
        var lng= res.body.results[0].geometry.location.lng
        getForecast(lat,lng);
      }
    });
});


function getForecast(lat,lng) {
  var path= forecastPath + forecastAPI + "/" + lat + "," + lng;
  // console.log("This callback shows:" + path);
  request(forecastURL)
    .get(path)
    .send()
    .expect(200)
    .end(function(err, res) {
      if (err){
        console.log("Error with your forecast request.")
      }
      else {
        console.log("Here is the current weather for your location:" + "\n");
        console.log(JSON.stringify(res.body.currently, null, 4));
        console.log("Want to know the weather at another location? Enter a new address.")
      }
      fs.appendFile('weather.log', JSON.stringify(res.body.currently, null, 4) + "\n", function () {
        
      });
    });
}

