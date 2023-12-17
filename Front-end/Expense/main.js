
const addData = document.getElementById("btn");
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function main(){
    try{
        const token = localStorage.getItem("token");
        // let response = await axios.get("http://localhost:3002/checkpremium",{headers: {"Authorization": token}})
        // if(response.data.user.ispremiumuser != null)
        // {
        //     let li = document.createElement("h2")
        //    li.textContent ="You are a premium user";
        //    document.getElementById("btn11").replaceWith(li)
        // }
        const decodeToken = parseJwt(token);
        ispremiumuser = decodeToken.ispremiumuser;
        if(ispremiumuser)
        {
            let li = document.createElement("h2")
            li.textContent ="You are a premium user";
            document.getElementById("btn11").replaceWith(li)
            showLeaderBoard()
        }
        let res = await axios.get("http://localhost:3002/getexpenses",{headers: {"Authorization": token}})
        for(let i =0;i<res.data.expences.length;i++)
        {
            AddUsertoScreen(res.data.expences[i]);
        }
        
    }
    catch(err)
    {
        console.log(err);
    }
}
main();
let button = document.getElementById("btn");
button.addEventListener("click",()=>{
    AddExpence(event);
})

function AddExpence(event)
{
    event.preventDefault();
    let expenseamount = document.getElementById("amount").value;
    let description = document.getElementById("Description").value;
    let category =document.getElementById("Category").value;

    let obj={
        expenseamount,
        category,
        description,
        
    }

    AddToLocalStorage(obj);
}
async function AddToLocalStorage(obj)
{
    try{
        console.log(obj)
        const token = localStorage.getItem("token");
        let res = await axios.post("http://localhost:3002/addexpense",obj,{headers: {"Authorization": token}})
        console.log(res);
        AddUsertoScreen(res.data.expence);
    }
    catch(err){
        console.log(err);
    }
}
const expenseDatadiv = document.getElementById("expense-data");

function createTable() {
    const CreateexpenseTable = document.createElement("table");
    CreateexpenseTable.className = "my-expenses";
    CreateexpenseTable.innerHTML=
      "<tr class='table-header' ><th>Category</th><th>Description</th><th>Amount</th></tr>";
      console.log(CreateexpenseTable)
    document.getElementById("expense-data").appendChild(CreateexpenseTable)
}
createTable()

function AddUsertoScreen(obj)
{
        const expenseTable = document.querySelector(".my-expenses");
        const row = expenseTable.insertRow();
        row.className = "table-row";
        row.insertAdjacentHTML(
          "beforeend",
          `<td class='expense-name' >${obj.category}</td><td class='expense-date' >${obj.description}</td><td class='expense-Amount'>${obj.expenseamount}</td> <td style="display:none;">${obj.id}</tb> `
        );
        const deletebtn = document.createElement("button");
        deletebtn.appendChild(document.createTextNode("X"))
        deletebtn.className="delete-expense"
        row.appendChild(deletebtn);
        row.hidden.textContent = obj.id;
        console.log(row.textContent)

        deletebtn.onclick= async()=>{
            console.log(obj.id)
            const token = localStorage.getItem("token");
            await axios.delete("http://localhost:3002/deleteexpense/"+obj.id,{headers: {"Authorization": token}})
        }

}
expenseDatadiv.addEventListener("click", async(e) => {
    if (e.target.className === "delete-expense") {
      e.composedPath().forEach((ele) => {
        if (ele.className != "table-row") {
        } else {
          ele.style.display = "none";
        }
      });
    }
  });
document.getElementById("btn11").onclick = async(e)=>{
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3002/purchase/premiummembership",{headers: {"Authorization": token}})
    var options ={
        "key":res.data.key_id,
        "order_id":res.data.order.id,
        "handler": async function(res)
        {
            const response = await axios.post("http://localhost:3002/purchase/updatetransactionstatus",{
                order_id: options.order_id,
                payment_id: res.razorpay_payment_id,

            },{headers:{"Authorization":token}})
           alert("YOu are a Premium User Now")
           let li = document.createElement("h2")
           li.textContent ="You are a premium user";
           document.getElementById("btn11").replaceWith(li)
           showLeaderBoard()
           localStorage.setItem('token',response.data.token)
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',function(response)
    {
        console.log(response);
        alert("something went wrong")
    })
}

function showLeaderBoard()
{
        const LBbtn = document.createElement('input');
        LBbtn.type = 'button';
        LBbtn.value = "ShowLeaderBoard";
        LBbtn.className="btn btn-warning"
        LBbtn.style.float= "left"
        
        LBbtn.onclick = async()=>{
            const token = localStorage.getItem("token");
            const userLeaderBoard = await axios.get("http://localhost:3002/showLeaderBoard")
            console.log(userLeaderBoard);

            createTb()

            var LeaderBoardele = document.getElementById('leaderboard');
            userLeaderBoard.data.forEach((element,i)=> {
                const expenseTable = document.querySelector(".my-leaderboard");
                const row = expenseTable.insertRow();
                row.className = "table-row";
                row.insertAdjacentHTML(
                  "beforeend",
                  `<td class='expense-name' >${i+1}</td><td class='expense-date' >${element.username}</td><td class='expense-Amount'>${element.totalExpense}</td>`
                );

            });

        }
        document.getElementById("childd").appendChild(LBbtn)
        function createTb() {
            const CreateexpenseTable = document.createElement("table");
            CreateexpenseTable.className = "my-leaderboard";
            CreateexpenseTable.innerHTML=
              "<tr class='table-header' ><th>Rank</th><th>Name</th><th>Total Expenses</th></tr>";
              console.log(CreateexpenseTable)
            LBbtn.after(CreateexpenseTable)
        }
}