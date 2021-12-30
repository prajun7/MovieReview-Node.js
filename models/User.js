const mongoose = require('mongoose');

//creating mongoDb schema
const UserSchema = mongoose.Schema({
    name :{
        type : String
    },
    email :{
        type : String
    }
});

module.exports = mongoose.model("User",UserSchema);

/*
In postman in the body for post request, while creating user 

 {
    "name":"Luffy",
    "email": "luffy@onepiece.com"
    
 }

*/