/**
 * @file Script per implementare una semplice applicazione Todo List con funzionalità di aggiunta,
 * rimozione, modifica, cambio di stato, filtraggio e ricerca di task.
 * I task sono persistiti utilizzando il Local Storage del browser.
 */

/**
 * @listens document:DOMContentLoaded
 * @description Attende che il DOM sia completamente caricato prima di inizializzare l'applicazione Todo List.
 */

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

    /**
     * @function loadTasks
     * @description Carica i task salvati nel Local Storage del browser.
     * @returns {Array<object>} Un array di task caricati, o un array vuoto se non ci sono task salvati.
     */

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    /**
     * @function saveTasks
     * @description Salva l'array corrente di task nel Local Storage del browser come una stringa JSON.
     * @returns {void}
     */

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * @function addTask
     * @description Aggiunge un nuovo task alla lista. Recupera il testo dall'input, crea un nuovo oggetto task,
     * lo aggiunge all'array `tasks`, salva la lista aggiornata e renderizza la lista filtrata.
     * @returns {void}
     */

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
    
    /**
     * @function removeTask
     * @description Rimuove un task dalla lista in base al suo ID. Filtra l'array `tasks`,
     * salva la lista aggiornata e renderizza la lista filtrata.
     * @param {number} id - L'ID del task da rimuovere.
     * @returns {void}
     */

    function removeTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(filterTasks());
    }

    /**
     * @function startEditTask
     * @description Inizia la modalità di modifica per un task specifico. Sostituisce il contenuto dell'elemento
     * del task con un input di testo e i pulsanti "Salva" e "Annulla".
     * @param {number} id - L'ID del task da modificare.
     * @returns {void}
     */

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

    /**
     * @function saveEditTask
     * @description Salva le modifiche apportate al nome di un task. Aggiorna l'array `tasks`,
     * salva la lista aggiornata e renderizza la lista filtrata.
     * @param {number} id - L'ID del task modificato.
     * @param {string} newName - Il nuovo nome del task.
     * @returns {void}
     */

    function saveEditTask(id, newName) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.name = newName.trim();
            saveTasks();
            renderTasks(filterTasks());
        }
    }

    /**
     * @function changeTaskStatus
     * @description Cambia lo stato di un task specifico. Aggiorna l'array `tasks`,
     * salva la lista aggiornata e renderizza la lista filtrata.
     * @param {number} id - L'ID del task da modificare.
     * @param {string} newStatus - Il nuovo stato del task ('da-fare', 'in-corso', 'completata').
     * @returns {void}
     */

    function changeTaskStatus(id, newStatus) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.status = newStatus;
            saveTasks();
            renderTasks(filterTasks());
        }
    }

    /**
     * @function filterTasks
     * @description Filtra l'array `tasks` in base allo stato selezionato e al termine di ricerca.
     * @returns {Array<object>} Un nuovo array contenente i task filtrati.
     */

    function filterTasks() {
        const selectedStatus = filterStatus.value;
        const searchTerm = searchTaskInput.value.toLowerCase().trim();

        return tasks.filter(task => {
            const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
            const searchMatch = task.name.toLowerCase().includes(searchTerm);
            return statusMatch && searchMatch;
        });
    }

     /**
     * @function renderTasks
     * @description Renderizza la lista dei task nell'elemento `taskList` del DOM.
     * @param {Array<object>} taskListToRender - L'array di task da visualizzare.
     * @returns {void}
     */

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