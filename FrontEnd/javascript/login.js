
let email;
let password;
const btn = document.getElementById("button");
const url_login = "http://localhost:5678/api/users/login";

function getEmailAndPassword() {
    btn.addEventListener("click", async (event) => {
        event.preventDefault();
        email = document.getElementById("email").value;
        password = document.getElementById("password").value; 
        await getAPIresponse(email, password);    
})    
    
}

async function getAPIresponse(email, password) {
    let login = {email, password};
    let login_json = JSON.stringify(login);
    console.log(login_json);
    fetch(url_login, {
        method: "POST",
        body: login_json,
        headers: { "Content-Type": "application/json" }
    })
    .then((response)=>response.json())
    .then((data)=>{
        localStorage.clear();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        console.log(data);
        console.log(localStorage);
        if (localStorage.getItem("token")==="undefined"){
            alert("Erreur dans l’identifiant ou le mot de passe")
        } 
        else {
            editor_mode(); 
        }   
    })
}


getEmailAndPassword();
