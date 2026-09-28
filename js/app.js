document.getElementById('txtBtn').addEventListener('click', cargarTXT);
document.getElementById('jsonBtn').addEventListener('click', cargarJSON);
document.getElementById('apiBtn').addEventListener('click', cargarREST);
document.getElementById('pokeBtn').addEventListener('click', buscarPokemon);

function cargarTXT() {
    fetch('datos.txt')
        .then(function(res) {
            return res.text();
        })
        .then(function(empleados) {
            console.log(empleados);
            document.getElementById('resultado').innerHTML = `
                <div class="card card-txt">
                    <p>${empleados}</p>
                </div>`;
        })
        .catch(function(error) {
            console.log(error);
        });
}

function cargarJSON() {
    fetch('empleados.json')
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            let html = '<div class="cards-grid">';
            data.forEach(function(empleado) {
                html += `
                    <div class="card">
                        <h3>${empleado.nombre}</h3>
                        <p class="card-subtitle">${empleado.puesto}</p>
                    </div>`;    
            });
            html += '</div>';
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(function(error) {
            console.log(error);
        });
}

function cargarREST() {
    fetch('https://picsum.photos/list')
        .then(function(res) {
            return res.json();
        })
        .then(function(imagenes) {
            let html = '<div class="cards-grid">';
            // Tomamos las primeras 12 imágenes para no saturar el viewport
            imagenes.slice(0, 12).forEach(function(imagen) {
                html += `
                    <div class="card">
                        <span class="card-autor">${imagen.author}</span>
                        <a target="_blank" href="${imagen.post_url}" class="card-link">Ver imagen</a>
                    </div>`; 
            });
            html += '</div>';
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(function(error) {
            console.log(error);
        });
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