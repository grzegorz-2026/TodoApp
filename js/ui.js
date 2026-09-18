export function renderTask(task, callbacks) {
	const taskItem = document.createElement("li");
	const taskLabel = document.createElement("label");
	const taskCheckbox = document.createElement("input");
	const deleteButton = document.createElement("button");

	taskCheckbox.type = "checkbox";
	taskCheckbox.checked = task.completed;
	taskLabel.appendChild(taskCheckbox);
	taskLabel.appendChild(document.createTextNode(task.text));
	taskItem.appendChild(taskLabel);

	deleteButton.type = "button";
	deleteButton.textContent = "Usuń";
	deleteButton.className = "delete-button";
	taskItem.appendChild(deleteButton);

	taskItem.classList.toggle("completed", task.completed);

	taskCheckbox.addEventListener("change", function () {
		task = callbacks.onToggle(task);
		taskItem.classList.toggle("completed", task.completed);
	});

	deleteButton.addEventListener("click", function () {
		callbacks.onDelete(task);
		taskItem.remove();
	});

	document.querySelector("#task-list").appendChild(taskItem);
}
