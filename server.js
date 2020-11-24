const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect Database

connectDB();

//Init Middleware
app.use(express.json({extended:false}));

// app.get('/' , (req,res) =>{
//     res.json({msg : 'hi there '})
// });

//Define Routes
app.use('/api/users',require('./routes/users'));
// app.use('/api/orders',require('./routes/orders'));
app.use('/api/auth',require('./routes/auth'));
// app.use('/api/tables',require('./routes/tables'));

app.use('/api/devices',require('./routes/devices'));
app.use('/api/notifics',require('./routes/notifics'));
app.use('/api/ghosts',require('./routes/ghosts'));

app.use('/api/auth/phone',require('./routes/auth'));
// app.use('/api/auth/email',require('./routes/auth'));
app.use('/api/auth/code',require('./routes/auth-code'));

app.use('/api/gencode',require('./routes/gen-code'));




const PORT = process.env.PORT || 8800 ;

app.listen(PORT , ()=>{
    console.log(`server started on port ${PORT}`)
});

