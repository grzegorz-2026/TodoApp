import { loadTasks, saveTasks } from "./storage.js";
import { removeTask, filterTasks, countTodo } from "./tasks.js";
import { renderTasks, renderTodoCount } from "./ui.js";
import {
	fetchTasks,
	insertTask,
	updateTaskCompleted,
	updateTaskText,
	deleteTask
} from "./supabase.js";

const form = document.querySelector("form");
const taskInput = document.querySelector("#new-task");
const filterButtons = document.querySelectorAll("[data-filter]");
let tasks = [];
let currentFilter = "all";

function renderCurrentTasks() {
	const visibleTasks = filterTasks(tasks, currentFilter);
	renderTodoCount(countTodo(tasks));
	renderTasks(visibleTasks, taskCallbacks);
}

function handleToggle(task) {
	updateTaskCompleted(task.id, !task.completed)
		.then(function (updatedTask) {
			tasks = tasks.map(function (currentTask) {
				return currentTask.id === updatedTask.id ? updatedTask : currentTask;
			});
			saveTasks(tasks);
			renderCurrentTasks();
		})
		.catch(function (error) {
			console.error("Nie udało się zaktualizować statusu zadania w Supabase:", error);
			renderCurrentTasks();
		});

	return task;
}

function handleDelete(task) {
	deleteTask(task.id)
		.then(function (deletedTask) {
			tasks = tasks.filter(function (currentTask) {
				return currentTask.id !== deletedTask.id;
			});
			saveTasks(tasks);
			renderCurrentTasks();
		})
		.catch(function (error) {
			console.error("Nie udało się usunąć zadania z Supabase:", error);
			renderCurrentTasks();
		});
}

function handleEdit(task, newText) {
	updateTaskText(task.id, newText)
		.then(function (updatedTask) {
			tasks = tasks.map(function (currentTask) {
				return currentTask.id === updatedTask.id ? updatedTask : currentTask;
			});
			saveTasks(tasks);
			renderCurrentTasks();
		})
		.catch(function (error) {
			console.error("Nie udało się zaktualizować tekstu zadania w Supabase:", error);
			renderCurrentTasks();
		});

	return task;
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

async function initializeTasks() {
	try {
		tasks = await fetchTasks();
	} catch (error) {
		console.error("Nie udało się pobrać zadań z Supabase:", error);
		tasks = loadTasks();
	}

	renderCurrentTasks();
}

initializeTasks();

form.addEventListener("submit", async function (event) {
	event.preventDefault();

	const taskText = taskInput.value.trim();

	if (taskText === "") {
		return;
	}

	try {
		const createdTask = await insertTask(taskText);
		tasks = [...tasks, createdTask];
		saveTasks(tasks);
		renderCurrentTasks();
		taskInput.value = "";
	} catch (error) {
		console.error("Nie udało się zapisać zadania w Supabase:", error);
	}
});
