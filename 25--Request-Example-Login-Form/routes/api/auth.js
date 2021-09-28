const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// *  @route GET api/auth
// *  @desc Test route
// *  @access Public
// ? By adding auth we are protecting this route
router.get("/", auth, async (req, res) => {
  try {
    // * we don't want to get password back, so -password means that we dont want password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// *  @route POST api/auth
// *  @descAuthenticate user  & get token
// *  @access Public
router.post(
  "/",
  [
    // &  Checking validation of name.email,password
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  // ^ WE mark this as async so we won't need to use promises, instead we will use async await
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // !  Checking if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

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

module.exports = router;
