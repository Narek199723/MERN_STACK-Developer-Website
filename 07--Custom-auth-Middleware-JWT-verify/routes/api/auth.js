const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/User");

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

module.exports = router;
