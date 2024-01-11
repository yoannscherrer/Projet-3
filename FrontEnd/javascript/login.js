let email;
let password;
const btn = document.getElementById("button");
const url_login = "http://localhost:5678/api/users/login";

function getEmailAndPassword() {
    btn.addEventListener("click", async (event) => {
        event.preventDefault();
        email = document.getElementById("email").value;
        password = document.getElementById("password").value; 
        if (email == "" || password == ""){
            alert("Erreur dans l’identifiant ou le mot de passe");
        }
        await getAPIresponse(email, password);     
})    
}

async function getAPIresponse(email, password) {
    let login = {email, password};
    let login_json = JSON.stringify(login);
    console.log(login_json);
    let response = await fetch(url_login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: login_json
    });
    if (response.status == 404 || response.status == 401){
        alert("Erreur dans l’identifiant ou le mot de passe");
    }  
    else if (response.status == 200){
        document.location.href="index.html";
        editor_mode();
    }
}

function editor_mode() {
    let login_btn = document.getElementById("login_btn");
    let logout_btn = document.getElementById("logout_btn");
    login_btn.className = "hidden";
    logout_btn.classList.remove("hidden");
}

getEmailAndPassword();
