const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String, unique: true },
    mobile: { type: String },
    password: { type: String },
});

let VehicleSchema = new mongoose.Schema({
    vehicleno: { type: String, unique: true },
    vehicletype: { type: String },
});

module.exports = { UserSchema, VehicleSchema };