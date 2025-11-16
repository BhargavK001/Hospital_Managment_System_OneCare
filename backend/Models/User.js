const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role :{
        type : String,
        enum :["admin","user","doctor"],
        default:"user",
    },
});

const UserModel = mongoose.model("user",UserSchema)
module.exports = UserModel