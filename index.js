require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { UserSchema, VehicleSchema } = require("./Schema.js");
const { generateJWT } = require("./utils.js");

const port = 8080;

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .catch((e) => {
        console.log(e);
    });

const User = mongoose.model("User", UserSchema);
const Vehicle = mongoose.model("Vehicle", VehicleSchema);

app.get("/", (req, res) => {
    res.json({ home: "200202" });
});

app.post("/api/signup", (req, res) => {
    User.findOne({ username: req.body.username })
        .then((data) => {
            if (data) res.json({ message: "User already exist" });
            else {
                let userinfo = {
                    name: req.body.name,
                    username: req.body.username,
                    mobile: req.body.mobile,
                    password: req.body.password,
                };
                let user = new User(userinfo);
                user
                    .save()
                    .then((data) => {
                        res.send({ token: generateJWT(data), user: data });
                        res.redirect("/");
                    })
                    .catch((e) => {
                        if (e) throw e;
                        res.send({ message: "error at saving" });
                    });
            }
        })
        .catch((e) => {
            if (e) res.json({ message: "something went wrong" });
        });
});

app.post("/api/login", (req, res) => {
    let { username, password } = req.body;
    User.findOne({ username })
        .then((user) => {
            if (user) {
                if (user.password === password) {
                    res.send({ token: generateJWT(user), user });
                } else res.send({ message: "incorrect password" });
            } else res.send({ message: "User Does not Exists!" });
        })
        .catch((e) => {
            res.send({ message: "Something went wrong" });
        });
});

//! the route below is not yet made to work it s just hacky way to show spacemeter movement
app.get("/api/availability", (req, res) => {
    res.send({
        twowheels: Math.floor(Math.random() * 200),
        fourwheels: Math.floor(Math.random() * 150),
    });
});

app.listen(port, () => console.log(`Example app listening on port port!`));