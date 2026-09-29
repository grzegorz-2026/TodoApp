import { removeTask, filterTasks, countTodo } from "./tasks.js";
import { renderTasks, renderTodoCount } from "./ui.js";
import {
	signIn,
	saveSession,
	getValidSession,
	signOut,
	clearSession,
	fetchTasks,
	insertTask,
	updateTaskCompleted,
	updateTaskText,
	deleteTask
} from "./supabase.js";

const loginForm = document.querySelector("#login-form");
const loginSection = document.querySelector("#login-section");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginError = document.querySelector("#login-error");
const todoSection = document.querySelector("#todo-section");
const logoutButton = document.querySelector("#logout-button");
const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#new-task");
const filterButtons = document.querySelectorAll("[data-filter]");
let tasks = [];
let currentFilter = "all";

function updateAuthUI(isAuthenticated) {
	loginSection.hidden = isAuthenticated;
	todoSection.hidden = !isAuthenticated;
	logoutButton.hidden = !isAuthenticated;
}

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
			renderCurrentTasks();
		})
		.catch(function (error) {
			console.error("Nie udało się zaktualizować statusu zadania w Supabase:", error.message);
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
			renderCurrentTasks();
		})
		.catch(function (error) {
			console.error("Nie udało się usunąć zadania z Supabase:", error.message);
			renderCurrentTasks();
		});
}

function handleEdit(task, newText) {
	updateTaskText(task.id, newText)
		.then(function (updatedTask) {
			tasks = tasks.map(function (currentTask) {
				return currentTask.id === updatedTask.id ? updatedTask : currentTask;
			});
			renderCurrentTasks();
		})
		.catch(function (error) {
			console.error("Nie udało się zaktualizować tekstu zadania w Supabase:", error.message);
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
	let session;

	try {
		session = await getValidSession();
	} catch (error) {
		updateAuthUI(false);
		tasks = [];
		renderCurrentTasks();
		console.error("Nie udało się zainicjalizować sesji lub pobrać zadań:", error.message);
		return;
	}

	if (!session) {
		updateAuthUI(false);
		tasks = [];
		return;
	}

	updateAuthUI(true);

	try {
		tasks = await fetchTasks();
	} catch (error) {
		tasks = [];
		renderCurrentTasks();
		console.error("Nie udało się zainicjalizować sesji lub pobrać zadań:", error.message);
		return;
	}

	renderCurrentTasks();
}

initializeTasks();

loginForm.addEventListener("submit", async function (event) {
	event.preventDefault();
	loginError.textContent = "";

	try {
		const session = await signIn(loginEmail.value, loginPassword.value);
		saveSession(session);
		updateAuthUI(true);
		console.log("Zalogowano użytkownika", session.user.id);
		tasks = await fetchTasks();
		renderCurrentTasks();
		loginPassword.value = "";
	} catch (error) {
		loginError.textContent = error.message;
	}
});

logoutButton.addEventListener("click", async function () {
	try {
		const session = await getValidSession();

		if (session && session.access_token) {
			await signOut(session.access_token);
		}
	} catch (error) {
		console.error("Nie udało się wylogować użytkownika z Supabase:", error.message);
	} finally {
		clearSession();
		tasks = [];
		renderCurrentTasks();
		updateAuthUI(false);
	}
});

form.addEventListener("submit", async function (event) {
	event.preventDefault();

	const taskText = taskInput.value.trim();

	if (taskText === "") {
		return;
	}

	try {
		const createdTask = await insertTask(taskText);
		tasks = [...tasks, createdTask];
		renderCurrentTasks();
		taskInput.value = "";
	} catch (error) {
		console.error("Nie udało się zapisać zadania w Supabase:", error);
	}
});
