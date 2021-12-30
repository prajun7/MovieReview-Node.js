const express = require("express");
const router = express.Router();

// add for database
const User = require("../models/User");

// Adding user to the databse
//this route is, /user
router.post('/', (req, res) => {

    const user = new User({
        name: req.body.name,   //gives name that the store had entered
        email: req.body.email
    });
    user.save()  // adds to the databse
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message : err});
    });
});

//Finds the user with specific id
router.get('/:id', async (req,res) => {
    try{
        const user = await User.findById(req.params.id);  
        res.json(user);
    }catch(err){
        res.json({message : err})
    }
});

module.exports = router;

