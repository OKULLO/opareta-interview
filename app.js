const express = require('express')
const morgan  = require('morgan');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cors = require('cors');


dotenv.config({path:'./config/.env'});

const proxy = require('./routes/proxy');

const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({extended: false}));
app.set('trust proxy', 1)

app.use(morgan('common'));
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));

const PORT = process.env.PORT || 3377;


app.use('/proxy',proxy);


//return original url where error occured
app.use((req,res,next)=>{
   const error = new Error(`Not Found-${req.originalUrl}`);
   res.status(404);
    next(error);
});


//error handler middleware
app.use((error,req,res,next)=>{
        const statusCode = res.statusCode===200 ?500:res.statusCode;
    
        res.status(statusCode);
        res.json({
            message:error.message,
            stack:process.env.NODE_ENV==='production'? '***':error.stack
        })
    
    });
     

app.listen(PORT,(req, res)=>{
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});