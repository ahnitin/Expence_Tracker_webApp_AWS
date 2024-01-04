/*  */
console.log("signup file loaded")
document.getElementById("signup-form").addEventListener("submit", function(event) {
    SignupUser(event);
});

function SignupUser(event)
{
    event.preventDefault();
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value
    
    let obj ={
        username,
        email,
        password
    }
    console.log(obj)
    AddUserToDatabase(obj);
}
async function AddUserToDatabase(obj)
{
    try {
        let res = await axios.post("http://18.214.108.81:3000/signup",obj)
        if(res.status == 201)
        {
            alert("User Added Successfully")
            window.location.href="./login.html"
        }
        else{
            throw new Error("Failed to Signup")
        }
    } catch (error) {
        document.body.innerHTML+=`<div style="color: red;">${error.response.data.message}</div>`
    }
}
