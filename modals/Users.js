const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    User_Name:{
        type:String,
        // required:true
    },
    User_LastName:{
        type:String,
        // required:true
    },
    User_Gender:{
        type:String,
        // required:true
    },
    User_Country:{
        type:String,
        // required:true
    },
    User_Province:{
        type:String,
        // required:true
    },
    User_City:{
        type:String,
        // required:true
    },
    User_PhoneNum:{
        type:String,
        required:true,
        unique:true
    },

    User_EmailAddress:{
        type:String,
        // required:true,
        unique:true
    },
    User_Password:{
        type:String,
        required:true
    },
    User_Date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('user',UserSchema);