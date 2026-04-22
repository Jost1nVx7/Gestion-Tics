let tareas = [];

function guardarDatos() {
    localStorage.setItem('tareasTIC', JSON.stringify(tareas));
}

function cargarDatos() {
    const data = localStorage.getItem('tareasTIC');
    if (data) {
        tareas = JSON.parse(data);
    } else {
        tareas = [
            { id: 1, nombre: "Analizar Funcionamiento de Redes", prioridad: "Media", fecha: "2024-05-24", completada: true },
            { id: 2, nombre: "Diseñar la interfaz de la app", prioridad: "Alta", fecha: "2024-05-24", completada: true },
            { id: 3, nombre: "Actualizar Drivers", prioridad: "Baja", fecha: "2024-05-23", completada: true },
            { id: 4, nombre: "Enviar Reportes de Seguridad", prioridad: "Baja", fecha: "2024-05-25", completada: true },
            { id: 5, nombre: "Comprar insumos TI", prioridad: "Media", fecha: "2024-05-23", completada: true }
        ];
        guardarDatos();
    }
}

let filtro = "todas";

function formatearFecha(iso) {
    if (!iso) return "dd/mm/aaaa";
    let partes = iso.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function fechaActual() {
    let hoy = new Date();
    let año = hoy.getFullYear();
    let mes = String(hoy.getMonth() + 1).padStart(2, '0');
    let dia = String(hoy.getDate()).padStart(2, '0');
    return año + "-" + mes + "-" + dia;
}

function actualizarContadores() {
    let total = tareas.length;
    let pendientes = 0;
    let completadas = 0;
    
    for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].completada) {
            completadas++;
        } else {
            pendientes++;
        }
    }
    
    document.getElementById("total").innerText = total;
    document.getElementById("pendientes").innerText = pendientes;
    document.getElementById("completadas").innerText = completadas;
}

function mostrarTareas() {
    let lista = document.getElementById("listaTareas");
    let tareasMostrar = [];
    
    if (filtro === "pendientes") {
        for (let i = 0; i < tareas.length; i++) {
            if (!tareas[i].completada) tareasMostrar.push(tareas[i]);
        }
    } else if (filtro === "completadas") {
        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i].completada) tareasMostrar.push(tareas[i]);
        }
    } else {
        tareasMostrar = tareas;
    }
    
    if (tareasMostrar.length === 0) {
        lista.innerHTML = "<li>No hay tareas</li>";
        actualizarContadores();
        return;
    }
    
    let html = "";
    for (let i = 0; i < tareasMostrar.length; i++) {
        let t = tareasMostrar[i];
        let textoCompleta = t.completada ? "line-through" : "none";
        let icono = t.completada ? "[X]" : "[ ]";
        let colorPrioridad = "";
        
        if (t.prioridad === "Alta") colorPrioridad = "#ff4444";
        else if (t.prioridad === "Media") colorPrioridad = "#ffaa00";
        else colorPrioridad = "#44aa00";
        
        html += "<li style='margin: 10px 0; padding: 10px; border: 1px solid #ddd; list-style: none;'>";
        html += "<div style='display: flex; justify-content: space-between; align-items: center;'>";
        html += "<div style='flex: 1;'>";
        html += "<span style='text-decoration: " + textoCompleta + ";'>" + t.nombre + "</span>";
        html += "<span style='margin-left: 10px; background: " + colorPrioridad + "; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;'>" + t.prioridad + "</span>";
        html += "<span style='margin-left: 10px; font-size: 12px; color: #666;'>" + formatearFecha(t.fecha) + "</span>";
        html += "</div>";
        html += "<div>";
        html += "<button onclick='toggleTarea(" + t.id + ")' style='margin: 0 5px; cursor: pointer;'>" + icono + "</button>";
        html += "<button onclick='eliminarTarea(" + t.id + ")' style='margin: 0 5px; cursor: pointer;'>[X]</button>";
        html += "</div>";
        html += "</div>";
        html += "</li>";
    }
    
    lista.innerHTML = html;
    actualizarContadores();
}

function agregarTarea() {
    let nombre = document.getElementById("inputTarea").value.trim();
    let prioridad = document.getElementById("inputPrioridad").value;
    let fecha = document.getElementById("inputfecha").value;
    
    if (nombre === "") {
        alert("Escribe una tarea");
        return;
    }
    
    if (fecha === "") fecha = fechaActual();
    
    let nuevoId = 1;
    for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].id >= nuevoId) nuevoId = tareas[i].id + 1;
    }
    
    tareas.push({
        id: nuevoId,
        nombre: nombre,
        prioridad: prioridad,
        fecha: fecha,
        completada: false
    });
    
    guardarDatos();
    document.getElementById("inputTarea").value = "";
    document.getElementById("inputfecha").value = "";
    mostrarTareas();
}

function toggleTarea(id) {
    for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].id === id) {
            tareas[i].completada = !tareas[i].completada;
            break;
        }
    }
    guardarDatos();
    mostrarTareas();
}

function eliminarTarea(id) {
    if (confirm("Eliminar tarea?")) {
        let nuevasTareas = [];
        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i].id !== id) nuevasTareas.push(tareas[i]);
        }
        tareas = nuevasTareas;
        guardarDatos();
        mostrarTareas();
    }
}

function inicializar() {
    cargarDatos();
    
    let fechaInput = document.getElementById("inputfecha");
    if (fechaInput && fechaInput.value === "") fechaInput.value = fechaActual();
    
    document.getElementById("BtnTarea").onclick = agregarTarea;
    
    document.getElementById("BtnTodas").onclick = function() {
        filtro = "todas";
        mostrarTareas();
    };
    
    document.getElementById("BtnPendientes").onclick = function() {
        filtro = "pendientes";
        mostrarTareas();
    };
    
    document.getElementById("BtnCompletas").onclick = function() {
        filtro = "completadas";
        mostrarTareas();
    };
    
    document.getElementById("inputTarea").onkeypress = function(e) {
        if (e.key === "Enter") agregarTarea();
    };
    
    let menuItems = document.querySelectorAll('.contenedor1 p');
    for (let i = 0; i < menuItems.length; i++) {
        let texto = menuItems[i].innerText.toLowerCase();
        menuItems[i].style.cursor = "pointer";
        menuItems[i].onclick = function() {
            if (texto.includes("pendientes")) {
                filtro = "pendientes";
                mostrarTareas();
            } else if (texto.includes("completadas")) {
                filtro = "completadas";
                mostrarTareas();
            } else if (texto.includes("todas")) {
                filtro = "todas";
                mostrarTareas();
            } else if (texto.includes("calendario")) {
                alert("Calendario - Proximamente");
            } else if (texto.includes("estadisticas")) {
                let pend = 0, comp = 0;
                for (let j = 0; j < tareas.length; j++) {
                    if (tareas[j].completada) comp++;
                    else pend++;
                }
                alert("Total: " + tareas.length + "\nPendientes: " + pend + "\nCompletadas: " + comp);
            } else if (texto.includes("ajustes")) {
                alert("Ajustes - Datos guardados automaticamente");
            }
        };
    }
    
    let todasFieldset = document.querySelector('.contenedor1 fieldset');
    if (todasFieldset) {
        todasFieldset.style.cursor = "pointer";
        todasFieldset.onclick = function() {
            filtro = "todas";
            mostrarTareas();
        };
    }
    
    mostrarTareas();
}

document.addEventListener("DOMContentLoaded", inicializar);