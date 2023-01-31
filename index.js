const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
require("./config/passport")(passport);

const userRouter = require("./routes").userRouter;
const courseRoute = require("./routes").courseRouter;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("successfully connect to local mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ etended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use("/api/user", userRouter);
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
