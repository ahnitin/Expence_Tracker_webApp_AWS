function signupForm(event)
{
    event.preventDefault();

    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let obj ={
        username,
        email,
        password
    }
    console.log(obj);
    AddUserToDatabase(obj);
}
async function AddUserToDatabase(obj)
{
    try {
        let res = await axios.post("http://localhost:3002/signup",obj)
        if(res.status === 201)
        {
            console.log(res)
            alert("User Added successfully")
        }
    } catch (error) {
        alert("user exists")
        document.body.innerHTML += `<div style="color:red;">${error}</div>`
    }
    
}