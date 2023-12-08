const Expense = require("../models/expence");
const User = require("../models/user");

exports.addExpense = async (req,res)=>{
    
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
        })
        
        await User.update({ totalExpense: TotalExpense}, {
            where: {
              id:userId
            }
          });
        
        
        return res.status(201).json({expence:expence,success:true});
    }
    catch(error){
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
            }
          });

        await Expense.destroy({where:{id:expenseid,userId:req.user.id}})
        //await Expense.destroy({where:{id:expenseid}})
        return res.status(200).json({success:true,message:"Deleted Successfully"})
    } catch (error) {
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
