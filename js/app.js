import { loadTasks, saveTasks } from "./storage.js";
import { addTask, toggleTask, removeTask, editTask, filterTasks } from "./tasks.js";
import { renderTasks } from "./ui.js";

const form = document.querySelector("form");
const taskInput = document.querySelector("#new-task");
const filterButtons = document.querySelectorAll("[data-filter]");
let tasks = loadTasks();
let currentFilter = "all";

function renderCurrentTasks() {
	const visibleTasks = filterTasks(tasks, currentFilter);
	renderTasks(visibleTasks, taskCallbacks);
}

function handleToggle(task) {
	const taskIndex = tasks.indexOf(task);
	tasks = toggleTask(tasks, task);
	saveTasks(tasks);
	renderCurrentTasks();
	return tasks[taskIndex];
}

function handleDelete(task) {
	tasks = removeTask(tasks, task);
	saveTasks(tasks);
	renderCurrentTasks();
}

function handleEdit(task, newText) {
	const taskIndex = tasks.indexOf(task);
	tasks = editTask(tasks, task, newText);
	saveTasks(tasks);
	renderCurrentTasks();
	return tasks[taskIndex];
}

const taskCallbacks = {
	onToggle: handleToggle,
	onDelete: handleDelete,
	onEdit: handleEdit
};

filterButtons.forEach(function (button) {
	button.addEventListener("click", function () {
		currentFilter = button.dataset.filter;
		renderCurrentTasks();
	});
});

renderCurrentTasks();

form.addEventListener("submit", function (event) {
	event.preventDefault();

	const taskText = taskInput.value.trim();

	if (taskText === "") {
		return;
	}

	tasks = addTask(tasks, taskText);
	saveTasks(tasks);
	renderCurrentTasks();

	taskInput.value = "";
});
