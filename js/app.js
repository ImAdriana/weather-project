const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

// Es parecido a DOMContentLoaded, solo que este es con window
// document.addEventListener('DOMContentLoaded', () => {
// Si se usa una API, se asegura que todos los recursos estén cargados
// a través del evento load
window.addEventListener('load', () => {
    formulario.addEventListener('submit', obtenerClima);
});

function obtenerClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    // Campos vacios
    if (ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios');
        return;
    }
    // Consultar la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-300');
    // Revisa si no existe la clase para mostrar el error
    if (!alerta) {
        // Crear alerta
        const alerta = document.createElement('div');
        alerta.classList.add(
            'px-4',
            'py-3',
            'mt-5',
            'text-sm',
            'text-center',
            'text-red-800',
            'rounded-lg',
            'bg-red-300',
            'mx-auto',
            'max-w-sm'
        );
        alerta.setAttribute('role', 'alert');

        alerta.innerHTML = `
        <span class="font-medium">¡Error!</span> ${mensaje}
        `;
        container.appendChild(alerta);

        // Se elimine la alerta después de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {
    const apiKey = 'API key'; // Sustituir por la key obtenida de tu cuenta
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiKey}`;

    // Muestra un Spinner de carga
    spinner();
    setTimeout(() => {
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                limpiarHTML();
                if (data.cod === '404') {
                    mostrarError('Ciudad no encontrada');
                    return;
                }

                // Imprime la respuesta en el HTML
                mostrarClima(data);
            });
    }, 2000);
}

function mostrarClima(data) {
    const {
        name,
        main: { temp, temp_max, temp_min },
    } = data;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.innerHTML = `Clima en ${name}`;
    nombreCiudad.classList.add('text-2xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Máx: ${max} &#8451; `;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451; `;
    tempMin.classList.add('text-xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('text-6xl');
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add(
        'text-center',
        'text-black',
        'bg-gray-100',
        'rounded-lg'
    );

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);
}

function kelvinACentigrados(grados) {
    return parseInt(grados - 273.15);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    <div class="cube1"></div>
    <div class="cube2"></div>`;

    resultado.appendChild(divSpinner);
}
