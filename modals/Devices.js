const mongoose = require('mongoose');

const DevicesSchema = mongoose.Schema({
    Device_User:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'users'
    },
    Device_Name:{
        type:String,
        require8d:true
    },
    Device_Password:{
        type:String,
        require8d:true
    },
    Device_ClientId:{
        type:String,
        required:true
    },
    Device_Host:{
        type:String,
        required:true
    },
    Device_Port:{
        type:String,
        required:true
    },
    Device_Registered:{
        type:String,
        required:true
    },
    Device_Status:{
        type:String,
        required:true
    },
    Device_Date:{
        type:Date,
        default:Date.now
    },
    Device_LastCon:{
        type:String
    }
});

module.exports = mongoose.model('devices',DevicesSchema);