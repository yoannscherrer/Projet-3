const url = "http://localhost:5678/api/works";
const url_category = "http://localhost:5678/api/categories"
const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");
const token = localStorage.getItem("token");
let formData = new FormData();

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

async function openWorksModal() {
    const reponse = await fetch(url);
    const works = await reponse.json();
    works.forEach(work => {
            let figure = document.createElement("figure");
            figure.dataset.id = work.id;
            let image = document.createElement("img");
            let icon = document.createElement("i");
            image.src = work.imageUrl;
            image.alt = work.title;
            figure.classList.add("figure_modal");
            image.classList.add("img_modal");
            icon.classList.add("fa-solid","fa-trash-can","fa-sm",);
            modalGallery.appendChild(figure);
            figure.appendChild(image);
            figure.appendChild(icon);
        }
    );
}

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").addEventListener("click", stopPropagation);
    modal.querySelector(".modal_button").addEventListener("click", addPhotosModal);
    modal.querySelector(".back-modal").addEventListener("click", backModal);
    openWorksModal();
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
    modal.querySelector(".modal_button").removeEventListener("click", addPhotosModal);
    modal.querySelector(".back-modal").removeEventListener("click", backModal);
    modal = null;
    modalGallery.innerHTML = "";
    
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

async function deleteWorks() {
    modalGallery.addEventListener("click", function(event){
        if (event.target.classList.contains("fa-trash-can")) {
            const figure = event.target.closest("figure");
            const workId = figure.dataset.id;
            fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(function(response){
                if (response.ok) {
                    modalGallery.innerHTML = "";
                    openWorksModal();
                    gallery.innerHTML = "";
                    getWorksFilters(0);
                } else {
                    console.error("Erreur lors de la suppression de l'élément");
                }
            })
            .catch(function(error) {
                console.error("Erreur lors de la suppression de l'élément", error);
            })
        }
    })
}

function addWorksToFormData() {
    const selectedPic = document.getElementById("photos").files[0];
    const selectedTitle = document.getElementById("titleAdd").value;
    const selectedCategory = document.getElementById("selectCategories").value;
    if (selectedPic.size <= 4000000) {
        formData.append("image", selectedPic);
        formData.append("title", selectedTitle);
        formData.append("category", selectedCategory);
    }
    else {
        alert("Taille de l'image trop importante");
    }
}

async function addWorks() {
    let title = document.getElementById("titleAdd");
    let inputImg = document.getElementById("photos");
    let btn = document.getElementById("add_photos_button");
    inputImg.addEventListener("input", function() {
        previewImage();
        if (document.getElementById("photos").files[0]!=null && document.getElementById("titleAdd").value!="") {
            btn.classList.remove("disabled_button");
            btn.disabled = false;
        }
        else {
            btn.className = "disabled_button modal_button";
            btn.disabled = true;
        }
    })
    title.addEventListener("input", function() {
        if (document.getElementById("photos").files[0]!=null && document.getElementById("titleAdd").value!="") {
            btn.classList.remove("disabled_button");
            btn.disabled = false;
        }
        else {
            btn.className = "disabled_button modal_button";
            btn.disabled = true;
        }
    })
    btn.addEventListener("click", function() {
        addWorksToFormData();
        fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(function(response){
            if (response.ok) {
                modalGallery.innerHTML = "";
                openWorksModal();
                gallery.innerHTML = "";
                getWorksFilters(0);
                let image = document.getElementById("previewImg");
                image.parentNode.removeChild(image);
                document.getElementById("button_add_photos").classList.remove("hidden");
                document.getElementById("titleAdd").value = "";
                btn.className = "disabled_button modal_button";
                btn.disabled = true;
                inputImg.value = "";
                formData.delete("image");
                formData.delete("title");
                formData.delete("category");
            }
            else {
                console.error("Erreur lors de l'ajout d'un élément");
            }
        })
        .catch(function(error) {
            console.error("Erreur lors de l'ajout d'un élément", error);
        })
    })
}

function previewImage() {
    let img = document.getElementById("div_add_photos");
    let image = document.createElement("img");
    let btn_add = document.getElementById("button_add_photos");
    const selectedPic = document.getElementById("photos").files[0];
    const reader = new FileReader();
    image.id = "previewImg";
    img.appendChild(image);
    reader.addEventListener(
        "load", () => {
          image.src = reader.result;
        },
        false,
      );
    if (selectedPic) {
        reader.readAsDataURL(selectedPic);
        btn_add.className = "hidden";
      }
}

function addPhotosModal() {
    let remove_photos = document.getElementById("remove_photos_modal");
    let add_photos = document.getElementById("add_photos_modal");
    let button_back = document.querySelector(".back-modal");
    remove_photos.classList.toggle("hidden");
    add_photos.classList.remove("hidden"); 
    button_back.classList.remove("hidden");
}

function backModal() {
    let remove_photos = document.getElementById("remove_photos_modal");
    let add_photos = document.getElementById("add_photos_modal");
    let button_back = document.querySelector(".back-modal");
    remove_photos.classList.remove("hidden");
    add_photos.classList.toggle("hidden");
    button_back.classList.toggle("hidden");
    let inputImg = document.getElementById("photos");
    let btn = document.getElementById("add_photos_button");
    let image = document.getElementById("previewImg");
    if (image != null) {
        image.parentNode.removeChild(image);
    }
    document.getElementById("button_add_photos").classList.remove("hidden");
    document.getElementById("titleAdd").value = "";
    btn.className = "disabled_button modal_button";
    btn.disabled = true;
    inputImg.value = "";
}

async function categories_Modal() {
    const select = document.getElementById("selectCategories");
    const reponse = await fetch(url_category);
    const categories = await reponse.json();
    categories.forEach(button => {
        let option = document.createElement("option");
        option.innerText = button.name;
        option.value = button.id;
        select.appendChild(option);
    })
    
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
    })
}

getWorksFilters(0);
getButton();
categories_Modal();
deleteWorks();
addWorks();

if (token!=null){
    editor_mode();
    logout(); 
} 

