const mongoose = require('mongoose');

const GenCodeSchema = mongoose.Schema({
    code:{
        type:Number,
        required:true
    },
    initiated:{
        type:Date,
        default:Date.now(),
        expires:120
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    lang:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('genCode',GenCodeSchema);