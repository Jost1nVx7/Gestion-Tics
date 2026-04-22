<<<<<<< HEAD
// elementos dom
const taskInput = document.getElementById('inputTarea');
const prioritySelect = document.getElementById('inputPrioridad');
const dateInput = document.getElementById('inputfecha');
const addButton = document.getElementById('BtnTarea');
const taskList = document.getElementById('listaTareas');
=======
<<<<<<< HEAD
=======
let tareas = [];
>>>>>>> ac5f8b9fa16c4818c7f9c944e437b3165b72d76f

// contadores
const totalCountSpan = document.getElementById('total');
const pendingCountSpan = document.getElementById('pendientes');
const completedCountSpan = document.getElementById('completadas');

// filtros
const filterAllBtn = document.getElementById('BtnTodas');
const filterPendingBtn = document.getElementById('BtnPendientes');
const filterCompletedBtn = document.getElementById('BtnCompletas');

// estado
let tasks = [];           
let currentFilter = 'all'; 

// funciones auxiliaees
function saveTasksToLocalStorage() {
    localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
}

// cargar tareas 
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('taskManagerTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // datos ejemplo
        const today = new Date().toISOString().slice(0,10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
        tasks = [
            {
                id: Date.now() + 1,
                text: 'Revisar documentación de JavaScript',
                priority: 'Alta',
                date: today,
                completed: false
            },
            {
                id: Date.now() + 2,
                text: 'Preparar presentación semanal',
                priority: 'Media',
                date: tomorrow,
                completed: false
            },
            {
                id: Date.now() + 3,
                text: 'Actualizar el repositorio',
                priority: 'Baja',
                date: '',
                completed: true
            }
        ];
        saveTasksToLocalStorage();
    }
}

// actualizar contadores
function updateCounters() {
    const total = tasks.length;
    const pending = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;
    
    totalCountSpan.textContent = total;
    pendingCountSpan.textContent = pending;
    completedCountSpan.textContent = completed;
}

// fecha formateo
function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

// lamma css
function getPriorityClass(priority) {
    switch(priority) {
        case 'Alta': return 'priority-high';
        case 'Media': return 'priority-medium';
        case 'Baja': return 'priority-low';
        default: return '';
    }
}

// icono prioridad
function getPriorityIcon(priority) {
    switch(priority) {
        case 'Alta': return '^';
        case 'Media': return '>';
        case 'Baja': return 'V';
        default: return '';
    }
}

// cambio estado tarea
function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToLocalStorage();
        renderTasks();      
        updateCounters();
    }
}

// borrar tareas
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage();
    renderTasks();
    updateCounters();
}

//
function renderTasks() {
    // Filtrar tareas según el estado actual
    let filteredTasks = [...tasks];
    if (currentFilter === 'pending') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    // limpiar lista
    taskList.innerHTML = '';
    
    // mensaje d sin tareas
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No hay tareas que mostrar.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#888';
        emptyMessage.style.padding = '20px';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // generar tarea
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('task-completed');
        li.setAttribute('data-id', task.id);
        
        // contenedor izquierdo
        const infoDiv = document.createElement('div');
        infoDiv.className = 'task-info';
        
        // texto de la tarea
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;
        
        // prioridad con estilo
        const prioritySpan = document.createElement('span');
        prioritySpan.className = `task-priority ${getPriorityClass(task.priority)}`;
        prioritySpan.textContent = `${getPriorityIcon(task.priority)} ${task.priority}`;
        
        // Fecha
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.innerHTML = `<i class="fa-regular fa-calendar"></i> ${formatDate(task.date)}`;
        
        infoDiv.appendChild(taskTextSpan);
        infoDiv.appendChild(prioritySpan);
        infoDiv.appendChild(dateSpan);
        
        //contenedor derecho
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        // checkbox compoletado
        const completeCheckbox = document.createElement('input');
        completeCheckbox.type = 'checkbox';
        completeCheckbox.checked = task.completed;
        completeCheckbox.className = 'task-checkbox';
        completeCheckbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
        });
        
        // eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'task-delete-btn';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        actionsDiv.appendChild(completeCheckbox);
        actionsDiv.appendChild(deleteButton);
        
        li.appendChild(infoDiv);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    });
}

