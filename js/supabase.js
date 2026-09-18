const SUPABASE_URL = "https://mrdbqjilcpfrhbfqopbr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jKL92ElbngVeZl35ZRzNHw_J-o9loVH";

export async function fetchTasks() {
	const response = await fetch(
		`${SUPABASE_URL}/rest/v1/tasks?select=id,created_at,text,completed`,
		{
			headers: {
				apikey: SUPABASE_PUBLISHABLE_KEY
			}
		}
	);

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	return response.json();
}

export async function insertTask(text) {
	const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
		method: "POST",
		headers: {
			apikey: SUPABASE_PUBLISHABLE_KEY,
			"Content-Type": "application/json",
			Prefer: "return=representation"
		},
		body: JSON.stringify({
			text: text,
			completed: false
		})
	});

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	const createdTasks = await response.json();
	return createdTasks[0];
}

export async function updateTaskCompleted(id, completed) {
	const response = await fetch(
		`${SUPABASE_URL}/rest/v1/tasks?id=eq.${encodeURIComponent(id)}`,
		{
			method: "PATCH",
			headers: {
				apikey: SUPABASE_PUBLISHABLE_KEY,
				"Content-Type": "application/json",
				Prefer: "return=representation"
			},
			body: JSON.stringify({
				completed: completed
			})
		}
	);

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	const updatedTasks = await response.json();
	if (updatedTasks.length === 0) {
		throw new Error("Supabase nie zwrócił zaktualizowanego zadania");
	}

	return updatedTasks[0];
}

export async function updateTaskText(id, text) {
	const response = await fetch(
		`${SUPABASE_URL}/rest/v1/tasks?id=eq.${encodeURIComponent(id)}`,
		{
			method: "PATCH",
			headers: {
				apikey: SUPABASE_PUBLISHABLE_KEY,
				"Content-Type": "application/json",
				Prefer: "return=representation"
			},
			body: JSON.stringify({
				text: text
			})
		}
	);

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	const updatedTasks = await response.json();
	if (updatedTasks.length === 0) {
		throw new Error("Supabase nie zwrócił zaktualizowanego zadania");
	}

	return updatedTasks[0];
}

export async function deleteTask(id) {
	const response = await fetch(
		`${SUPABASE_URL}/rest/v1/tasks?id=eq.${encodeURIComponent(id)}`,
		{
			method: "DELETE",
			headers: {
				apikey: SUPABASE_PUBLISHABLE_KEY,
				Prefer: "return=representation"
			}
		}
	);

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	const deletedTasks = await response.json();
	if (deletedTasks.length === 0) {
		throw new Error("Supabase nie zwrócił usuniętego zadania");
	}

	return deletedTasks[0];
}
