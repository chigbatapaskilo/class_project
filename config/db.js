//settingup my database connection

const mongoose=require('mongoose');
require('dotenv').config();
const url=process.env.DATABASE_URL;
mongoose.connect(url)
.then(()=>{
    console.log('connection to database successful');
    
}).catch((error)=>{
    console.log('unable to connect to database because'+error.message)
})