// Eventos: cada botón ejecuta su función al hacer clic
document.getElementById('txtBtn').addEventListener('click', cargarTXT);
document.getElementById('jsonBtn').addEventListener('click', cargarJSON);
document.getElementById('apiBtn').addEventListener('click', cargarREST);
document.getElementById('pokeBtn').addEventListener('click', buscarPokemon);

// Carga un archivo de texto local con promesas (.then)
function cargarTXT() {
    // fetch devuelve una promesa con la respuesta del archivo
    fetch('datos.txt')
        .then(function(res) {
            // text() lee el cuerpo como texto plano (también devuelve una promesa)
            return res.text();
        })
        .then(function(empleados) {
            console.log(empleados);
            // Se inyecta el texto en el DOM dentro de una tarjeta
            document.getElementById('resultado').innerHTML = `
                <div class="card card-txt">
                    <p>${empleados}</p>
                </div>`;
        })
        .catch(function(error) {
            // Captura errores de red o de lectura
            console.log(error);
        });
}

// Carga un archivo JSON local con promesas (.then)
function cargarJSON() {
    fetch('empleados.json')
        .then(function(res) {
            // json() convierte el cuerpo en un arreglo/objeto de JavaScript
            return res.json();
        })
        .then(function(data) {
            // Se acumula el HTML de todas las tarjetas en una variable
            let html = '<div class="cards-grid">';
            // forEach recorre cada empleado del arreglo
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

// Consume una API REST externa (Picsum) con promesas (.then)
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

// Busca un Pokémon con async/await; async hace que la función devuelva una promesa
async function buscarPokemon(e) {
    // Evita que el enlace <a href="#"> salte al inicio de la página
    e.preventDefault();

    // Lee el input y quita espacios al inicio y al final
    let nombrePokemon = document.getElementById('pokemonInput').value;
    nombrePokemon = nombrePokemon.trim();

    // Validación 1: campo vacío
    if (nombrePokemon === '') {
        document.getElementById('resultado').innerHTML =
            '<p class="mensaje-advertencia">Por favor escribe el número de un Pokémon.</p>';
        return;
    }

    // Validación 2: solo dígitos (^ inicio, [0-9]+ uno o más números, $ fin)
    const soloNumeros = /^[0-9]+$/;

    if (!soloNumeros.test(nombrePokemon)) {
        document.getElementById('resultado').innerHTML =
            '<p class="mensaje-advertencia">Solo se permiten números. No uses letras ni caracteres especiales.</p>';
        return;
    }

    // try/catch: si algo falla, el programa no se rompe y salta al catch
    try {
        // await pausa la función hasta que llegue la respuesta; ${} inserta la variable en la URL
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);

        // fetch no falla con un 404, por eso se revisa ok y se lanza el error manualmente
        if (!respuesta.ok) {
            throw new Error('Pokémon no encontrado');
        }

        // Convierte la respuesta en objeto JavaScript (también requiere await)
        const data = await respuesta.json();

        // map transforma cada tipo en un <span>; join('') los une sin comas
        const tipos = data.types
            .map(function (t) {
                return `<span class="pokemon-tipo">${t.type.name}</span>`;
            })
            .join('');

        // Tarjeta con nombre, ID, imagen, tipos, peso y altura
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

        // Muestra la tarjeta en la página
        document.getElementById('resultado').innerHTML = html;

    } catch (error) {
        // Se ejecuta si hubo error de red o si se lanzó el throw (Pokémon inexistente)
        document.getElementById('resultado').innerHTML =
            '<p class="mensaje-error">El Pokémon buscado no fue encontrado.</p>';
        console.log(error);
    }
}