const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
// ^  THis is for avatar(checking,size and so on)
const gravatar = require("gravatar");
const config = require("config");
const jwt = require("jsonwebtoken");

// ! importing user model
const User = require("../../models/User");

// *  @route POST api/users
// *  @desc Register user
// *  @access Public
router.post(
  "/",
  [
    // &  Checking validation of name.email,password
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "PLease enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  // ^ WE mark this as async so we won't need to use promises, instead we will use async await
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // !  Checking if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // !  Getting users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // ! Encrypting password using bcrypt

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      // ^  Saving password
      await user.save();

      // ! Returning jsonwebtoken
      const payload = {
        user: {
          id: user.id, //* mongoDb stores _id, but with mongoose we can access it just with .id
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      User.findOne;
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
