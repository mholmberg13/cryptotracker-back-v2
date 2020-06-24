const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cors = require('cors');

const User = require("../models/user.js");

router.post("/", cors(), (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    console.log(foundUser)
    console.log(req.body.password, foundUser.password)
    console.log(bcrypt.compareSync(req.body.password, foundUser.password))
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      req.session.currentUser = foundUser;
      let user = { ...foundUser._doc };
      delete user.password;
      res.status(201).json(user);
    } else {
      res.status(404).json({ error: "Incorrect username or password" });
    }
    // res.status(201).json(foundUser)
  });
});

router.delete("/", cors(), (req, res) => {
  req.session.destroy(() => {
    res.status(200);
  });
});

module.exports = router;