// new task
function addNewTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Por favor, escribe una descripción para la tarea.');
        return;
    }
    
    const priority = prioritySelect.value;
    const date = dateInput.value;
    
    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        date: date || '',   
        completed: false
    };
    
    tasks.push(newTask);
    saveTasksToLocalStorage();
    
    // limpiar campos
    taskInput.value = '';
    prioritySelect.value = 'Media';
    dateInput.value = '';
    
    // actualiza contenedores
    renderTasks();
    updateCounters();
    
    // texto claro
    taskInput.focus();
}

// config filtres
function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
    // actualiza  botones
    [filterAllBtn, filterPendingBtn, filterCompletedBtn].forEach(btn => btn.classList.remove('active-filter'));
    if (filter === 'all') filterAllBtn.classList.add('active-filter');
    if (filter === 'pending') filterPendingBtn.classList.add('active-filter');
    if (filter === 'completed') filterCompletedBtn.classList.add('active-filter');
}

// 
function initEventListeners() {
    addButton.addEventListener('click', addNewTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewTask();
    });
    
    filterAllBtn.addEventListener('click', () => setFilter('all'));
    filterPendingBtn.addEventListener('click', () => setFilter('pending'));
    filterCompletedBtn.addEventListener('click', () => setFilter('completed'));
}

// estilos dinamicos
function injectCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos para los items de tarea */
        .task-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            transition: all 0.2s ease;
        }
        .task-info {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        .task-text {
            font-weight: 500;
            min-width: 150px;
        }
        .task-priority {
            font-size: 0.85rem;
            padding: 4px 8px;
            border-radius: 20px;
            background-color: #f0f0f0;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .priority-high {
            background-color: #ffe0e0;
            color: #c0392b;
            border-left: 3px solid #e74c3c;
        }
        .priority-medium {
            background-color: #fff4e0;
            color: #e67e22;
            border-left: 3px solid #f39c12;
        }
        .priority-low {
            background-color: #e0f7e8;
            color: #27ae60;
            border-left: 3px solid #2ecc71;
        }
        .task-date {
            font-size: 0.8rem;
            color: #666;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .task-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .task-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #2ecc71;
        }
        .task-delete-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            color: #e74c3c;
            transition: transform 0.1s;
            padding: 4px 6px;
            border-radius: 4px;
        }
        .task-delete-btn:hover {
            background-color: #fee;
            transform: scale(1.05);
        }
        .task-completed .task-text {
            text-decoration: line-through;
            color: #888;
        }
        .task-completed .task-priority {
            opacity: 0.7;
        }
        /* Botones de filtro activos */
        .filtros button.active-filter {
            background-color: #3498db;
            color: white;
            border-color: #2980b9;
        }
        .filtros button {
            transition: all 0.2s;
            cursor: pointer;
        }
        .filtros button:hover {
            background-color: #e0e0e0;
        }
        /* Ajustes responsive en lista */
        @media (max-width: 768px) {
            .task-info {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            .task-actions {
                align-self: flex-end;
            }
            .task-item {
                align-items: flex-start;
            }
        }
    `;
    document.head.appendChild(style);
}

// inicio de app
function initApp() {
    loadTasksFromLocalStorage();
    initEventListeners();
    injectCustomStyles();
    setFilter('all');      //actualiza botrones
    updateCounters();
}

<<<<<<< HEAD
// inicializa con el DOM
document.addEventListener('DOMContentLoaded', initApp);
=======
// reincertacion de js
>>>>>>> OswaldoBifariniDev
>>>>>>> ac5f8b9fa16c4818c7f9c944e437b3165b72d76f
