const API_KEYtemp= "AIzaSyAW-SFUhiRhodB486j9M27yMVUXWY0TP64"; // // process.env.GOOGLE_API_KEY

const API_KEY= "AIzaSyAdJ0OpfnmXSy1IWHXlQy-KNyXB-RPDOfs" //self- key
const  axios =require('axios');
const HttpError = require('../models/http-errors');

async function getCoordsForAddress(address){
const response =await axios.get(
`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
const data=response.data;
console.log('sdcjsdjcasdc')
if(!data || data.status ==='ZERO_RESULTS'){
    const error= new HttpError('could not find location',422);
    throw error;
};
const coordinates=data.results[0].geometry.location;

return coordinates;

}

module.exports=getCoordsForAddress;