import $ from 'jquery';

const actores = [
    {
        nombre: "Dot",
        personaje: "Doan Dot",
        imagen: "dot"
    },
    {
        nombre: "Momo",
        personaje: "Momo",
        imagen: "momoDeGalaDNI"
    },
    {
        nombre: "Bernat Dot",
        personaje: "Hermano de Dot",
        imagen: "hermanoDot"
    },
    {
        nombre: "Javier Amengual",
        personaje: "Padre de Dot",
        imagen: "javiMadre"
    },
    {
        nombre: "Asier Alemany",
        personaje: "Ciberdelincuente Osier",
        imagen: "osier"
    },
    {
        nombre: "Carlos Pesquera",
        personaje: "Grafitero Carlos",
        imagen: "carlos"
    },
    {
        nombre: "Javier Amengual",
        personaje: "Pandillero Javi Peron",
        imagen: "javi"
    },
    {
        nombre: "Milan Gavaric",
        personaje: "Milovan Milovanovic",
        imagen: "milan"
    }
]

/**
 * @param {any} num
 */
 export function hideActor(num) {
    for (let i = actores.length - 1; i > num; i--) {
        secuenciaContainers[i].addClass('d-none');
        mostrados[i] = false;
    }
}

/**
 * @param {any} num
 */
export function showActor(num) {
    if (num < actores.length) {
        secuenciaContainers[num].removeClass('d-none');
        mostrados[num] = true;
        ultimo = -1;
    }
}

$(() => {
    for (let i in actores) {
        $("#contenedor-actores").append(
            `<div class="col-24">
                <div id="actor-container${i}" class="row g-0 border card rounded-5 overflow-hidden flex-md-row mb-4 shadow h-md-250 position-relative text-white bg-dark">
                    <div class="col-auto d-lg-block">
                        <img id="" class="" src="img/${actores[i].imagen}.png" width="100">
                    </div>
                    <div class="col p-8 d-flex flex-column position-static">
                        <div class="card-body">
                            <h5 class="card-title">${actores[i].nombre}</h5>
                            <p class="card-text">${actores[i].personaje}</p>
                        </div>
                    </div>
                </div>
            </div>`);
    }
});

