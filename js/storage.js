const STORAGE_KEY = "tasks";

export function loadTasks() {
	const savedTasks = localStorage.getItem(STORAGE_KEY);
	return savedTasks ? JSON.parse(savedTasks) : [];
}

export function saveTasks(tasks) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
