const express = require('express');
const users = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const cors = require('cors');


// // INDEX
// users.get('/', (req, res) => {
//     User.find({}, (err, foundUsers) => {
//       if (err) {
//         res.status(400).json({ error: err.message })
//       }
//       res.status(200).json(foundUsers)
//     })
// })

users.post("/", cors(), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://cryptotrack.herokuapp.com');
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
users.get('/:id', cors(), (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://cryptotrack.herokuapp.com');
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
users.delete('/:id', cors(), (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://cryptotrack.herokuapp.com');
    User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
        if(err) {
            res.status(400).json({error: err.message})
        }
        res.status(200).json(deletedUser);
    })
})

// UPDATE USER INFO
users.put('/:id', cors(), (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://cryptotrack.herokuapp.com');
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