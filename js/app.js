import { loadTasks, saveTasks } from "./storage.js";

const form = document.querySelector("form");
const taskInput = document.querySelector("#new-task");
const taskList = document.querySelector("#task-list");
let tasks = loadTasks();

function renderTask(task) {
	const taskItem = document.createElement("li");
	const taskLabel = document.createElement("label");
	const taskCheckbox = document.createElement("input");
	const deleteButton = document.createElement("button");

	taskCheckbox.type = "checkbox";
	taskCheckbox.checked = task.completed;
	taskLabel.appendChild(taskCheckbox);
	taskLabel.appendChild(document.createTextNode(task.text));
	taskItem.appendChild(taskLabel);

	deleteButton.type = "button";
	deleteButton.textContent = "Usuń";
	deleteButton.className = "delete-button";
	taskItem.appendChild(deleteButton);

	taskItem.classList.toggle("completed", task.completed);

	taskCheckbox.addEventListener("change", function () {
		task.completed = taskCheckbox.checked;
		taskItem.classList.toggle("completed", task.completed);
		saveTasks(tasks);
	});

	deleteButton.addEventListener("click", function () {
		tasks = tasks.filter(function (currentTask) {
			return currentTask !== task;
		});
		taskItem.remove();
		saveTasks(tasks);
	});

	taskList.appendChild(taskItem);
}

tasks.forEach(renderTask);

form.addEventListener("submit", function (event) {
	event.preventDefault();

	const taskText = taskInput.value.trim();

	if (taskText === "") {
		return;
	}

	const newTask = {
		text: taskText,
		completed: false
	};

	tasks.push(newTask);
	renderTask(newTask);
	saveTasks(tasks);

	taskInput.value = "";
});
