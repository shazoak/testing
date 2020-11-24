const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../middleware/auth');

var Kavenegar = require('kavenegar');

var api = Kavenegar.KavenegarApi({apikey: '68394F4B473657645A6374467076615166365371524E5646593966747041394462467162754E553631394D3D'});

const GenCode = require('../modals/GenCode');

const ype = {
    en:"VIAQ Indoor Ait Quality Registration Code : \n",
    fa:"کد احراز هویت دستگاه هوشمند تشخیض کیفیت هوا درون ساختمان VIAQ: \n",
    ar:"وات عورو"
};


//@route      GET api/genCode
//@ desc      Get all users genCode
//@access     PRIVATE

router.get('/',async (req,res) =>{
    /*

        const sandwichP = sandwich;
        const drinksP = drinks;
        let [sandwich, drink] = await promiseAll([sandwichP,drinkP])
        res.json({drinksP, sandwichP})
     */
    try{
        const gencodes = await GenCode.find().sort({initiated:-1});
        res.json(gencodes);

    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

//@route      POST api/genCode
//@ desc      Add new genCode
//@access     PUBLIC

router.post('/',[
    check('phone','phone is required').not().isEmpty()
    // check('code','code is required').not().isEmpty()

], async (req,res) =>{

    // const errors = validationResult(req);
    // if (!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()});
    // }

    const {PhoneNum,Language} = req.body;

    // findone by phone num , if there is a one return the id ,
    GenCode.findOne({PhoneNum:PhoneNum}).then((genc) =>{
        if(genc){
            return res.status(200).json({msg:'User Already have a valid code',smsid:genc._id})
        }
    })

    // if not create a code insert it to db and return id


    const code = generate(6);

    console.log(code);

    let msg ='';

    if(Language == 'en'){
        let msg = ype.en
    }else if(Language == 'fa'){
        let msg = ype.fa
    }else if(Language == 'ar'){
        let msg = ype.ar
    }

    // let msg = "کد احراز هویت دستگاه هوشمند تشخیض کیفیت هوا درون ساختمان VIAQ: \n";
    msg = msg + codedasher(code.toString());

    console.log(msg);


    try {
        await api.Send({ message: msg, sender: "1000596446" , receptor: "09381355103" });
        const newGenCode = new GenCode({
            code:code , phone:PhoneNum , lang:Language
        });

        const genCode = await newGenCode.save();


        //send Code to phonenum via sms


        res.json(genCode._id);

    }
    catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');

    }
});



//@route      PUT api/notifics/:id
//@ desc      update notifics
//@access     PRIVATE

// router.get('/',[
//     check('from','from is required').not().isEmpty()
// ],async (req,res) =>{
//     try {
//         await Notifics.findByIdAndUpdate(req.params.id, req.body);
//         await Notifics.save();
//         res.send(Notifics)
//     } catch (err) {
//         res.status(500).send(err)
//     }
// });
//

//@route      DELETE api/notifics/:id
//@ desc      DELETE notifics
//@access     PUN

router.delete('/:id',auth,async (req,res) =>{

    try {
        const gencode = await GenCode.findByIdAndDelete(req.params.id);

        if (!gencode) res.status(404).send("No genCode found");
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err)
    }


});





function generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

    if ( n > max ) {
        return generate(max) + generate(n - max);
    }

    max        = Math.pow(10, n+add);
    var min    = max/10; // Math.pow(10, n) basically
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add);
}

function codedasher(code) {
    let dashedcode = '';
    for(var i =0 ; i< code.length ; i ++){
        dashedcode = dashedcode + code[i];
        if(i === 2){
            dashedcode = dashedcode+'-'
        }
    }
    return dashedcode;
}



module.exports = router;