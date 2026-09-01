const CLAVE_STORAGE = "habitos";

const habitosIniciales = [
    { id: 1, nombre: "Beber 8 vasos de agua", completado: false },
    { id: 2, nombre: "Hacer ejercicio", completado: true },
    { id: 3, nombre: "Dormir 8 horas", completado: false },
    { id: 4, nombre: "Leer 30 minutos", completado: false },
    { id: 5, nombre: "Hacer yoga", completado: false },
];

const cargarHabitos = () => {
    const guardados = localStorage.getItem(CLAVE_STORAGE);
    if (!guardados) return habitosIniciales;
    return JSON.parse(guardados);
};

const guardarHabitos = () => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(habitos));
};

let habitos = cargarHabitos();

const listaEl = document.querySelector("#habit-list");
const formEl = document.querySelector("#habit-form");
const inputEl = document.querySelector("#habit-name");

const siguienteId = () =>
    habitos.reduce((max, { id }) => Math.max(max, id), 0) + 1;

const agregarHabito = (nombre) => {
    habitos.push({ id: siguienteId(), nombre, completado: false });
};

const completarHabito = (idHabito) => {
    const habito = habitos.find(({ id }) => id === idHabito);
    if (!habito) return;
    const { completado } = habito;
    habito.completado = !completado;
};

const eliminarHabito = (idHabito) => {
    const indice = habitos.findIndex(({ id }) => id === idHabito);
    if (indice === -1) return;
    habitos.splice(indice, 1);
};

const renderizarHabitos = () => {
    listaEl.innerHTML = habitos
        .map(({ id, nombre, completado }) => `
            <li class="list-group-item${completado ? " completado" : ""}" data-id="${id}">
                <span data-accion="completar">${nombre}</span>
                <button type="button" class="btn btn-outline-danger btn-sm" data-accion="eliminar">
                    Eliminar
                </button>
            </li>
        `)
        .join("");

    guardarHabitos();
};

listaEl.addEventListener("click", (event) => {
    const item = event.target.closest("[data-id]");
    if (!item) return;

    const id = Number(item.dataset.id);
    const eliminar = event.target.closest("[data-accion='eliminar']");
    const completar = event.target.closest("[data-accion='completar']");

    if (eliminar) {
        eliminarHabito(id);
    } else if (completar) {
        completarHabito(id);
    } else {
        return;
    }

    renderizarHabitos();
});

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const { value } = inputEl;
    const nombre = value.trim();
    if (!nombre) return;

    agregarHabito(nombre);
    formEl.reset();
    renderizarHabitos();
});

renderizarHabitos();
