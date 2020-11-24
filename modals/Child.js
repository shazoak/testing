const mongoose = require('mongoose');

const ChildSchema = mongoose.Schema({
    Parent_Id:{
        type:String,
        required:true
    },
    Devices:{
        type:String,
        required:true
    },
    Contacts:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('child',ChildSchema);