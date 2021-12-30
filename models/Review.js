const mongoose = require('mongoose');
const ReviewSchema = mongoose.Schema({
     user_id : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "User"
     },
     movie_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Movie"
    },

     content : String,

     upvote : {
        type : Number, 
        default : 0}, //default

     downvote : {
        type : Number,
        default : 0 },

     votes :[{
         user_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
         },
         vote_type : String
     }]
 });

module.exports = mongoose.model("Review",ReviewSchema);

/*
For /movies/:id/reviews post request, in the body of post
provide the user's id who is giving the review abd the content
get movie id form the param field

 {
    "user_id" : "61c3b270225b86b4c8bf2808",
    "content" : "Badass"
    
 }

*/