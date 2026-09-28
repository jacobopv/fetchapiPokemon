document.getElementById('txtBtn').addEventListener('click', cargarTXT);
document.getElementById('jsonBtn').addEventListener('click', cargarJSON);
document.getElementById('apiBtn').addEventListener('click', cargarREST);

function cargarTXT() {
    fetch('datos.txt')
        .then(res => res.text())
        .then(empleados => {
            document.getElementById('resultado').innerHTML = `
                <div class="card card-txt">
                    <p>${empleados}</p>
                </div>`;
        })
        .catch(error => console.log(error));
}

function cargarJSON() {
    fetch('empleados.json')
        .then(res => res.json())
        .then(data => {
            let html = '<div class="cards-grid">';
            data.forEach(empleado => {
                html += `
                    <div class="card">
                        <h3>${empleado.nombre}</h3>
                        <p class="card-subtitle">${empleado.puesto}</p>
                    </div>`;    
            });
            html += '</div>';
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(error => console.log(error));
}

function cargarREST() {
    fetch('https://picsum.photos/list')
        .then(res => res.json())
        .then(imagenes => {
            let html = '<div class="cards-grid">';
            // Tomamos las primeras 12 para una mejor presentación
            imagenes.slice(0, 12).forEach(imagen => {
                html += `
                    <div class="card card-foto">
                        <span class="card-autor">${imagen.author}</span>
                        <a target="_blank" href="${imagen.post_url}" class="card-link">Ver imagen</a>
                    </div>`; 
            });
            html += '</div>';
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(error => console.log(error));
}   