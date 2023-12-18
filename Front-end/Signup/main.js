/*  */

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
    AddUserToDatabase(obj);
}
async function AddUserToDatabase(obj)
{
    try {
        let res = await axios.post("http://localhost:3002/signup",obj)
        if(res.status == 201)
        {
            alert("User Added Successfully")
            window.location.href="../login/index.html"
        }
        else{
            throw new Error("Failed to Signup")
        }
    } catch (error) {
        document.body.innerHTML+=`<div style="color: red;">${error}</div>`
    }
}
