const taskInput = document.getElementById('inputTarea');
const prioritySelect = document.getElementById('inputPrioridad');
const dateInput = document.getElementById('inputFecha');
const addBtn = document.getElementById('BtnTarea');
const taskList = document.getElementById('listaTareas');
const totalSpan = document.getElementById('total');
const pendientesSpan = document.getElementById('pendientes');
const completadasSpan = document.getElementById('completadas');
const filterAll = document.getElementById('BtnTodas');
const filterPending = document.getElementById('BtnPendientes');
const filterCompleted = document.getElementById('BtnCompletas');

let tasks = [];
let currentFilter = 'all';

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function load() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        tasks = [
            { id: Date.now() + 1, text: 'Revisar JS', priority: 'Alta', date: '2025-04-22', completed: false },
            { id: Date.now() + 2, text: 'Preparar presentación', priority: 'Media', date: '2025-04-23', completed: false },
            { id: Date.now() + 3, text: 'Actualizar repo', priority: 'Baja', date: '', completed: true }
        ];
        save();
    }
}

function updateCounters() {
    const total = tasks.length;
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    totalSpan.innerText = total;
    pendientesSpan.innerText = pending;
    completadasSpan.innerText = completed;
}

function render() {
    let filtered = tasks;
    if (currentFilter === 'pending') filtered = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

    taskList.innerHTML = '';
    if (filtered.length === 0) {
        taskList.innerHTML = '<li style="text-align:center;color:#888;">No hay tareas</li>';
        return;
    }

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.flexWrap = 'wrap';
        li.style.gap = '10px';
        if (task.completed) li.style.textDecoration = 'line-through';
        li.style.opacity = task.completed ? '0.7' : '1';

        const info = document.createElement('div');
        info.style.display = 'flex';
        info.style.gap = '12px';
        info.style.alignItems = 'center';
        info.style.flexWrap = 'wrap';

        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;

        const prioritySpan = document.createElement('span');
        prioritySpan.textContent = task.priority;
        prioritySpan.style.padding = '4px 8px';
        prioritySpan.style.borderRadius = '20px';
        prioritySpan.style.fontSize = '0.8rem';
        if (task.priority === 'Alta') prioritySpan.style.backgroundColor = '#ffe0e0';
        else if (task.priority === 'Media') prioritySpan.style.backgroundColor = '#fff4e0';
        else prioritySpan.style.backgroundColor = '#e0f7e8';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = task.date ? task.date.slice(0,10) : 'Sin fecha';
        dateSpan.style.fontSize = '0.8rem';
        dateSpan.style.color = '#666';

        info.appendChild(textSpan);
        info.appendChild(prioritySpan);
        info.appendChild(dateSpan);

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            save();
            render();
            updateCounters();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.background = 'none';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '1.1rem';
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            save();
            render();
            updateCounters();
        });

        actions.appendChild(checkbox);
        actions.appendChild(deleteBtn);
        li.appendChild(info);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert('Escribe una tarea');
    const newTask = {
        id: Date.now(),
        text: text,
        priority: prioritySelect.value,
        date: dateInput.value,
        completed: false
    };
    tasks.push(newTask);
    save();
    render();
    updateCounters();
    taskInput.value = '';
    prioritySelect.value = 'Media';
    dateInput.value = '';
    taskInput.focus();
}

function setFilter(filter) {
    currentFilter = filter;
    render();
    [filterAll, filterPending, filterCompleted].forEach(btn => btn.classList.remove('active'));
    if (filter === 'all') filterAll.classList.add('active');
    if (filter === 'pending') filterPending.classList.add('active');
    if (filter === 'completed') filterCompleted.classList.add('active');
}

load();
render();
updateCounters();
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
filterAll.addEventListener('click', () => setFilter('all'));
filterPending.addEventListener('click', () => setFilter('pending'));
filterCompleted.addEventListener('click', () => setFilter('completed'));
filterAll.classList.add('active');