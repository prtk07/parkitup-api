require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { UserSchema, VehicleSchema } = require("./Schema.js");
const { generateJWT, getUser } = require("./utils.js");
const { jwt } = require("jsonwebtoken");

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

app.get("/api/getuser", (req, res) => {
    let auth = req.headers.authorization;
    auth = auth.replace("Bearer ", "");
    let username = getUser(auth);
    User.findOne({ username })
        .then((data) => {
            if (data) {
                let { name, username, mobile } = data;
                res.send({ name, username, mobile });
            } else res.send({ message: "User Not Found!!!" });
        })
        .catch((e) => {
            if (e) res.send({ message: "Something not right!" });
        });
});

app.post("/api/addvehicles", (req, res) => {
    let token = req.headers.authorization;
    let { vehiclenumber, type } = req.body;
    let user = getUser(token);
    Vehicle.findOne({ vehicleno: vehiclenumber })
        .then((data) => {
            if (!data) {
                let newVehicle = new Vehicle({
                    vehicleno: vehiclenumber,
                    vehicletype: type,
                    owner: user,
                });
                newVehicle
                    .save()
                    .then((data) => {
                        res.send(data);
                    })
                    .catch((e) => {
                        res.send({ message: "something went wrong" });
                    });
            } else res.send({ message: "Vehicle already exist" });
        })
        .catch((e) => {
            console.log(e);
            res.send({ message: "Vehicle already exist" });
        });
});

app.get("/api/getvehicles", (req, res) => {
    const token = req.headers.authorization;
    let user = getUser(token);
    Vehicle.find({ owner: user })
        .then((data) => {
            if (data.length > 0) {
                res.send({ vehicles: data });
            } else res.send({ message: "no vehicles for the user added" });
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