const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models").userModel;
const { registerValidation, loginValidation } = require("../schemaValidation");

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working.",
  };
  res.json(msgObj);
});

router.post("/register", async (req, res) => {
  // check the validation of data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  // chech if the user exists
  const foundUser = await User.findOne({ email: req.body.email });
  if (foundUser)
    return res.status(400).send({ error: "Email has been registered." });

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  })
    .save()
    .then((savedUser) => {
      res.status(201).send({
        message: "New user created",
        data: savedUser,
      });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.post("/login", (req, res) => {
  // chech the validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  // check if the user existed
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(400).send({ error: err });
    if (!user) {
      return res.status(404).send({ error: "Wrong email or password." });
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(401).send({ error: "Wrong email or password." });
        } else {
          // create jwt
          const payload = { _id: user._id, email: user.email };
          const token = jwt.sign(payload, process.env.JWT_SECRET);
          res.status(200).send({ token: "JWT " + token, user });
        }
      });
    }
  });
});

module.exports = router;
