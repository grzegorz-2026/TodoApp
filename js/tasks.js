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
