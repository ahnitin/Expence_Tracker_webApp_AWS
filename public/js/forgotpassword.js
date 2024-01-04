document.getElementById("forgot").addEventListener("submit",(event)=>{
    forgetpassword(event);
})


async function forgetpassword(event)
{
    event.preventDefault();
    let email = document.getElementById("email").value
    let obj ={
        email
    }
    try {
        await axios.post("http://18.214.108.81:3000/password/forgotpassword",obj)
        console.log("ho gaya")
    } catch (error) {
        console.log(error)
        document.body.innerHTML+= `<div style="color:red;"> ${error} </div>`;
    }
    

}