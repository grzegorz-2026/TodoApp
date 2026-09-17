const form = document.querySelector("form");
const taskInput = document.querySelector("#new-task");
const taskList = document.querySelector("#task-list");

form.addEventListener("submit", function (event) {
	event.preventDefault();

	const taskText = taskInput.value.trim();

	if (taskText === "") {
		return;
	}

	const taskItem = document.createElement("li");
	const taskLabel = document.createElement("label");
	const taskCheckbox = document.createElement("input");
	const deleteButton = document.createElement("button");

	taskCheckbox.type = "checkbox";
	taskLabel.appendChild(taskCheckbox);
	taskLabel.appendChild(document.createTextNode(taskText));
	taskItem.appendChild(taskLabel);

	deleteButton.type = "button";
	deleteButton.textContent = "Usuń";
	deleteButton.className = "delete-button";
	taskItem.appendChild(deleteButton);

	taskCheckbox.addEventListener("change", function () {
		taskItem.classList.toggle("completed", taskCheckbox.checked);
	});

	deleteButton.addEventListener("click", function () {
		taskItem.remove();
	});

	taskList.appendChild(taskItem);

	taskInput.value = "";
});
