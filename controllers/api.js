const { Documents,Administrator,Student,Faculty }= require('../models/documents');


exports.getDocument = async(req,res,next)=>{
    try{
        
        const documents = await Documents.findAll();
        
        return res.status(200).json({
            success:true,
            count:documents.length,
            data:documents

        });
    }
    catch(err){
      return res.status(500).json({
          success:false,
          error:`${err.stack}`
      });

    }    
}
//add product
exports.addDocument = async(req,res,next)=>{
    try{
        const { type,body,code } = req.body;

        const document = await Documents.create({
            doc_type:type,
            document_body:body,
            code:code
        });
        return res.status(201).json({
            success:true,
            data:document
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:`${err.stack}`

        });
    }

}
//delete product
exports.DeleteDocument = async(req,res,next)=>{
    try{
        const del_document =  await Documents.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!del_document){
            return res.status(404).json({
                success:false,
                error:'No product found with that id'
    
            });
        }
        else{
           await del_document.destroy();
           return res.status(200).json({
               success: true,
               data:{}
           });
        }

    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:`${err.stack}`

        });
    }
}
//editting product
exports.editDocument = async (req,res,next)=>{
    try{

        const { type,body,code } = req.body;
        const edit_doc =  await Documents.findOne({
            where:{
                id: req.params.id
            }
        });
        if(edit_doc){
            
           newdocument = await edit_doc.set({
            doc_type:type,
            document_body:body,
            code:code

           });
           newdocument.save()
            return res.status(200).json({
                success: true,
                data: newdocument.save()
            });
           
        }
        else{
            return res.status(404).json({
                success:false,
                error:'editing failed'
    
            });
        }

    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:`${err.stack}`

        });
    }
}
//ger single document
exports.getSingleDocument = async (req,res,next)=>{
    try{
        
        const document = await Documents.findOne({
            where:{
                id:req.params.id
            }
        });
        
        return res.status(200).json({
            success:true,
            count:document.length,
            data:document

        });
    }
    catch(err){
      return res.status(500).json({
          success:false,
          error:`${err}`
      });

    }  
}

//forward document
exports.forwarddoc = async (req, res, next)=>{

    try{
        const forward_stat = true;

        let reciev_doc =[];
        const forwarded_doc = await Documents.findOne({
            where:{
                id:req.params.id,
                forwarded:forward_stat
            }  
        });
        if(!forwarded_doc){
    
            const newdd_forwarded = await Documents.update({
                
            });
            reciev_doc.push(newdd_forwarded);
            return res.status(200).json({
                success:true,
                data:reciev_llv
            })
        }
        else{
            return res.json({
                success:false,
                error:'Action already taken'
            });
        }
    }
    catch(err){
        next(err);
    }
}
//add administrator

exports.addAdministrator = async (req,res,next) =>{
    //const { type,body,code } = req.body;
    try{
        
        const admin = await Administrator.create({
            fname:'okullo',
            lname:'gilbert',
            contact: '0777882766',
            email:'okullo@gmail.com',
            gender:'male',
           admin_role: 'hod'
        });
        return res.status(201).json({
            success:true,
            data:admin
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:`${err}`

        });
    }
}

//get all admin


exports.getAdmin = async(req,res,next)=>{
    try{
        
        const admins = await Administrator.findAll();
        
        return res.status(200).json({
            success:true,
            count:admins.length,
            data:admins

        });
    }
    catch(err){
      return res.status(500).json({
          success:false,
          error:`${err.stack}`
      });

    }    
}

//delete product
exports.DeleteAdmin = async(req,res,next)=>{
    try{
        const del_admin =  await Administrator.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!del_admin){
            return res.status(404).json({
                success:false,
                error:'admin not found'
    
            });
        }
        else{
           await del_admin.destroy();
           return res.status(200).json({
               success: true,
               data:{}
           });
        }

    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:`${err.stack}`
        });
    }
}

//admin details
exports.getAdminDetail = async (req,res,next)=>{
    try{
        const admin = await Administrator.findOne({
            where:{
                id:req.params.id
            }
        });
        return res.status(200).json({
            success:true,
            count:admin.length,
            data:admin
        });
    }
    catch(err){
      return res.status(500).json({
          success:false,
          error:`${err}`
      });
    }  
}
