const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User }= require('../models/documents');

//create new user
exports.createUser =  (req,res, next)=>{
  

    const {
      Uname,
      email,
      pass
        } = req.body;
    
     User.findOne({
           where:{
             email: email
           }
    })
    .then(user=>{
      if(!user){
        bcrypt.hash(pass,10,(err,hash)=>{
         
         User.create({
           username:Uname,
           email:email,
           password:hash

         })
          .then(user=>{   
                  res.status(201).json({
                  success:true,
                  data:user,

              });
             })
             .catch(err=>{
               res.send(`${err}`)
             })
       });

    }
    else{
      return res.status(404).json({
        success:false,
        error: 'user exist already'

      });
    }         
})
.catch(err=>{
  return res.status(500).json({
    success:false,
    error:`${err}`

});

})
}

//login user
exports.loginUser = (req, res,next)=>{
   const { email,pass } = req.body;
   
        User.findOne({
          where:{
            email: email
          }
          })
          .then(user=>{
            if(!user){
              return res.json({
                success:false,
                error:'user does not exist'
    
              });
              }
              else{
              
                if(bcrypt.compareSync(pass, user.password)){
                  let token = jwt.sign(user.dataValues, process.env.SECRET_KEY,{
                    expiresIn:1440
                  });
                  res.status(200).json({
                    success:true,
                    token:token
                  });
                }
              }

          })
          .catch(err=>{
            return res.status(500).json({
              success:false,
              error:`${err.stack}`
            })
          })
          
 
}

exports.passwordReset = async (res,req,next)=>{
  res.send('reset password');
}

