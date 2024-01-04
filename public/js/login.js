console.log("kaam start");
document.getElementById("login-form").addEventListener("submit",(event)=>{
    LoginUser(event);
})
async function LoginUser(event)
{
    event.preventDefault();
    
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value;

    let obj={
        email,
        password,
    }

    try {
        let res = await axios.post("http://18.214.108.81:3000/login",obj)
        if(res.status === 201)
        {
            alert("User login sucessful");
            localStorage.setItem('token',res.data.token)
            window.location.href = "./expense.html"
        }
        
    } catch (error) {
        console.log(error)
        document.body.innerHTML+= `<div style="color:red;"> ${error.response.data.message }</div>`
    }
}