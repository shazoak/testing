const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../middleware/auth');

const Device = require('../modals/Devices');


//@route      GET api/devices
//@ desc      Get all users devices
//@access     PRIVATE

router.get('/',async (req,res) =>{
    /*

        const sandwichP = sandwich;
        const drinksP = drinks;
        let [sandwich, drink] = await promiseAll([sandwichP,drinkP])
        res.json({drinksP, sandwichP})
     */
    try{
        const devices = await Device.find().sort({date:-1});
        res.json(devices);

    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

//@route      POST api/devices
//@ desc      Add new device
//@access     PRIVATE

router.post('/',[auth,[
    check('host','host is required').not().isEmpty()
]], async (req,res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {user,name,clientId,host,port,registered,status,date} = req.body;


    try {
        const newDevice = new Device({
            user,name,clientId,host,port,registered,status,date
        });

        const device = await newDevice.save();
        res.json(device);

    }
    catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');

    }
});



//@route      PUT api/devices/:id
//@ desc      update device
//@access     PRIVATE

router.get('/',[
    check('enrolment','Enrolment is required').not().isEmpty()
],async (req,res) =>{
    try {
        await Order.findByIdAndUpdate(req.params.id, req.body);
        await Order.save();
        res.send(order)
    } catch (err) {
        res.status(500).send(err)
    }
});


//@route      DELETE api/devices/:id
//@ desc      DELETE device
//@access     PRIVATE

router.delete('/:id',auth,async (req,res) =>{

    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) res.status(404).send("No order found");
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err)
    }


});




module.exports = router;