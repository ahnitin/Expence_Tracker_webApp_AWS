const addData = document.getElementById("btn");
let downloadbtn = document.createElement("button");
downloadbtn.className = "btn btn-outline-success";
downloadbtn.appendChild(document.createTextNode("Download"));
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

async function main() {
  try {
    const page = 1;
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
    if (ispremiumuser) {
      let li = document.createElement("h2");
      li.textContent = "You are a premium user";
      document.getElementById("btn11").replaceWith(li);
      showLeaderBoard();
      document.body.append(downloadbtn);
      let ul = document.createElement("ul");
      ul.textContent = "List of Downloaded Files";
      ul.id = "download";
      document.body.append(ul);
      DownloadFiles();
    }
    let res = await axios.get(
      `http://localhost:3002/getexpenses?page=${page}&item=${localStorage.getItem("item_perPage")}`,
      { headers: { Authorization: token } }
    );
    for (let i = 0; i < res.data.expences.length; i++) {
      AddUsertoScreen(res.data.expences[i]);
    }
    Showpagination(res.data);
  } catch (err) {
    console.log(err);
  }
}
main();
function Showpagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  PreviousPage,
  lastPage,
}) {
  console.log(
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    PreviousPage,
    lastPage
  );
  let pagination = document.getElementById("pagination");
  document.getElementById("tableid").appendChild(pagination);
  pagination.innerHTML = "";
  let select = document.createElement("select")
  select.id = "sher"
  select.className = "custom-select"
  let option1 = document.createElement("option")
  option1.value ="5";
  option1.textContent= "5"
  let option2 = document.createElement("option")
  option2.value = "10"
  option2.textContent = "10"
  let option3 = document.createElement("option")
  option3.value ="25";
  option3.textContent = "25"
  let option4 = document.createElement("option")
  option4.value = "50";
  option4.textContent ="50";
  select.appendChild(option1)
  select.appendChild(option2)
  select.appendChild(option3)
  select.appendChild(option4)
  pagination.appendChild(select);
  document.getElementById("sher").addEventListener("click",()=>{
    localStorage.setItem("item_perPage",document.getElementById("sher").value);
  })
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = PreviousPage;
    btn2.addEventListener("click", () => {
      GetExpenses(PreviousPage);
    });
    pagination.appendChild(btn2);
  }

  const btn1 = document.createElement("button");
  btn1.innerHTML = currentPage;
  btn1.addEventListener("click", () => {
    GetExpenses(currentPage);
  });
  pagination.appendChild(btn1);

  if (hasNextPage) {
    let nextpg = Number.parseInt(currentPage) + 1;
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextpg;
    btn3.addEventListener("click", () => {
      GetExpenses(nextpg);
    });
    pagination.appendChild(btn3);
  }
}

async function GetExpenses(page) {
  console.log(page);
  const token = localStorage.getItem("token");
  let res = await axios.get(`http://localhost:3002/getexpenses?page=${page}&item=${localStorage.getItem("item_perPage")}`, {
    headers: { Authorization: token },
  });
  clearExpenseTable();
  for (let i = 0; i < res.data.expences.length; i++) {
    AddUsertoScreen(res.data.expences[i]);
  }
  Showpagination(res.data);
}

function clearExpenseTable() {
  const expenseTable = document.querySelector(".my-expenses");
  const tbody = expenseTable.querySelector("tbody");

  // Remove only data rows, not the header row
  const dataRows = Array.from(tbody.children).slice(1); // Skip the first row (header row)

  // Remove each data row
  dataRows.forEach((row) => {
    tbody.removeChild(row);
  });
}

let button = document.getElementById("btn");
button.addEventListener("click", () => {
  AddExpence(event);
});

function AddExpence(event) {
  event.preventDefault();
  let expenseamount = document.getElementById("amount").value;
  let description = document.getElementById("Description").value;
  let category = document.getElementById("Category").value;

  let obj = {
    expenseamount,
    category,
    description,
  };

  AddToLocalStorage(obj);
}
async function AddToLocalStorage(obj) {
  try {
    console.log(obj);
    const token = localStorage.getItem("token");
    let res = await axios.post("http://localhost:3002/addexpense", obj, {
      headers: { Authorization: token },
    });
    console.log(res);
    AddUsertoScreen(res.data.expence);
  } catch (err) {
    console.log(err);
  }
}
const expenseDatadiv = document.getElementById("expense-data");

