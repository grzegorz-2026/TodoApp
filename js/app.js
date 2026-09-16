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
	taskItem.textContent = taskText;
	taskList.appendChild(taskItem);

	taskInput.value = "";
});
