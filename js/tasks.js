export function addTask(tasks, text) {
	const newTask = {
		text: text,
		completed: false
	};

	return [...tasks, newTask];
}

export function toggleTask(tasks, task) {
	return tasks.map(function (currentTask) {
		if (currentTask === task) {
			return {
				...currentTask,
				completed: !currentTask.completed
			};
		}

		return currentTask;
	});
}

export function removeTask(tasks, task) {
	return tasks.filter(function (currentTask) {
		return currentTask !== task;
	});
}

export function editTask(tasks, task, newText) {
	return tasks.map(function (currentTask) {
		if (currentTask === task) {
			return {
				...currentTask,
				text: newText
			};
		}

		return currentTask;
	});
}

export function filterTasks(tasks, filter) {
	if (filter === "todo") {
		return tasks.filter(function (task) {
			return !task.completed;
		});
	}

	if (filter === "completed") {
		return tasks.filter(function (task) {
			return task.completed;
		});
	}

	return [...tasks];
}

export function countTodo(tasks) {
	return tasks.filter(function (task) {
		return task.completed === false;
	}).length;
}
