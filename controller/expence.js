const Expense = require("../models/expence");
const User = require("../models/user");
const DownloadFiles = require("../models/downloadFiles");
const sequelize = require("../connection/database");
const AWS = require("aws-sdk");
const UserServices = require("../services/userservices");
const S3Services = require("../services/S3services");
var item_perPage =4;


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
        let page  = req.query.page || 1;
        let item_perPage = Number.parseInt(req.query.item) || 4
        let totalItems;
        let total = await Expense.count();
        totalItems = total;
        const expenses = await Expense.findAll({
            where:{userId: req.user.id},
            offset: (page - 1) * item_perPage,
            limit: item_perPage,
        })
        //const expenses = await Expense.findAll()
        return res.status(200).json({
            expences:expenses,
            success:true,
            currentPage :page,
            hasNextPage:(item_perPage*page)< totalItems,
            nextPage:page+1,
            hasPreviousPage:page >1,
            PreviousPage:page-1,
            lastPage: Math.ceil(totalItems/item_perPage),
        });
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


exports.downloadExpense = async(req,res,next)=>{
    try {
        const expenses = await UserServices.getExpenses(req);
        const userId = req.user.id
        const stringifyExpense = JSON.stringify(expenses);
        console.log(stringifyExpense)
        const filename  = `expense${userId}/${new Date()}.txt`;
        let fileUrl = await S3Services.uploadToS3(stringifyExpense,filename)
        const date = new Date().toLocaleDateString();
        console.log(date);
        await DownloadFiles.create({
            url:fileUrl,
            Date:date,
            userId:req.user.id,
        }) 
        console.log(fileUrl,"data")
        res.status(200).json({fileUrl,success:true});
    } catch (error) {
        console.log(error)
        res.status(500).json({fileUrl:"",success:false,error:error});
    }

}

exports.downloadFiles = async(req,res)=>{
    const id = req.user.id;
    try {
        let download = await DownloadFiles.findAll({where:{userId:id}})
        res.status(201).json({dwd:download,success:true})
    } catch (error) {
        res.status(500).json({dwd:"",success:false});
    }
}