function createTable() {
  const CreateexpenseTable = document.createElement("table");
  CreateexpenseTable.id = "tableid";
  CreateexpenseTable.className = "my-expenses";
  CreateexpenseTable.innerHTML =
    "<tr class='table-header' ><th>Category</th><th>Description</th><th>Amount</th></tr>";
  console.log(CreateexpenseTable);
  document.getElementById("expense-data").appendChild(CreateexpenseTable);
}
createTable();

function AddUsertoScreen(obj) {
  const expenseTable = document.querySelector(".my-expenses");
  const row = expenseTable.insertRow();
  row.className = "table-row";
  row.insertAdjacentHTML(
    "beforeend",
    `<td class='expense-name' >${obj.category}</td><td class='expense-date' >${obj.description}</td><td class='expense-Amount'>${obj.expenseamount}</td> <td style="display:none;">${obj.id}</tb> `
  );
  const deletebtn = document.createElement("button");
  deletebtn.appendChild(document.createTextNode("X"));
  deletebtn.className = "delete-expense";
  row.appendChild(deletebtn);
  row.hidden.textContent = obj.id;
  console.log(row.textContent);

  deletebtn.onclick = async () => {
    console.log(obj.id);
    const token = localStorage.getItem("token");
    await axios.delete("http://localhost:3002/deleteexpense/" + obj.id, {
      headers: { Authorization: token },
    });
  };
}
expenseDatadiv.addEventListener("click", async (e) => {
  if (e.target.className === "delete-expense") {
    e.composedPath().forEach((ele) => {
      if (ele.className != "table-row") {
      } else {
        ele.style.display = "none";
      }
    });
  }
});
downloadbtn.addEventListener("click", () => {
  console.log("happty");
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3002/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 200) {
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
        console.log("hello here");
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      showError(err);
    });
});
document.getElementById("btn11").addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:3002/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: res.data.key_id,
    order_id: res.data.order.id,
    handler: async function (res) {
      const response = await axios.post(
        "http://localhost:3002/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: res.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      alert("YOu are a Premium User Now");
      let li = document.createElement("h2");
      li.textContent = "You are a premium user";
      document.getElementById("btn11").replaceWith(li);
      showLeaderBoard();
      localStorage.setItem("token", response.data.token);
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  //e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("something went wrong");
  });
});

function showLeaderBoard() {
  const LBbtn = document.createElement("input");
  LBbtn.type = "button";
  LBbtn.value = "ShowLeaderBoard";
  LBbtn.id = "showbtn";
  LBbtn.className = "btn btn-warning";
  LBbtn.style.float = "left";

  LBbtn.onclick = async () => {
    const token = localStorage.getItem("token");
    const userLeaderBoard = await axios.get(
      "http://localhost:3002/showLeaderBoard"
    );
    console.log(userLeaderBoard);

    createTb();

    var LeaderBoardele = document.getElementById("leaderboard");
    userLeaderBoard.data.forEach((element, i) => {
      const expenseTable = document.querySelector(".my-leaderboard");
      const row = expenseTable.insertRow();
      row.className = "table-row";
      row.insertAdjacentHTML(
        "beforeend",
        `<td class='expense-name' >${i + 1}</td><td class='expense-date' >${
          element.username
        }</td><td class='expense-Amount'>${element.totalExpense}</td>`
      );
    });
  };
  document.getElementById("childd").appendChild(LBbtn);
  function createTb() {
    const CreateexpenseTable = document.createElement("table");
    CreateexpenseTable.className = "my-leaderboard";
    CreateexpenseTable.innerHTML =
      "<tr class='table-header' ><th>Rank</th><th>Name</th><th>Total Expenses</th></tr>";
    console.log(CreateexpenseTable);
    LBbtn.after(CreateexpenseTable);
  }
}
console.log(downloadbtn);

function showError(err) {
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`;
}

async function DownloadFiles() {
  try {
    const token = localStorage.getItem("token");
    let res = await axios.get("http://localhost:3002/downloadFiles", {
      headers: { Authorization: token },
    });
    if (!res) {
      console.log("Empty");
    } else {
      for (let i = 0; i < res.data.dwd.length; i++) {
        DownloadFilesonScreen(res.data.dwd[i]);
      }
    }
  } catch (error) {
    showError(error);
  }
}
function DownloadFilesonScreen(obj) {
  let download = document.getElementById("download");
  let btnn = document.createElement("button");
  btnn.appendChild(document.createTextNode("Download"));
  let li = document.createElement("li");
  li.textContent = obj.Date + " url: " + obj.url;

  download.appendChild(li);
  li.appendChild(btnn);
  console.log(download.children);
  btnn.onclick = () => {
    let a = document.createElement("a");
    a.href = obj.url;
    a.download = "myexpense.csv";
    a.click();
  };
}
