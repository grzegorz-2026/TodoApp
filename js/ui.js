export function renderTask(task, callbacks) {
	const taskItem = document.createElement("li");
	function showTaskView() {
		const taskLabel = document.createElement("label");
		const taskCheckbox = document.createElement("input");
		const editButton = document.createElement("button");
		const deleteButton = document.createElement("button");

		taskItem.innerHTML = "";
		taskItem.classList.remove("editing");
		taskCheckbox.type = "checkbox";
		taskCheckbox.checked = task.completed;
		taskLabel.appendChild(taskCheckbox);
		taskLabel.appendChild(document.createTextNode(task.text));
		taskItem.appendChild(taskLabel);

		editButton.type = "button";
		editButton.textContent = "Edytuj";
		editButton.className = "edit-button";
		taskItem.appendChild(editButton);

		deleteButton.type = "button";
		deleteButton.textContent = "Usuń";
		deleteButton.className = "delete-button";
		taskItem.appendChild(deleteButton);

		taskItem.classList.toggle("completed", task.completed);

		taskCheckbox.addEventListener("change", function () {
			task = callbacks.onToggle(task);
			taskItem.classList.toggle("completed", task.completed);
		});

		editButton.addEventListener("click", showEditView);

		deleteButton.addEventListener("click", function () {
			callbacks.onDelete(task);
			taskItem.remove();
		});
	}

	function showEditView() {
		const editInput = document.createElement("input");
		const saveButton = document.createElement("button");
		const cancelButton = document.createElement("button");

		taskItem.innerHTML = "";
		taskItem.classList.add("editing");
		editInput.type = "text";
		editInput.value = task.text;
		editInput.className = "edit-input";
		taskItem.appendChild(editInput);

		saveButton.type = "button";
		saveButton.textContent = "Zapisz";
		saveButton.className = "save-button";
		taskItem.appendChild(saveButton);

		cancelButton.type = "button";
		cancelButton.textContent = "Anuluj";
		cancelButton.className = "cancel-button";
		taskItem.appendChild(cancelButton);

		saveButton.addEventListener("click", function () {
			const newText = editInput.value.trim();

			if (newText === "") {
				editInput.focus();
				return;
			}

			task = callbacks.onEdit(task, newText);
		});

		cancelButton.addEventListener("click", showTaskView);
		editInput.focus();
	}

	showTaskView();

	document.querySelector("#task-list").appendChild(taskItem);
}

export function renderTasks(tasks, callbacks) {
	const taskList = document.querySelector("#task-list");
	taskList.innerHTML = "";

	tasks.forEach(function (task) {
		renderTask(task, callbacks);
	});
}
