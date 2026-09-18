import { addTask, toggleTask } from "../js/tasks.js";

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

summary.textContent = `PASS: ${passCount} | FAIL: ${failCount}`;
