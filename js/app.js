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

	taskCheckbox.type = "checkbox";
	taskLabel.appendChild(taskCheckbox);
	taskLabel.appendChild(document.createTextNode(taskText));
	taskItem.appendChild(taskLabel);

	taskCheckbox.addEventListener("change", function () {
		taskItem.classList.toggle("completed", taskCheckbox.checked);
	});

	taskList.appendChild(taskItem);

	taskInput.value = "";
});
