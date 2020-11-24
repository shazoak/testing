const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const Rtoken = require('../modals/Rtoken');

const GenCode = require('../modals/GenCode');

// @route      POST api/auth/code
// @ desc      Auth user & get token via email
// @access     Public

router.post('/', async (req,res)=>{

    const {id , code } = req.body;

    if(!id || !code){
        return res.status(400).json({msg:'Please Enter All Fields'});
    }
    console.log(id,code);

    GenCode.findById(id)
        .then(gc =>{
            // console.log(gc);
            if(!gc){
                return res.status(400).json({msg:'Code Does Not Exists , active send another sms'})
            }
            else{
                
                console.log(gc.code);
                const phone = gc.phone;

                if(gc.code == code){

                    return res.status(200).json({msg:'Valid AuthCode'})
                    // const access_token =jwt.sign(user , config.get('jwtSecret') , {expiresIn: '18s'} )
                    // const refreshToken = jwt.sign(user , config.get('refreshSecret'))

                    // const newRtoken = new Rtoken({
                    //     phone , refreshToken
                    // })
                    // const rtoken = newRtoken.save();
                    // res.json({token:{access_token : access_token , refreshToken:refreshToken},user:{phone:gc.phone}})




                    // jwt.sign(
                    //     { phone:gc.phone },
                    //     config.get('jwtSecret'),
                    //     {expiresIn : 20},
                    //     (err,token)=>{
                    //         if(err){throw err}
                    //
                    //         res.json({
                    //             token,
                    //             user:{
                    //                 phone:gc.phone,
                    //                 // name:user.name,
                    //                 // email:user.email,
                    //             }
                    //         })
                    //
                    //     }
                    // );
                    // create a jwt and send by payload
                }
                else{
                    return res.status(400).json({msg:'sent Code is not match with generated code'})
                }
            }

            // bcrypt.compare(password,user.password)
            //     .then(isMatch =>{
            //         if(!isMatch){
            //             return res.status(400).json({msg:'Invalid Credentials'})
            //         }

            //     jwt.sign(
            //         { id:user.id },
            //         config.get('jwtSecret'),
            //         {expiresIn : 3600},
            //         (err,token)=>{
            //             if(err){throw err}
            //
            //             res.json({
            //                 token,
            //                 user:{
            //                     id:user.id,
            //                     name:user.name,
            //                     email:user.email,
            //
            //                 }
            //             })
            //
            //         }
            //     );
            // })
        })

});




module.exports = router;