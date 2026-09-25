document.getElementById('txtBtn').addEventListener('click', cargarTXT);
document.getElementById('jsonBtn').addEventListener('click', cargarJSON);
document.getElementById('apiBtn').addEventListener('click', cargarREST);
document.getElementById('pokeBtn').addEventListener('click', buscarPokemon);

function cargarTXT() {
    fetch ('datos.txt')
        .then(function(res){
            return res.text();
        })
        .then(function (empleados){
            console.log(empleados);
            document.getElementById('resultado').innerHTML = empleados;
        })
        .catch(function(error){
            console.log(error);
        })
}

function cargarJSON(){
    fetch ('empleados.json')
        .then(function(res){
            return res.json();
    })
    .then(function(data){
        let html = '';
        data.forEach(function(empleado){
            html +=`
                <li>${empleado.nombre} ${empleado.puesto}</li>`;    
        })
        document.getElementById('resultado').innerHTML = html;
    })
        .catch(function(error){
            console.log(error);
    });
}

function cargarREST(){
    fetch ('https://picsum.photos/list')
        .then(function(res){
            return res.json();
    })
    .then(function(imagenes){
        let html = '';
        imagenes.forEach(function(imagen){
            html += `<li>
                        <a target="_blank" href="${imagen.post_url}">Ver imagen</a>
                        ${imagen.author}</li>`; 
        })
        document.getElementById('resultado').innerHTML = html;
    })
}

async function buscarPokemon(e) {
    e.preventDefault();

    let nombrePokemon = document.getElementById('pokemonInput').value;
    nombrePokemon = nombrePokemon.trim().toLowerCase();

    if (nombrePokemon === '') {
        document.getElementById('resultado').innerHTML =
            '<p class="mensaje-advertencia">Por favor escribe el nombre o número de un Pokémon.</p>';
        return;
    }

    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);

        if (!respuesta.ok) {
            throw new Error('Pokémon no encontrado');
        }

        const data = await respuesta.json();

        const tipos = data.types
            .map(function (t) {
                return `<span class="pokemon-tipo">${t.type.name}</span>`;
            })
            .join('');

        const html = `
            <div class="pokemon-card">
                <h3>${data.name.toUpperCase()} #${data.id}</h3>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <div class="pokemon-tipos">${tipos}</div>
                <div class="pokemon-datos">
                    <span>Peso: ${data.weight}</span>
                    <span>Altura: ${data.height}</span>
                </div>
            </div>`;

        document.getElementById('resultado').innerHTML = html;

    } catch (error) {
        document.getElementById('resultado').innerHTML =
            '<p class="mensaje-error">El Pokémon buscado no fue encontrado.</p>';
        console.log(error);
    }
}