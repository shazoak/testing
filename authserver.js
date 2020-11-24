const express = require('express');
const connectDB = require('./config/db');
const Users = require('./modals/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const Rtoken = require('./modals/Rtoken');

const app = express();

app.use(express.json({extended:false}));


//connect Database

connectDB();

// let refreshTokens =[];



app.delete('/logout' , async(req,res) =>{
    
    const {User_ID} = req.body;

    try {
        await Rtoken.deleteOne({User_ID});
        return res.sendStatus(200).json({msg:'All Refresh Tokens Are now Deleted'})
    
    } catch (e) {

        console.error(e.message);
        res.status(500).send('Server Error');
        
    }



    // refreshTokens = refreshTokens.filter(token =>token !== req.body.token)
    // res.sendStatus(204)
})


app.post('/token',(req,res)=>{


    const refreshToken = req.body.token
    if(refreshToken == null) {
        return res.sendStatus(401)
    }
    Rtoken.findOne({User_Rtoken:refreshToken}).then(R =>{
        
        if(!R){
            return res.sendStatus(403).json({msg:'No Refresh Token Founded'})
        }else{

            jwt.verify(refreshToken , config.get('refreshSecret') , (err,user)=>{
                if(err)return res.sendStatus(403)
                const accessToken = generateAccessToken({id:user.id})
                res.json({accessToken:accessToken})
            })

        }
    })
    // if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    // jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET , (err,user)=>{
    //     if(err)return res.sendStatus(403)
    //     const accessToken = generateAccessToken({name:user.name})
    //     res.json({accessToken:accessToken})
    // })
})

//Init Middleware
// app.use(express.json({extended:false}));

app.post('/login',(req,res)=>{

    console.log(req.body);

    const {PhoneNum , Password} = req.body;

    Users.findOne({User_PhoneNum:PhoneNum}).then(async (user) =>{
        console.log(user);
        if(!user){
            return res.status(400).json({msg:'user Does not Exist'});
        }
        else{
            if(user.User_Password === Password){

                const access_token = jwt.sign({id:user._id} , config.get('jwtSecret') , {expiresIn: '18s'});
                const refreshToken = jwt.sign({id:user._id} , config.get('refreshSecret'));

                const newRtoken = new Rtoken({
                    User_ID:user._id , User_Rtoken:refreshToken
                });

                const rtoken = await newRtoken.save();
                res.json({token:{access_token : access_token , refreshToken:refreshToken},user:{id:user._id}});

            }
            else{
                return res.status(400).json({msg:'Entered Passwords Are not equal'});
            }
        }
    })

//    authenticate user

    // // const username = req.body.username;
    // const user = {id:username}
    // const access_token = generateAccessToken(user)
    // const refreshToken = jwt.sign(user , config.get('refreshSecret'))
    // refreshTokens.push(refreshToken)
    // res.json({access_token : access_token , refreshToken:refreshToken})
});


app.post('/register',async(req , res)=>{

    //register a user

    console.log(req.body);
    const {PhoneNum , Password1 , Password2} = req.body;

    if(Password1 === Password2){


        try {
            
            const newUser = new Users({
                User_PhoneNum :PhoneNum,
                User_Password:Password2,
            });

            const user = await newUser.save();

            if(user){

                const access_token = jwt.sign({id:user._id} , config.get('jwtSecret') , {expiresIn: '18s'});
                const refreshToken = jwt.sign({id:user._id} , config.get('refreshSecret'));

                const newRtoken = new Rtoken({
                    User_ID:user._id , User_Rtoken:refreshToken
                });

                const rtoken = await newRtoken.save();
                res.json({token:{access_token : access_token , refreshToken:refreshToken},user:{id:user._id}});

            }else{
                return res.status(400).json({msg:'try to save user again'});
            }


            // res.json(user._id);



        } catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');
        }
        

    }
    else{

        return res.status(400).json({msg:'password are not equal'})

    }

});





const PORT =  4321 ;

app.listen(PORT , ()=>{
    console.log(`authserver started on port ${PORT}`)
});

function generateAccessToken (user){
    return jwt.sign(user , config.get('jwtSecret') , {expiresIn: '18s'} )
}