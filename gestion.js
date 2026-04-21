let tareas = [];

function guardarEnLocalStorage() {
    localStorage.setItem('tareasTIC', JSON.stringify(tareas));
}

function cargarDatosIniciales() {
    const data = localStorage.getItem('tareasTIC');
    if (data) {
        tareas = JSON.parse(data);
    } else {
        // Tareas con temática TICs
        tareas = [
            { id: 1, nombre: "Analizar Funcionamiento de Redes", prioridad: "Media", fecha: "2024-05-24", completada: true },
            { id: 2, nombre: "Diseñar la interfaz de la app", prioridad: "Alta", fecha: "2024-05-24", completada: true },
            { id: 3, nombre: "Actualizar Drivers", prioridad: "Baja", fecha: "2024-05-23", completada: true },
            { id: 4, nombre: "Enviar Reportes de Seguridad", prioridad: "Baja", fecha: "2024-05-25", completada: true },
            { id: 5, nombre: "Comprar insumos TI", prioridad: "Media", fecha: "2024-05-23", completada: true }
        ];
        guardarEnLocalStorage();
    }
}

let filtroActivo = "all";

// auxiliares
function formatearFecha(iso) {
    if (!iso) return "dd/mm/aaaa";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

function obtenerFechaActualISO() {
    const hoy = new Date();
    return hoy.toISOString().split("T")[0];
}

// actualiza contadores
function actualizarContadores() {
    const total = tareas.length;
    const pendientes = tareas.filter(t => !t.completada).length;
    const completadas = tareas.filter(t => t.completada).length;
    document.getElementById("totalCount").innerText = total;
    document.getElementById("pendingCount").innerText = pendientes;
    document.getElementById("completedCount").innerText = completadas;
}

// realizar lista con DOM
function renderizarTareas() {
    const contenedor = document.getElementById("tasksList");
    let tareasFiltradas = [...tareas];

    if (filtroActivo === "pending") tareasFiltradas = tareas.filter(t => !t.completada);
    if (filtroActivo === "completed") tareasFiltradas = tareas.filter(t => t.completada);

    if (tareasFiltradas.length === 0) {
        contenedor.innerHTML = '<div class="empty-message">✨ No hay tareas para mostrar</div>';
        actualizarContadores();
        return;
    }

    let html = "";
    for (let t of tareasFiltradas) {
        const claseCompletada = t.completada ? "task-completed" : "";
        const iconoCheck = t.completada ? " ok " : "◻️";
        const fechaVista = formatearFecha(t.fecha);
        const prioridadClass = `priority-${t.prioridad.toLowerCase()}`;

        html += `
            <div class="task-item ${claseCompletada}" data-id="${t.id}">
                <div class="task-info">
                    <span class="task-name">${escapeHTML(t.nombre)}</span>
                    <span class="task-priority ${prioridadClass}">${t.prioridad}</span>
                    <span class="task-date">${fechaVista}</span>
                </div>
                <div class="task-actions">
                    <button class="toggle-btn" data-id="${t.id}">${iconoCheck}</button>
                    <button class="delete-btn" data-id="${t.id}"> </button>
                </div>
            </div>
        `;
    }
    contenedor.innerHTML = html;
    actualizarContadores();

    // Eventos a botones dinámicos
    document.querySelectorAll(".toggle-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.getAttribute("data-id"));
            toggleCompletar(id);
        });
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.getAttribute("data-id"));
            eliminarTarea(id);
        });
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
    });
}

// crud
function agregarTarea() {
    const nombreInput = document.getElementById("taskNameInput");
    const prioridadSelect = document.getElementById("taskPrioritySelect");
    const fechaInput = document.getElementById("taskDateInput");

    let nombre = nombreInput.value.trim();
    if (nombre === "") {
        alert("Escribe una tarea válida");
        return;
    }
    if (nombre.length > 55) nombre = nombre.slice(0, 52) + "...";

    const prioridad = prioridadSelect.value;
    let fecha = fechaInput.value;
    if (fecha === "") fecha = obtenerFechaActualISO();

    const nuevoId = tareas.length ? Math.max(...tareas.map(t => t.id)) + 1 : 1;
    const nuevaTarea = {
        id: nuevoId,
        nombre: nombre,
        prioridad: prioridad,
        fecha: fecha,
        completada: false
    };
    tareas.push(nuevaTarea);
    guardarEnLocalStorage();

    nombreInput.value = "";
    fechaInput.value = "";
    prioridadSelect.value = "Media";
    renderizarTareas();
}

