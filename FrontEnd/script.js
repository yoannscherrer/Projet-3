const url = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");

async function getWorks(){
    const reponse = await fetch(url);
    const works = await reponse.json();
    console.log(works);
    for(work in works) {
        gallery.innerHTML += `
        <figure>
			<img src=${works[work].imageUrl} alt=${works[work].title}>
			<figcaption>${works[work].title}</figcaption>
		</figure>
        `
    }
}

getWorks();