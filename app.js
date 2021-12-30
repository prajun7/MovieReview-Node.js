/*
NodeJS
Practice Problem: 2

Create a movie review system where the users can write reviews of movies and other users can upvote (helpful) or 
downvote (unhelpful) those reviews. So for example, a user named John writes a review on the movie. 
Another person named Alice can upvote or downvote that review. 

To design this system, you’re given some basic hints below

Models:
User (name, email)
Movies (title, genre [array], year, director)
Reviews (user_id -> the User id who posted the review, content, upvote [int], downvote[int], votes[array of objects]*)

(Video explanation of model: https://www.loom.com/share/5b2d5fa1edcc4a2baec1190c9a790f39)

* The votes array would be an array of objects, referring to each upvote/downvote cast by a user. 
The basic structure of each object would be { user_id, vote_type [“up”/”down”] }. 
If the vote_type is “up”, you add 1 to the model’s upvote field, otherwise to the downvote field. 
One user can cast one and only one vote on a specific review.

As this is your first time designing a REST API, the endpoints are already given below

(See table on pdf for Endpoints)
Based on the given endpoints and other information, create the REST API.

The following resources will be helpful while designing this system:
MongoDB Schema Design best practices: https://www.youtube.com/watch?v=leNCfU5SYR8
Mongoose Relationships (will be required to create the relation between User and Review model): https://vegibit.com/mongoose-relationships-tutorial/
Mongoose Schema Examples: https://coursework.vschool.io/mongoose-schemas
*/

const express = require("express");
const app = express();

//for body-parser to read post requests
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json());

//for database
const mongoose = require("mongoose");
const db_uri = require('./db/db_connection');

//for routes
const userRoute = require('./routes/users');  //for users
const movieRoute = require('./routes/movies'); //for movies

app.use('/users',userRoute);
//whenever we go to /users run the userRoute

app.use('/movies',movieRoute);
// //whenever we go to /movies run the movieRoute

mongoose.connect(
    db_uri,
    {useNewUrlParser : true
    }).then(() => {
        console.log("Conncetion Successful");
    }).catch((err) => {
        console.log(err);
    });

app.get("/", (req,res)=>{
    res.send("We are at home");
});

// app.post("/p",(req,res) =>{
//     console.log(req.body);
//     res.send(req.body);
// });

app.listen(2000,() =>{
    console.log("Listening on port 2000");
});