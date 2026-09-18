import { describe, expect, test } from "vitest";
import { addTask, toggleTask, removeTask, filterTasks, editTask, countTodo } from "../js/tasks.js";

describe("addTask", function () {
test("addTask dodaje zadanie", function () {
	const tasks = [];
	const result = addTask(tasks, "Kupić mleko");

	expect(result).toHaveLength(1);
});

test("addTask zapisuje poprawny tekst", function () {
	const result = addTask([], "Kupić mleko");

	expect(result[0].text).toBe("Kupić mleko");
});

test("addTask ustawia completed na false", function () {
	const result = addTask([], "Kupić mleko");

	expect(result[0].completed).toBe(false);
});

test("addTask zwraca nową tablicę", function () {
	const tasks = [];
	const result = addTask(tasks, "Kupić mleko");

	expect(result).not.toBe(tasks);
});

test("addTask nie modyfikuje oryginalnej tablicy", function () {
	const tasks = [];
	addTask(tasks, "Kupić mleko");

	expect(tasks).toHaveLength(0);
});
});

describe("toggleTask", function () {
test("toggleTask zmienia completed z false na true", function () {
	const task = { text: "Kupić mleko", completed: false };
	const result = toggleTask([task], task);

	expect(result[0].completed).toBe(true);
});

test("toggleTask zmienia completed z true na false", function () {
	const task = { text: "Kupić mleko", completed: true };
	const result = toggleTask([task], task);

	expect(result[0].completed).toBe(false);
});

test("toggleTask zmienia właściwe zadanie", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const result = toggleTask([firstTask, secondTask], secondTask);

	expect(result[0].completed).toBe(false);
	expect(result[1].completed).toBe(true);
});

test("toggleTask zwraca nową tablicę", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const result = toggleTask(tasks, task);

	expect(result).not.toBe(tasks);
});

test("toggleTask tworzy nowy obiekt zmienionego zadania", function () {
	const task = { text: "Kupić mleko", completed: false };
	const result = toggleTask([task], task);

	expect(result[0]).not.toBe(task);
});

test("toggleTask nie modyfikuje oryginalnych danych", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const originalTasks = JSON.stringify(tasks);
	const originalTask = JSON.stringify(task);

	toggleTask(tasks, task);

	expect(JSON.stringify(tasks)).toBe(originalTasks);
	expect(JSON.stringify(task)).toBe(originalTask);
});
});

describe("removeTask", function () {
test("removeTask usuwa wskazane zadanie", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const result = removeTask([firstTask, secondTask], firstTask);

	expect(result).toHaveLength(1);
	expect(result[0]).toBe(secondTask);
});

test("removeTask pozostawia pozostałe zadania", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const thirdTask = { text: "Zrobić zakupy", completed: true };
	const result = removeTask([firstTask, secondTask, thirdTask], secondTask);

	expect(result).toHaveLength(2);
	expect(result[0]).toBe(firstTask);
	expect(result[1]).toBe(thirdTask);
});

test("removeTask usuwa właściwe zadanie spośród kilku", function () {
	const firstTask = { text: "Pierwsze", completed: false };
	const secondTask = { text: "Drugie", completed: true };
	const thirdTask = { text: "Trzecie", completed: false };
	const result = removeTask([firstTask, secondTask, thirdTask], secondTask);

	expect(result).not.toContain(secondTask);
});

test("removeTask zwraca nową tablicę", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const result = removeTask(tasks, task);

	expect(result).not.toBe(tasks);
});

test("removeTask nie modyfikuje oryginalnej tablicy", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const tasks = [firstTask, secondTask];

	removeTask(tasks, firstTask);

	expect(tasks).toHaveLength(2);
	expect(tasks[0]).toBe(firstTask);
	expect(tasks[1]).toBe(secondTask);
});
});

describe("filterTasks", function () {
test("filterTasks z filtrem all zwraca wszystkie zadania", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const result = filterTasks(tasks, "all");

	expect(result).toHaveLength(2);
	expect(result[0]).toBe(tasks[0]);
	expect(result[1]).toBe(tasks[1]);
});

test("filterTasks z filtrem todo zwraca tylko niewykonane zadania", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const result = filterTasks(tasks, "todo");

	expect(result).toHaveLength(1);
	expect(result[0]).toBe(tasks[0]);
});

test("filterTasks z filtrem completed zwraca tylko wykonane zadania", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const result = filterTasks(tasks, "completed");

	expect(result).toHaveLength(1);
	expect(result[0]).toBe(tasks[1]);
});

test("filterTasks poprawnie obsługuje pusty wynik", function () {
	const tasks = [{ text: "Wykonane", completed: true }];
	const result = filterTasks(tasks, "todo");

	expect(Array.isArray(result)).toBe(true);
	expect(result).toHaveLength(0);
});

test("filterTasks nie modyfikuje oryginalnej tablicy", function () {
	const tasks = [
		{ text: "Niewykonane", completed: false },
		{ text: "Wykonane", completed: true }
	];
	const originalTasks = JSON.stringify(tasks);

	filterTasks(tasks, "completed");

	expect(JSON.stringify(tasks)).toBe(originalTasks);
});
});

describe("editTask", function () {
test("editTask zmienia tekst wskazanego zadania", function () {
	const task = { text: "Kupić mleko", completed: false };
	const result = editTask([task], task, "Kupić chleb");

	expect(result[0].text).toBe("Kupić chleb");
});

test("editTask nie zmienia tekstu pozostałych zadań", function () {
	const firstTask = { text: "Kupić mleko", completed: false };
	const secondTask = { text: "Napisać raport", completed: false };
	const result = editTask([firstTask, secondTask], firstTask, "Kupić chleb");

	expect(result[1].text).toBe("Napisać raport");
});

test("editTask zachowuje completed edytowanego zadania", function () {
	const task = { text: "Kupić mleko", completed: false };
	const result = editTask([task], task, "Kupić chleb");

	expect(result[0].completed).toBe(false);
});

test("editTask działa dla wykonanego zadania", function () {
	const task = { text: "Kupić mleko", completed: true };
	const result = editTask([task], task, "Kupić chleb");

	expect(result[0].text).toBe("Kupić chleb");
	expect(result[0].completed).toBe(true);
});

test("editTask zwraca nową tablicę", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const result = editTask(tasks, task, "Kupić chleb");

	expect(result).not.toBe(tasks);
});

test("editTask tworzy nowy obiekt edytowanego zadania", function () {
	const task = { text: "Kupić mleko", completed: false };
	const result = editTask([task], task, "Kupić chleb");

	expect(result[0]).not.toBe(task);
});

test("editTask nie modyfikuje oryginalnej tablicy", function () {
	const task = { text: "Kupić mleko", completed: false };
	const tasks = [task];
	const originalTasks = JSON.stringify(tasks);

	editTask(tasks, task, "Kupić chleb");

	expect(JSON.stringify(tasks)).toBe(originalTasks);
});

test("editTask nie modyfikuje oryginalnego obiektu zadania", function () {
	const task = { text: "Kupić mleko", completed: false };
	const originalTask = JSON.stringify(task);

	editTask([task], task, "Kupić chleb");

	expect(JSON.stringify(task)).toBe(originalTask);
});
});

describe("countTodo", function () {
test("countTodo zwraca liczbę niewykonanych zadań", function () {
	const tasks = [
		{ text: "Kupić mleko", completed: false },
		{ text: "Napisać raport", completed: false },
		{ text: "Zrobić zakupy", completed: true }
	];

	expect(countTodo(tasks)).toBe(2);
});
});
