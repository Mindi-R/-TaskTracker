const inputBox = document.getElementById('todo-input');
const listContainer = document.getElementById('list-container');
const completedCounter = document.getElementById('completed-counter');
const uncompletedCounter = document.getElementById('uncompleted-counter');
const deleteAllBtn = document.getElementById('delete-all');

function updateCounter(){
    const completedTasks = document.querySelectorAll('.completed').length;
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}

function addTask(){
    const task=inputBox.value.trim();
    if(!task){
        alert('Please enter a task');
        return;
    }

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const timestamp = ` ${date} at ${time}`;

    const li = document.createElement('li');

    li.innerHTML = `
        <label>
            <input type="checkbox">
            <span>${task}</span>
        </label>
        <div class="task-meta">
            <span class="timestamp">Created on: ${timestamp}</span>
        </div>
        <span class="edit-btn">Edit</span>
        <span class="delete-btn">Delete</span>`
    ;

    const checkbox=li.querySelector("input")
    const editBtn=li.querySelector(".edit-btn")
    const deleteBtn=li.querySelector(".delete-btn")
    const taskSpan=li.querySelector("span")

    checkbox.addEventListener('click', function(){
        li.classList.toggle('completed',checkbox.checked);
        updateCounter();
        saveTasksToLocalStorage();
    });
    

    editBtn.addEventListener('click', function(){
        const update = prompt('Enter new task',taskSpan.textContent);
        if(update !== null){
            taskSpan.textContent=update;
            li.classList.remove('completed');
            checkbox.checked=false;
            updateCounter();
            saveTasksToLocalStorage();
        }
    });

    deleteBtn.addEventListener('click', function(){
        if(confirm('Are you sure you want to delete this task?')){
            li.remove();
            updateCounter();
            saveTasksToLocalStorage();
        }
    });    
    listContainer.appendChild(li);
    inputBox.value = '';
    updateCounter();
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage(){
    const tasks = [];
    document.querySelectorAll('li').forEach(task => {
        tasks.push({
            text: task.querySelector('span').textContent,
            completed: task.querySelector('input').checked,
            timestamp: task.querySelector('.timestamp').textContent
        });
});
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

window.onload = function() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <label>
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span>${task.text}</span>
                </label>
                <div class="task-meta">
                    <span class="timestamp">${task.timestamp}</span>
                </div>
                <span class="edit-btn">Edit</span>
                <span class="delete-btn">Delete</span>`
            ;

            if (task.completed) {
                li.classList.add('completed');
            }

            const checkbox = li.querySelector("input");
            const editBtn = li.querySelector(".edit-btn");
            const deleteBtn = li.querySelector(".delete-btn");

            checkbox.addEventListener('click', function(){
                li.classList.toggle('completed', checkbox.checked);
                updateCounter();
                saveTasksToLocalStorage();
            });

            editBtn.addEventListener('click', function(){
                const update = prompt('Enter new task', task.text);
                if (update !== null) {
                    task.text = update;
                    li.querySelector('span').textContent = update;
                    li.classList.remove('completed');
                    checkbox.checked = false;
                    updateCounter();
                    saveTasksToLocalStorage();
                }
            });

            deleteBtn.addEventListener('click', function(){
                if (confirm('Are you sure you want to delete this task?')) {
                    li.remove();
                    updateCounter();
                    saveTasksToLocalStorage();
                }
            });

            listContainer.appendChild(li);
        });
        updateCounter();
    }
};

deleteAllBtn.addEventListener('click', function(){
    if(confirm('Are you sure you want to delete all tasks?')){
        listContainer.innerHTML='';
        localStorage.removeItem('tasks');
        updateCounter();

    }
});                           
