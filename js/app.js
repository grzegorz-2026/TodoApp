import { loadTasks, saveTasks } from "./storage.js";
import { addTask, toggleTask, removeTask } from "./tasks.js";
import { renderTask } from "./ui.js";

const form = document.querySelector("form");
const taskInput = document.querySelector("#new-task");
let tasks = loadTasks();

function handleToggle(task) {
	const taskIndex = tasks.indexOf(task);
	tasks = toggleTask(tasks, task);
	saveTasks(tasks);
	return tasks[taskIndex];
}

function handleDelete(task) {
	tasks = removeTask(tasks, task);
	saveTasks(tasks);
}

const taskCallbacks = {
	onToggle: handleToggle,
	onDelete: handleDelete
};

tasks.forEach(function (task) {
	renderTask(task, taskCallbacks);
});

form.addEventListener("submit", function (event) {
	event.preventDefault();

	const taskText = taskInput.value.trim();

	if (taskText === "") {
		return;
	}

	tasks = addTask(tasks, taskText);
	renderTask(tasks[tasks.length - 1], taskCallbacks);
	saveTasks(tasks);

	taskInput.value = "";
});
