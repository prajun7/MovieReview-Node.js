const mongoose = require('mongoose');

//creating mongoDb schema
const MovieSchema = mongoose.Schema({
    title :{
        type : String
    },
    genre :[{      //square brackets makes the genre array. So, it is representing arrays of strings
        type : String
    }],
    year : Number,
    director :{
        type : String
    }
});

module.exports = mongoose.model("Movie",MovieSchema);


/*
In postman in the body for post request, while creating movie 

 {
    "title":"One Piece",
    "genre": ["Action","Adventure","Story"],
    "year" : 1997,
    "director" : "Oda"
    
 }

*/