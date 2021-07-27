const axios = require("axios");
const {GetClientLocationByIP} = require("../Api/Utils/UtilFunctions/clientUtils");
let expect = require("chai").expect;
require('dotenv').config({path: __dirname + '/./../.env_tests'})
const googleApi = process.env.GOOGLE_API

describe("Check ipv4 location api", function () {
    it("gets a location based on ipv4 address", async function () {
        let location = await GetClientLocationByIP('176.231.94.238')
        expect(location).to.not.eq('')
    });
});

describe("Get client location based on geolocation", function () {
    it("gets a location based on mac addresses around the client", async function () {
        let mockData = {
            "considerIp": false,
            "wifiAccessPoints":
                [
                    {"macAddress": "00:b8:c2:68:05:87", "signalStrength": "-35"},
                    {"macAddress": "00:b8:c2:1e:3e:75", "signalStrength": "-45"},
                    {"macAddress": "98:1e:19:7b:62:6e", "signalStrength": "-61"},
                    {"macAddress": "d4:7b:b0:79:a7:09", "signalStrength": "-61"},
                    {"macAddress": "00:b8:c2:1b:59:b8", "signalStrength": "-61"},
                    {"macAddress": "58:cb:52:e3:1b:fd", "signalStrength": "-65"},
                    {"macAddress": "c8:93:46:5c:53:bc", "signalStrength": "-67"},
                    {"macAddress": "5a:cb:52:e3:1b:fc", "signalStrength": "-67"},
                    {"macAddress": "00:b8:c2:4a:bf:0d", "signalStrength": "-69"},
                    {"macAddress": "78:32:1b:d5:9a:c5", "signalStrength": "-69"}
                ]
        }
        let location = await axios({
            method: 'POST',
            url: `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleApi}`,
            data: mockData
        })
            .then((data) => {
                return data.data.location;
            })
            .catch((err) => {
                console.log(`Error getting client location: ${err.message}`)
                return null
            })
            .then((data) => data)
        expect(location).to.not.eq(null)
    });
});

describe("Get client location data", function () {
    it("gets a specific location on an lat lng object", async function () {
        let locationObject = {lat: 32.0800007, lng: 34.775195}
        let locationMetaData = await axios(
            {
                url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.lng}&key=${googleApi}`,
            }).then((data) => {
            let fullAddress = data.data.results[0].formatted_address.toString()
            data = {
                country: fullAddress.split(',')[2],
                city: fullAddress.split(',')[1],
                home_address: fullAddress.split(',')[0]
            }
            return data
        }).catch((err) => {
            console.log(`Error retrieving client full location data ${err.message}`)
            return null
        })
        expect(locationMetaData).to.not.eq(null)
    });
});
