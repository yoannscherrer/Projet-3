const url = "http://localhost:5678/api/works";
const url_category = "http://localhost:5678/api/categories"
const gallery = document.querySelector(".gallery");

async function getWorksFilters(id){
    const reponse = await fetch(url);
    const works = await reponse.json();
    id = parseInt(id);
    works.forEach(work => {
        if (id === 0 || work.categoryId === id) {
            let figure = document.createElement("figure");
            let image = document.createElement("img");
            image.src = work.imageUrl;
            image.alt = work.title;
            let title = document.createElement("figcaption");
            title.innerText = work.title;
            gallery.appendChild(figure);
            figure.appendChild(image);
            figure.appendChild(title);
        }
    });
}

async function getButton(){
    const filters = document.querySelector(".filters-button");
    const reponse = await fetch(url_category);
    const buttons = await reponse.json();
    const buttons_tab = [];
    buttons.unshift({id: 0, name: 'Tous'});
    buttons.forEach(button => {
        let btn = document.createElement("button");
        btn.className = "button";
        btn.id = button.id;
        btn.innerText = button.name;
        if (btn.id === "0"){
            btn.className = "active";
        }
        filters.appendChild(btn);
        buttons_tab.push(btn);
        btn.addEventListener("click", async (event) => {
            gallery.innerHTML = '';
            await getWorksFilters(event.target.id);
            let active = buttons_tab.find((element) => element.className === "active")
            active.className = "button";
            event.target.className = "active";
        })
    });
    
}

let modal = null;

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").addEventListener("click", stopPropagation);
}

const closeModal= function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".close-modal").removeEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopPropagation);
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

function editor_mode() {
    let login_btn = document.getElementById("login_btn");
    let logout_btn = document.getElementById("logout_btn");
    let editor_header = document.getElementById("editor_header");
    let filters = document.getElementById("filters");
    let modifierButton = document.getElementById("buttonModifier");
    let header = document.querySelector(".header");
    login_btn.className = "hidden";
    logout_btn.classList.remove("hidden");
    editor_header.classList.remove("hidden");
    modifierButton.style.display = null;
    filters.className = "hidden_filters";
    header.classList.remove("header");
    header.className = "header_editor";
    modifierButton.addEventListener("click", openModal);
}

function logout() {
    let logout_btn = document.getElementById("logout_btn");
    logout_btn.addEventListener("click",() => {
        localStorage.clear();
        console.log(localStorage)
    })
}

getWorksFilters(0);
getButton();

if (localStorage.getItem("token")!=null){
    editor_mode();
    logout();
} 



