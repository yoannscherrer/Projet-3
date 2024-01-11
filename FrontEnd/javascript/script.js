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


getWorksFilters(0);
getButton();