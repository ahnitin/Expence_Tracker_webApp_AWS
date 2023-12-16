const User = require("../models/user");
const ForgetPassword = require("../models/forgotpassword");
const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt")
const Forgotpassword = require("../models/forgotpassword");
const { where } = require("sequelize");
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = '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';


exports.ForgetPassword = async (req, res, next) => {
    const email = req.body.email;
    console.log(email);

    const user = await User.findOne({ where: { email: email } });

    if (user) {

        const id = uuid.v4();
        user.createForgotpassword({id, active:true})
        .then((response)=>{
            //console.log(response)
        })
        .catch(err=>{
            console.log(err);
        })

        const apiInstance = new Sib.TransactionalEmailsApi();
        
        // const sender = {
        //     email: "nitinahuja240@gmail.com",
        // };
        // const receivers = [
        //     {
        //         email: req.body.email,
        //     },
        // ];
        console.log("working")
        try {
            const sendEmail = await apiInstance.sendTransacEmail({
                sender : {"email": "nitinahuja240@gmail.com"},
                to: [{"email": req.body.email}],
                subject: "Reset Your Expense Tracker Password",
                textContent:"Expense Tracker will help to cover your day-to-day expenses.",
                htmlContent: `<a href="http://localhost:3002/password/resetpassword/${id}">Reset password</a>`,
            })
        } catch (error) {
            console.log(error)
        }

    }
};

exports.resetPassword = async(req,res,next)=>{
    try {
        const id  = req.params.id;
        console.log(id);
        let forgotpasswordrequest = ForgetPassword.findOne({where:{id}})
        if(forgotpasswordrequest)
        {
            console.log(forgotpasswordrequest.active,"here is active")
            Forgotpassword.update({active:false},{where:{id}});
            res.status(200).send(`  <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="post">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required>
                                        <input name='resetpasswordid' type='hidden' value='${id}'>
                                        <button>reset password</button>
                                    </form>`
                                )
        res.end();

        }
        
    } catch (error) {
        console.log(error);
    }
    
}

exports.updatePassword = async(req,res,next)=>{

    try {
        const newpassword = req.body.newpassword;
        const resetpasswordid =  req.body.resetpasswordid;
        console.log(newpassword,resetpasswordid);

        let resetpasswordrequest = await Forgotpassword.findByPk(resetpasswordid);
        let user = User.findOne({where:{id:resetpasswordrequest.userId}})
        if(user)
        {
            const saltrounds = 10;
            bcrypt.genSalt(saltrounds,(err,salt)=>{
                if(err)
                {
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword,salt,(err,hash)=>{
                    if(err)
                    {
                        console.log(err);
                        throw new Error(err)
                    }
                    User.update({password:hash},{where:{id:resetpasswordrequest.userId}}).then(()=>{
                        //res.sendStatus(201).json({message:'Successful Update new Password'})
                    })
                })
            })
        }
        else{
            res.send(404).json({error:"No user Exists",success:false})
        }

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error, success: false } )
    }
}

