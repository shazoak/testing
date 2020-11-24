const mongoose = require('mongoose');

const RtokenSchema = mongoose.Schema({
    User_ID:{
        type:String,
        required:true,
        unique:true
    },
    User_Rtoken:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('rtoken',RtokenSchema);