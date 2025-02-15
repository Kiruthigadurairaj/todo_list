let today = [], future = [], complete = [];
const taskInput = document.querySelector('.task-input');
const dateInput = document.querySelector('.date-input');
const prioritySelect = document.getElementById('task-priority');
const addTaskBtn = document.getElementById('add-task-btn');

function sortByPriority(tasks) {
    return tasks.sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority]));
}

function updateLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify([...today, ...future, ...complete]));
}

function retrieveFromLocalStorage() {
    const storedData = JSON.parse(localStorage.getItem('todoList')) || [];
    const todayDate = new Date().setHours(0, 0, 0, 0);
    today = [], future = [], complete = [];
    storedData.forEach(item => {
        const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
        if (!item.complete && itemDate === todayDate) today.push(item);
        else if (!item.complete && itemDate > todayDate) future.push(item);
        else if (item.complete) complete.push(item);
    });
}

window.addEventListener('load', () => {
    retrieveFromLocalStorage();
    renderTasks();
});

addTaskBtn.addEventListener('click', () => {
    const selectedDate = new Date(dateInput.value).setHours(0, 0, 0, 0);
    const todayDate = new Date().setHours(0, 0, 0, 0);
    if (!taskInput.value || !dateInput.value || !prioritySelect.value) {
        alert('Please Enter all details');
    } else if (selectedDate > todayDate) {
        future.push({ name: taskInput.value, date: dateInput.value, priority: prioritySelect.value, complete: false });
    } else if (selectedDate === todayDate) {
        today.push({ name: taskInput.value, date: dateInput.value, priority: prioritySelect.value, complete: false });
    } else {
        alert('You cannot enter a past date');
    }
    renderTasks();
    updateLocalStorage();
});

function renderTasks() {
    const todayContainer = document.querySelector('.task-container-today');
    const futureContainer = document.querySelector('.task-container-future');
    const completedContainer = document.querySelector('.task-container-completed');
    todayContainer.innerHTML = futureContainer.innerHTML = completedContainer.innerHTML = '';

    sortByPriority(today).forEach((item, index) => {
        todayContainer.innerHTML += createTaskHTML(item, index + 1, 'today');
    });
    sortByPriority(future).forEach((item, index) => {
        futureContainer.innerHTML += createTaskHTML(item, index + 1, 'future');
    });
    sortByPriority(complete).forEach((item, index) => {
        completedContainer.innerHTML += createTaskHTML(item, index + 1, 'complete', true);
    });

    addEventListeners();
}

function createTaskHTML(item, index, type, isCompleted = false) {
    return `
        <div class="task-box ${isCompleted ? 'completed' : 'today'}">
            <div>${index}. ${item.name}</div>
            <div>${formatDate(item.date)}</div>
            <div>${capitalizeFirstLetter(item.priority)}</div>
            <div>
                ${isCompleted ? '' : `<button class="complete" data-type="${type}" data-index="${index - 1}">✔</button>`}
                 <button class="delete" data-type="${type}" data-index="${index - 1}">🗑️</button>
            </div>
        </div>
    `;
}

function addEventListeners() {
    document.querySelectorAll('.complete').forEach(button => {
        button.addEventListener('click', function () {
            const type = this.dataset.type;
            const index = this.dataset.index;
            const task = type === 'today' ? today.splice(index, 1)[0] : future.splice(index, 1)[0];
            task.complete = true;
            complete.push(task);
            renderTasks();
            updateLocalStorage();
        });
    });

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', function () {
            const type = this.dataset.type;
            const index = this.dataset.index;
            if (type === 'today') today.splice(index, 1);
            else if (type === 'future') future.splice(index, 1);
            else if (type === 'complete') complete.splice(index, 1);
            renderTasks();
            updateLocalStorage();
        });
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}