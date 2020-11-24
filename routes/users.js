const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../modals/Users');


//@route      POST api/users
//@ desc      REGISTER a user
//@access     PUBLIC

router.post('/', (req,res)=>{

    const {User_Name , User_LastName , User_Gender ,User_Country , User_Province , User_City , User_PhoneNum,User_EmailAddress ,User_Password ,  } = req.body;

    if(!User_Name || !User_LastName || !User_Password || !User_PhoneNum){
        return res.status(400).json({msg:'Please Enter All Fields'});
    }

    User.findOne({User_PhoneNum})
        .then(user =>{
            if(user){
                return res.status(400).json({msg:'User Already Exists'})
            }
            const newUser = new User({User_Name , User_LastName , User_Gender ,User_Country , User_Province , User_City , User_PhoneNum,User_EmailAddress ,User_Password });

            newUser.save().then(user =>{
                res.json({
                    user:{
                        id:user.id,
                        name:user.User_Name,
                        phone:user.User_PhoneNum,

                    }
                })
            });

            // bcrypt.genSalt(10,(err,salt) => {
            //     bcrypt.hash(newUser.User_password,salt,(err,hash) =>{
            //         // if(err){
            //         //     throw err;
            //         // }
            //         newUser.User_password = hash;
            //         newUser.save()
            //             .then(user =>{
            //                 jwt.sign(
            //                     { id:user.id },
            //                     config.get('jwtSecret'),
            //                     {expiresIn : 3600},
            //                     (err,token)=>{
            //                         if(err){throw err}
            //
            //                         res.json({
            //                             token,
            //                             user:{
            //                                 id:user.id,
            //                                 name:user.User_Name,
            //                                 phone:user.User_PhoneNum,
            //
            //                             }
            //                         })
            //
            //                     }
            //                 );
            //             })
            //     })
            // })
        });
}

);


//@route      Get api/users
//@ desc      Get all users
//@access     PUBLIC

router.get('/', async (req,res)=>{

    try{
        const users = await User.find().sort({date:-1});
        res.json(users);

    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }

    }

);



module.exports = router;