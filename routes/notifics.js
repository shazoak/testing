const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../middleware/auth');

const Notifics = require('../modals/Notifics');


//@route      GET api/notifics
//@ desc      Get all users notifics
//@access     PRIVATE

router.get('/',async (req,res) =>{
    /*

        const sandwichP = sandwich;
        const drinksP = drinks;
        let [sandwich, drink] = await promiseAll([sandwichP,drinkP])
        res.json({drinksP, sandwichP})
     */
    try{
        const notifics = await Notifics.find().sort({date:-1});
        res.json(notifics);

    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

//@route      POST api/devices
//@ desc      Add new device
//@access     PRIVATE

router.post('/',[auth,[
    check('from','from is required').not().isEmpty()
]], async (req,res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {kind,from,to,date,msg} = req.body;


    try {
        const newNotifics = new Notifics({
            kind , from , to , date , msg
        });

        const notifics = await newNotifics.save();
        res.json(notifics);

    }
    catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');

    }
});



//@route      PUT api/notifics/:id
//@ desc      update notifics
//@access     PRIVATE

router.get('/',[
    check('from','from is required').not().isEmpty()
],async (req,res) =>{
    try {
        await Notifics.findByIdAndUpdate(req.params.id, req.body);
        await Notifics.save();
        res.send(Notifics)
    } catch (err) {
        res.status(500).send(err)
    }
});


//@route      DELETE api/notifics/:id
//@ desc      DELETE notifics
//@access     PRIVATE

router.delete('/:id',auth,async (req,res) =>{

    try {
        const notifics = await Notifics.findByIdAndDelete(req.params.id);

        if (!notifics) res.status(404).send("No order found");
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err)
    }


});




module.exports = router;