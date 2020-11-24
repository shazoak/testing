const mongoose = require('mongoose');

const GhostsSchema = mongoose.Schema({
    ghost_admin:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'users'
    },
    ghost_PhoneNum:{
        type:String,
        required:true
    },
    ghost_EmailAddress:{
        type:String,
        required:true
    },
    ghost_Date:{
        type:Date,
        default:Date.now()
    },
    ghost_Status:{
        type:String,
        default:'deactive'
    }
});

module.exports = mongoose.model('ghosts',GhostsSchema);