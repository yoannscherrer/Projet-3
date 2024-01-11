let email;
let password;
const btn = document.getElementById("button");
const url_login = "http://localhost:5678/api/users/login";

function getEmailAndPassword() {
    btn.addEventListener("click", async (event) => {
        email = document.getElementById("email").value;
        password = document.getElementById("password").value; 
        await getAPIresponse(email, password);   
          
})    
}

async function getAPIresponse(email, password) {
    let login = {email, password};
    let login_json = JSON.stringify(login);
    let response = await fetch(url_login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: login_json
    });
    if (email == "" || password == "" || response.status == 404 || response.status == 401){
        alert("Erreur dans l’identifiant ou le mot de passe");
    }  
    else {
        alert("good");
        redirection();
    }
    console.log(response.status);
}

function redirection() {
    let login_btn = document.getElementById("login_btn");
    let logout_btn = document.getElementById("logout_btn");
    login_btn.className = "hidden";
    logout_btn.classList.remove("hidden");
    document.location.href="index.html";
}

getEmailAndPassword();
