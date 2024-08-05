// Wait for the DOM content to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve tasks from local storage
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    // If there are stored tasks, load them into the application
    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task));
        updateTaskslist();
        updateStats();
    }
});

// Array to hold tasks
let tasks = [];

// Function to save tasks to local storage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to add a new task
const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    // Check if the input is not empty
    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = ""; // Clear the input field
        updateTaskslist(); // Update the task list
        updateStats(); // Update the statistics
        saveTasks(); // Save tasks to local storage
    }
};

// Function to toggle the completion status of a task
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskslist();
    updateStats();
    saveTasks();
};

// Function to delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskslist();
    updateStats();
    saveTasks();
};

// Function to edit a task
const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text; // Set the input field with the task text

    tasks.splice(index, 1); // Remove the task from the list
    updateTaskslist();
    updateStats();
    saveTasks();
};

// Function to update statistics
const updateStats = () => {
    const completeTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById("progress");

    progressBar.style.width = `${progress}%`;
    document.getElementById("numbers").innerText = `${completeTasks} / ${totalTasks}`;

    // If all tasks are complete, celebrate with confetti!
    if (tasks.length && completeTasks === totalTasks) {
        blastConfetti();
    }
};

// Function to update the task list display
const updateTaskslist = () => {
    const tasklist = document.getElementById("task-list");
    tasklist.innerHTML = ""; // Clear the current list

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("taskItem");

        // Create the task item HTML with edit and delete icons
        listItem.innerHTML = `
            <div class="task ${task.completed ? "completed" : ""}">
                <input type="checkbox" class="checkbox" ${
                    task.completed ? "checked" : ""
                }/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="./icons/edit-icon.png" alt="Edit" onclick="editTask(${index})" />
                <img src="./icons/bin.png" alt="Delete" onclick="deleteTask(${index})" />
            </div>
        `;

        // Add event listener to toggle completion on checkbox change
        listItem.querySelector(".checkbox").addEventListener("change", () =>
            toggleTaskComplete(index)
        );

        tasklist.appendChild(listItem);
    });
};

// Add event listener to the form to handle task submission
document.getElementById("taskForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
    addTask(); // Add the task
});

// Function to trigger confetti animation when all tasks are completed
const blastConfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};
