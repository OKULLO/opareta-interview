const { StaffLeave } = require('../models/documents');
const { random_id} =require('./functions');



exports.getLeaves = async (req,res,next)=>{
    try{

    const { type,postdate,
        llv_desc,status,
        code,
        return_date } = req.body;

    const leaves = await StaffLeave.create(req.body);
    return res.status(201).json({
        success:true,
        data:leaves
    })

    }catch(err){
        next(err);
    }

}

//create leave
exports.Createleave = async(req,res,next)=>{
    try{
        const { type,body,pp_date,return_date } = req.body;
        const uuid =  new random_id();
       
        const leave = await StaffLeave.create({
            leave_type:type,
            leave_description:body,
            leave_code: uuid,
            post_date:pp_date,
            return_date:return_date
        });
        return res.status(201).json({
            success:true,
            data:leave
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:`${err.stack}`

        });
    }

}
//forward llv
exports.forwardLeave = async (req, res, next)=>{

    try{
        const forward_stat = true;

        let reciev_llv =[];
        const forwardedllv = await StaffLeave.findOne({
            where:{
                id:req.params.id,
                forwarded:forward_stat
            }  
        });
        if(!forwardedllv){
    
            const newllv_forwarded = await StaffLeave.update({
                where:{
                    id:req.params.id,
                    forwarded: forward_stat
                }
            });
            reciev_llv.push(newllv_forwarded);
            return res.status(200).json({
                success:true,
                data:reciev_llv
            })
        }
        else{
            return res.json({
                success:false,
                error:'Leave has been forwarded already'
            });
        }
    }
    catch(err){
        next(err);
    }
}

//leaveaction
exports.llv_action = async (req, res, next)=>{

}