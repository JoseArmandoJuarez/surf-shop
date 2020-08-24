require('dotenv').config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

async function geocode(location){

    try{
        let response = await geocodingClient
            .forwardGeocode({
                query: location, // location to pass
                limit: 1         // only one result
            })
            .send();

        console.log(response.body.features[0].geometry.coordinates);
    } catch (err){
        console.log(err);
    }
}

geocode('Alaska, us')