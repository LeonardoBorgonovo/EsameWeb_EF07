document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterStatus = document.getElementById('filter-status');
    const searchTaskInput = document.getElementById('search-task');

    let tasks = loadTasks();
    renderTasks(tasks);

    addTaskButton.addEventListener('click', addTask);
    filterStatus.addEventListener('change', () => renderTasks(filterTasks()));
    searchTaskInput.addEventListener('input', () => renderTasks(filterTasks()));

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
        const taskName = taskInput.value.trim();
        if (taskName !== '') {
            const newTask = {
                id: Date.now(),
                name: taskName,
                status: 'da-fare'
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks(filterTasks());
            taskInput.value = '';
        }
    }

    function removeTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(filterTasks());
    }

    function startEditTask(id) {
        const taskItem = taskList.querySelector(`li[data-id="${id}"]`);
        const task = tasks.find(task => task.id === id);
        if (taskItem && task) {
            taskItem.innerHTML = `
                <div class="editing">
                    <input type="text" value="${task.name}">
                    <button class="save-btn" data-id="${id}">Salva</button>
                    <button class="cancel-btn" data-id="${id}">Annulla</button>
                </div>
            `;
            const saveButton = taskItem.querySelector('.save-btn');
            const cancelButton = taskItem.querySelector('.cancel-btn');
            saveButton.addEventListener('click', () => saveEditTask(id, taskItem.querySelector('input').value));
            cancelButton.addEventListener('click', () => renderTasks(filterTasks()));
        }
    }

    function saveEditTask(id, newName) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.name = newName.trim();
            saveTasks();
            renderTasks(filterTasks());
        }
    }

    function changeTaskStatus(id, newStatus) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.status = newStatus;
            saveTasks();
            renderTasks(filterTasks());
        }
    }

    function filterTasks() {
        const selectedStatus = filterStatus.value;
        const searchTerm = searchTaskInput.value.toLowerCase().trim();

        return tasks.filter(task => {
            const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
            const searchMatch = task.name.toLowerCase().includes(searchTerm);
            return statusMatch && searchMatch;
        });
    }

    function renderTasks(taskListToRender) {
        taskList.innerHTML = '';
        taskListToRender.forEach(task => {
            const listItem = document.createElement('li');
            listItem.dataset.id = task.id;
            listItem.innerHTML = `
                <div class="task-details">
                    <span class="task-name">${task.name}</span>
                    <span class="task-status ${task.status}">${task.status.replace('-', ' ')}</span>
                </div>
                <div class="actions">
                    <select class="status-select" data-id="${task.id}">
                        <option value="da-fare" ${task.status === 'da-fare' ? 'selected' : ''}>Da Fare</option>
                        <option value="in-corso" ${task.status === 'in-corso' ? 'selected' : ''}>In Corso</option>
                        <option value="completata" ${task.status === 'completata' ? 'selected' : ''}>Completata</option>
                    </select>
                    <button class="edit-btn" data-id="${task.id}">Modifica</button>
                    <button class="delete-btn" data-id="${task.id}">Elimina</button>
                </div>
            `;
            const deleteButton = listItem.querySelector('.delete-btn');
            const editButton = listItem.querySelector('.edit-btn');
            const statusSelect = listItem.querySelector('.status-select');

            deleteButton.addEventListener('click', () => removeTask(task.id));
            editButton.addEventListener('click', () => startEditTask(task.id));
            statusSelect.addEventListener('change', (event) => changeTaskStatus(task.id, event.target.value));

            taskList.appendChild(listItem);
        });
    }
});