function toggleCompletar(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarEnLocalStorage();
        renderizarTareas();
    }
}

function eliminarTarea(id) {
    if (confirm("¿Eliminar esta tarea permanentemente?")) {
        tareas = tareas.filter(t => t.id !== id);
        guardarEnLocalStorage();
        renderizarTareas();
    }
}

// filtro de navegacion
function inicializarFiltros() {
    const links = document.querySelectorAll(".categorias-nav a");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const filtro = link.getAttribute("data-filter");

            if (filtro === "calendar") {
                alert("Vista Calendario: Próximamente en Gestión TICs");
                return;
            }
            if (filtro === "stats") {
                const pend = tareas.filter(t => !t.completada).length;
                alert(`ESTADÍSTICAS TICs\n━━━━━━━━━━━━━━━━\n Total: ${tareas.length}\n Pendientes: ${pend}\n Completadas: ${tareas.length - pend}`);
                return;
            }
            if (filtro === "settings") {
                alert("AJUSTES TICs\n━━━━━━━━━━━━━━━━\n• Los datos se guardan automáticamente\n• Usa el botón 'Restaurar Demo' en el footer\n• Versión 1.0 - Gestión de Tareas");
                return;
            }

            if (filtro === "all") filtroActivo = "all";
            else if (filtro === "pending") filtroActivo = "pending";
            else if (filtro === "completed") filtroActivo = "completed";

            links.forEach(l => l.classList.remove("active-filter"));
            link.classList.add("active-filter");
            renderizarTareas();
        });
    });
}

function agregarBotonReset() {
    const footer = document.querySelector(".app-footer");
    if (footer && !document.getElementById("resetDataBtn")) {
        const resetBtn = document.createElement("button");
        resetBtn.id = "resetDataBtn";
        resetBtn.textContent = "🔄 Restaurar Demo TICs";
        resetBtn.style.cssText = "background:#eef2fa; border:1px solid #bdd4e7; border-radius:40px; padding:4px 12px; font-size:0.7rem; cursor:pointer; margin-left:12px;";
        resetBtn.addEventListener("click", () => {
            if (confirm("🔄 ¿Restaurar tareas de ejemplo con temática TICs?\nSe perderán los cambios actuales.")) {
                tareas = [
                    { id: 1, nombre: "Analizar Funcionamiento de Redes", prioridad: "Media", fecha: "2024-05-24", completada: true },
                    { id: 2, nombre: "Diseñar la interfaz de la app", prioridad: "Alta", fecha: "2024-05-24", completada: true },
                    { id: 3, nombre: "Actualizar Drivers", prioridad: "Baja", fecha: "2024-05-23", completada: true },
                    { id: 4, nombre: "Enviar Reportes de Seguridad", prioridad: "Baja", fecha: "2024-05-25", completada: true },
                    { id: 5, nombre: "Comprar insumos TI", prioridad: "Media", fecha: "2024-05-23", completada: true }
                ];
                guardarEnLocalStorage();
                filtroActivo = "all";
                const linkAll = document.querySelector('.categorias-nav a[data-filter="all"]');
                if (linkAll) {
                    document.querySelectorAll(".categorias-nav a").forEach(l => l.classList.remove("active-filter"));
                    linkAll.classList.add("active-filter");
                }
                renderizarTareas();
                alert("Tareas restauradas correctamente");
            }
        });
        footer.appendChild(resetBtn);
    }
}

// inicializacion
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosIniciales();
    const fechaInput = document.getElementById("taskDateInput");
    if (fechaInput && !fechaInput.value) fechaInput.value = obtenerFechaActualISO();

    document.getElementById("addTaskBtn").addEventListener("click", agregarTarea);
    document.getElementById("taskNameInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") agregarTarea();
    });

    inicializarFiltros();
    renderizarTareas();
    agregarBotonReset();
});