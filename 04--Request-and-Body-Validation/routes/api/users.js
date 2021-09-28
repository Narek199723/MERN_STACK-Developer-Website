const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
  (req, res) => {
    // ^ errors variable is going to contain the errors oft the validation , if something will be wrong with name,email,password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // *  IF there will be any errors with validation, we will send this as a response
      return res.status(400).json({ errors: errors.array() });
    }
    // ^  req.body is going to the data that is going to be sent on this route
    console.log(req.body);
    res.send("User route");
  }
);

module.exports = router;
