const Expense = require("../models/expence");
const User = require("../models/user");
const sequelize = require("../connection/database");
const AWS = require("aws-sdk");

exports.addExpense = async (req,res)=>{
    const t  = await sequelize.transaction();
    try{
        const expenseamount = req.body.expenseamount;
        const description = req.body.description;
        const category = req.body.category;
        const userId = req.user.id
        let TotalExpense = req.user.totalExpense;
        if(TotalExpense ===  null)
        {
            TotalExpense=0;
        }
        TotalExpense = Number.parseInt(TotalExpense)
        let Expenseamount = Number.parseInt(expenseamount)
        if(expenseamount == undefined){
            return res.status(400).json({success: false, message: 'Parameters missing'})
        }
        TotalExpense = TotalExpense + Expenseamount;
        const expence = await Expense.create({
            expenseamount:expenseamount,
            category:category,
            description:description,
            userId: userId,
        },{transaction:t})
        
        await User.update({ totalExpense: TotalExpense}, {
            where: {
              id:userId,
            },
            transaction:t
          });
        
        await t.commit();
        return res.status(201).json({expence:expence,success:true});
    }
    catch(error){
        await t.rollback();
        return res.status(500).json({success:false,error:error})
    }
}
exports.getExpenses = async(req,res)=>{
    try {
        const expenses = await Expense.findAll({where:{userId: req.user.id}})
        //const expenses = await Expense.findAll()
        return res.status(200).json({expences:expenses,success:true});
    } catch (error) {
        return res.status(200).json({error:error,success:false})
    }
}

exports.deleteExpense = async (req,res)=>{
    const t = await sequelize.transaction();
    try {
        const expenseid = req.params.expenseid;
        let TotalExpense = req.user.totalExpense;
        let userId = req.user.id;

        if(expenseid == undefined || expenseid.length === 0){
            return res.status(400).json({success: false, })
        }
        let upexpense = await Expense.findByPk(expenseid);
        let Expenseamount = upexpense.expenseamount;
        TotalExpense = Number.parseInt(TotalExpense);
        Expenseamount = Number.parseInt(Expenseamount);
        TotalExpense = TotalExpense - Expenseamount;
        await User.update({ totalExpense: TotalExpense}, {
            where: {
              id:userId
            },
            transaction:t
          });

        await Expense.destroy({where:{id:expenseid,userId:req.user.id}},{transaction:t})
        //await Expense.destroy({where:{id:expenseid}})
        await t.commit();
        return res.status(200).json({success:true,message:"Deleted Successfully"})
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ success: true, message: "Failed"})
    }
}

// exports.checkPremium = async (req,res)=>{
//     try {
//         const user = await User.findOne({where:{id: req.user.id}})
//         //const expenses = await Expense.findAll()
//         return res.status(200).json({user:user,success:true});
//     } catch (error) {
//         return res.status(200).json({error:error,success:false})
//     }
// }
function uploadToS3(stringifyExpense,filename)
{
    const BUCKET_NAME = 'expensetracker240';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        Bucket:BUCKET_NAME,
    })

    s3bucket.createBucket(()=>{
        var params ={
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: stringifyExpense,

            
        }
        s3bucket.upload(params,(err,data)=>{
            if(err)
            {
                console.log("something went wrong")
            }
            else{
                console.log("Success",data);
            }
        })
    })
}

exports.downloadExpense = async(req,res,next)=>{
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringifyExpense = JSON.stringify(expenses);
    const filename  = "expense.txt";
    const fileUrl = uploadToS3(stringifyExpense,filename);
    res.status(200).json({fileUrl,success:true});
}
