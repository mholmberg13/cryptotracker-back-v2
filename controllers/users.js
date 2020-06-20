const express = require('express');
const users = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

users.post("/", (req, res) => {
  console.log(req.body);
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  User.create(req.body, (err, createdUser) => {
    let user = { ...createdUser._doc };
    delete user.password;
    res.status(201).json(user);
  });
});

// GET USER
users.get('/:id', (req,res) => {
    User.findById(req.params.id, (err,foundUser) => {
        if(err) {
            res.status(400).json({error: err.message})
        }
        res.status(200).json(foundUser)
    })
})

// // CREATE NEW USER
// users.post('/', (req,res) => {
//     User.create(req.body, (error, createdUser) => {
//         if(error) {
//             res.status(400).json({error: error.message})
//         }
//         res.status(200).json(createdUser)
//     })
// })

// DELETE USER
users.delete('/:id', (req,res) => {
    User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
        if(err) {
            res.status(400).json({error: err.message})
        }
        res.status(200).json(deletedUser);
    })
})

// UPDATE USER INFO
users.put('/:id', (req,res) => {
    User.findByIdAndUpdate(req.params.id, req.body, (err, updatedUser) => {
        if (err) {
            res.status(400).json({error: err.message})
        }

        updatedUser.username = req.body.username;
        updatedUser.password = req.body.password;
        updatedUser.currencyIds = req.body.currencyIds;

        console.log(req.body.currencyIds)

        res.status(200).json(updatedUser)
    })
})

module.exports = users;