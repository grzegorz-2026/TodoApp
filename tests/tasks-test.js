import { addTask, toggleTask, removeTask, filterTasks } from "../js/tasks.js";

const results = document.querySelector("#results");
const summary = document.querySelector("#summary");
let passCount = 0;
let failCount = 0;

function test(name, callback) {
	const result = document.createElement("p");

	try {
		if (callback()) {
			result.textContent = `PASS: ${name}`;
			result.style.color = "green";
			passCount += 1;
		} else {
			result.textContent = `FAIL: ${name}`;
			result.style.color = "red";
			failCount += 1;
		}
	} catch (error) {
		result.textContent = `FAIL: ${name} (${error.message})`;
		result.style.color = "red";
		failCount += 1;
	}

	results.appendChild(result);
}

test("addTask dodaje zadanie", function () {
	const tasks = [];
	const result = addTask(tasks, "Kupić mleko");

	return result.length === 1;
});

test("addTask zapisuje poprawny tekst", function () {
	const result = addTask([], "Kupić mleko");

	return result[0].text === "Kupić mleko";
});

test("addTask ustawia completed na false", function () {
	const result = addTask([], "Kupić mleko");

	return result[0].completed === false;
});

test("addTask zwraca nową tablicę", function () {
	const tasks = [];
	const result = addTask(tasks, "Kupić mleko");

	return result !== tasks;
});

test("addTask nie modyfikuje oryginalnej tablicy", function () {
	const tasks = [];
	addTask(tasks, "Kupić mleko");

	return tasks.length === 0;
});

test("toggleTask zmienia completed z false na true", function () {
	const task = { text: "Kupić mleko", completed: false };
	const result = toggleTask([task], task);

	return result[0].completed === true;
});

test("toggleTask zmienia completed z true na false", function () {
	const task = { text: "Kupić mleko", completed: true };
	const result = toggleTask([task], task);

	return result[0].completed === false;
});

test("toggleTask zmienia właściwe zadanie", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const result = toggleTask([firstTask, secondTask], secondTask);

	return result[0].completed === false && result[1].completed === true;
});

test("toggleTask zwraca nową tablicę", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const result = toggleTask(tasks, task);

	return result !== tasks;
});

test("toggleTask tworzy nowy obiekt zmienionego zadania", function () {
	const task = { text: "Kupić mleko", completed: false };
	const result = toggleTask([task], task);

	return result[0] !== task;
});

test("toggleTask nie modyfikuje oryginalnych danych", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const originalTasks = JSON.stringify(tasks);
	const originalTask = JSON.stringify(task);

	toggleTask(tasks, task);

	return JSON.stringify(tasks) === originalTasks && JSON.stringify(task) === originalTask;
});

test("removeTask usuwa wskazane zadanie", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const result = removeTask([firstTask, secondTask], firstTask);

	return result.length === 1 && result[0] === secondTask;
});

test("removeTask pozostawia pozostałe zadania", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const thirdTask = { text: "Zrobić zakupy", completed: true };
	const result = removeTask([firstTask, secondTask, thirdTask], secondTask);

	return result.length === 2 && result[0] === firstTask && result[1] === thirdTask;
});

test("removeTask usuwa właściwe zadanie spośród kilku", function () {
	const firstTask = { text: "Pierwsze", completed: false };
	const secondTask = { text: "Drugie", completed: true };
	const thirdTask = { text: "Trzecie", completed: false };
	const result = removeTask([firstTask, secondTask, thirdTask], secondTask);

	return result.every(function (task) {
		return task !== secondTask;
	});
});

test("removeTask zwraca nową tablicę", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const result = removeTask(tasks, task);

	return result !== tasks;
});

test("removeTask nie modyfikuje oryginalnej tablicy", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const tasks = [firstTask, secondTask];

	removeTask(tasks, firstTask);

	return tasks.length === 2 && tasks[0] === firstTask && tasks[1] === secondTask;
});

test("filterTasks z filtrem all zwraca wszystkie zadania", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const result = filterTasks(tasks, "all");

	return result.length === 2 && result[0] === tasks[0] && result[1] === tasks[1];
});

test("filterTasks z filtrem todo zwraca tylko niewykonane zadania", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const result = filterTasks(tasks, "todo");

	return result.length === 1 && result[0] === tasks[0];
});

test("filterTasks z filtrem completed zwraca tylko wykonane zadania", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const result = filterTasks(tasks, "completed");

	return result.length === 1 && result[0] === tasks[1];
});

test("filterTasks poprawnie obsługuje pusty wynik", function () {
	const tasks = [{ text: "Wykonane", completed: true }];
	const result = filterTasks(tasks, "todo");

	return Array.isArray(result) && result.length === 0;
});

test("filterTasks nie modyfikuje oryginalnej tablicy", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const originalTasks = JSON.stringify(tasks);

	filterTasks(tasks, "completed");

	return JSON.stringify(tasks) === originalTasks;
});

summary.textContent = `PASS: ${passCount} | FAIL: ${failCount}`;
