const mongoose = require('mongoose');

const NotificsSchema = mongoose.Schema({
    kind:{
        type:String,
        required:true
    },
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:Date.now
    },
    msg:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('notifics',NotificsSchema);