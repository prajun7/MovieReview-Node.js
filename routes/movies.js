const express = require("express");
const router = express.Router();

// objectId
// Need to import this to convert the string into objectID for using find in mongoo
// See /:id/reviews for the post request below
const ObjectId = require('mongodb').ObjectId; 

// add for database
const Movie = require("../models/Movie");
const Review = require("../models/Review");

// Adding movie to the databse
//this route is, /movie
router.post('/', (req, res) => {

    const movie = new Movie({
        title: req.body.title,   //gives title that the store had entered
        genre: req.body.genre,   //To store array also, we just need to pass it
        year: req.body.year,
        director: req.body.director
    });
    movie.save()  // adds to the databse
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message : err});
    });
});


//Finds the mvoie with specific id
router.get('/:id', async (req,res) => {
    try{
        const movie = await Movie.findById(req.params.id);  
        res.json(movie);
    }catch(err){
        res.json({message : err})
    }
});


//Updates all the provided movie Information
//Algorithm to update,
//First, find the movie by the id

router.patch('/:id', async(req,res) => {
    try{
        const updatedMovie = await Movie.updateOne(
            { _id : req.params.id},
            {$set : {title : req.body.title,
                    genre : req.body.genre,
                    year : req.body.year,
                    director : req.body.director
            }}
        );
        res.json(updatedMovie);
    }catch(err){
        res.json({message : err})
    }
});

//REVIEWS
//Create a review for the given Movie ID,

router.post('/:id/reviews', async (req,res) => {
    try{
        const review = new Review({
            user_id : req.body.user_id,
            movie_id: req.params.id,
            content : req.body.content
            //upvote
            //downvote
            //votes
        });
        
        const savedReview = await review.save();  //adds to the databse. Using await to wait
        res.json(savedReview);
        
    }catch(err){
        res.json({message : err});
    }
});


//Get the review for the given movie id
router.get('/:id/reviews', async (req,res) => {

    let movie_id = req.params.id;       
    let o_movie_id = new ObjectId(movie_id);   //Need to convert to ObjectID
    //Works without converting to objectID also.

    try{
        const review = await Review
            .find({"movie_id" : movie_id })
            .populate("movie_id")
            .populate("user_id");       //.populate will give us the information about the movie and user
            // .populate will convert the movie_id or user_id field to it's exact content
            //Inside the .populate just pass the filed that we want

        res.json(review);

    }catch(err){
        res.json({message : err});
    }
});

// Get the specific review for the movie
router.get('/:id/reviews/:reviewId', async (req,res) => {

    let movie_id = req.params.id;       
    let o_movie_id = new ObjectId(movie_id);   //Need to convert to ObjectID
    //Works without converting to objectID also.

    let reviewId = req.params.reviewId;
    let o_reviewId = new ObjectId(reviewId);
    try{
        const review = await Review
            .find({"movie_id" : movie_id , "_id" : reviewId})
            .populate("movie_id")
            .populate("user_id");   
            //.populate will give us the information about the movie and user
            // .populate will convert the movie_id or user_id field to it's exact content
            //Inside the .populate just pass the filed that we want

        res.json(review);

    }catch(err){
        res.json({message : err});
    }

});

// Delete the specific review for the movie
// Get the review and just use remove
router.delete('/:id/reviews/:reviewId', async (req,res) => {

    let movie_id = req.params.id;       
    let o_movie_id = new ObjectId(movie_id);   //Need to convert to ObjectID

    let reviewId = req.params.reviewId;
    let o_reviewId = new ObjectId(reviewId);
    try{
        const review = await Review.remove({"movie_id" : o_movie_id , "_id" : o_reviewId});  
        res.json(review);

    }catch(err){
        res.json({message : err});
    }

});


//cast the vote
router.patch('/:id/reviews/:reviewId/vote', async (req,res) => {

    let movie_id = req.params.id;       
    let o_movie_id = new ObjectId(movie_id);   //Need to convert to ObjectID

    let reviewId = req.params.reviewId;
    let o_reviewId = new ObjectId(reviewId);

    let votes = req.body.votes;
    //console.log(votes);

    let vote_type = votes[1].vote_type;   //get the vote type, it could be "up" or "down"
   // console.log(vote_type);

    let user_id = votes[0].user_id;
  //  console.log(user_id);

    // let o_user_id = new ObjectId(user_id);
    // console.log(o_user_id);

    let update_field = "";
    if (vote_type == "up"){   //if the vote type is "up" update the upvote field
        update_field = "upvote";
    }else if (vote_type == "down"){
        update_field = "downvote";
    }

    const already_exists_user = await Review.findOne({"votes.user_id" : user_id});
     //console.log(already_exists_users); This will give null if no data found

    const already_exists_voteType = await Review.findOne({"votes.vote_type" : vote_type});
    //votes.vote_type will search inside the array, check in mongoplayfround, check below for sample
    // try to see $elemMatch. Important
      
    /* 
    The idea is, if the user already exits and he has voted "up" for the movie.But, if that same user
    tries to vote again with "down" i.e he has changed his vote_type than he is allowed to vote.
    Else, if the user already exits and the vote_type is also same then the user cannot vote.
    */

    //If already_exists_user is not equal to null, that means the user already exits and just return
    //If already_exists_voteType is same as the previous vote type of the user than, it will give some
         // value which means it is not null. And that means that user has already voted with same vote type.
         // In that case don't let them vote, just return

    if (already_exists_user != null && already_exists_voteType != null){
        res.json("The user has already voted");
        return;
    }

    try{
        const updatedReview = await Review.updateOne(
            {"movie_id" : o_movie_id , "_id" : o_reviewId },
            {
                $inc: {
                [update_field]: 1
                },
                //update_field is a variable which we are using
                $push: {
                  votes: {
                    user_id: user_id,
                    vote_type: vote_type
                  }
                }
              }
        );
         res.json(updatedReview);
    }catch(err){
        res.json({message : err})
    }

});

module.exports = router;


/*
In Mongo playground

[
  {
    "_id": "61c4e54f03bf7c3a6f23906d",
    "user_id": "61c3b3390bedeee9577ce24a",
    "movie_id": "61c3c802be084315b24e96d9",
    "content": "Comment from Zoro to movie Death Note",
    "__v": 0,
    "upvote": 5,
    "downvote": 4,
    "votes": [
      {
        "vote_type": "up"
      },
      {
        "user_id": "adadadaad"
      }
    ]
  }
]
*/


// In Postman's body
/*
{
	"votes":[
		{"user_id" : "61c3b3460bedeee9577ce24c"},
		{"vote_type" : "up"}
	]
}

*/
