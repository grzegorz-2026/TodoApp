const SUPABASE_URL = "https://mrdbqjilcpfrhbfqopbr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jKL92ElbngVeZl35ZRzNHw_J-o9loVH";
const AUTH_SESSION_STORAGE_KEY = "supabase.auth.session";

export async function signIn(email, password) {
	const response = await fetch(
		`${SUPABASE_URL}/auth/v1/token?grant_type=password`,
		{
			method: "POST",
			headers: {
				apikey: SUPABASE_PUBLISHABLE_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		}
	);

	if (!response.ok) {
		let errorMessage = `Supabase zwrócił HTTP ${response.status}`;

		try {
			const errorBody = await response.json();
			errorMessage =
				errorBody.error_description ||
				errorBody.msg ||
				errorBody.message ||
				errorMessage;
		} catch (error) {
			// Zachowaj komunikat HTTP, gdy odpowiedź nie zawiera JSON.
		}

		throw new Error(errorMessage);
	}

	return response.json();
}

export async function signUp(email, password) {
	const response = await fetch(
		`${SUPABASE_URL}/auth/v1/signup`,
		{
			method: "POST",
			headers: {
				apikey: SUPABASE_PUBLISHABLE_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		}
	);

	if (!response.ok) {
		let errorMessage = `Supabase zwrócił HTTP ${response.status}`;

		try {
			const errorBody = await response.json();
			errorMessage =
				errorBody.error_description ||
				errorBody.msg ||
				errorBody.message ||
				errorMessage;
		} catch (error) {
			// Zachowaj komunikat HTTP, gdy odpowiedź nie zawiera JSON.
		}

		throw new Error(errorMessage);
	}

	return response.json();
}

export function saveSession(session) {
	localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getSession() {
	const savedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
	return savedSession ? JSON.parse(savedSession) : null;
}

export async function signOut(accessToken) {
	const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
		method: "POST",
		headers: {
			apikey: SUPABASE_PUBLISHABLE_KEY,
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}
}

export function clearSession() {
	localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export async function refreshSession(refreshToken) {
	const response = await fetch(
		`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
		{
			method: "POST",
			headers: {
				apikey: SUPABASE_PUBLISHABLE_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				refresh_token: refreshToken
			})
		}
	);

	if (!response.ok) {
		let errorMessage = `Supabase zwrócił HTTP ${response.status}`;

		try {
			const errorBody = await response.json();
			errorMessage =
				errorBody.error_description ||
				errorBody.msg ||
				errorBody.message ||
				errorMessage;
		} catch (error) {
			// Zachowaj komunikat HTTP, gdy odpowiedź nie zawiera JSON.
		}

		throw new Error(errorMessage);
	}

	return response.json();
}

export async function processSignupCallback() {
	const hashParams = new URLSearchParams(window.location.hash.slice(1));

	if (hashParams.get("type") !== "signup") {
		return null;
	}

	const refreshToken = hashParams.get("refresh_token");
	window.history.replaceState(
		null,
		document.title,
		window.location.pathname + window.location.search
	);

	if (!refreshToken) {
		throw new Error("Brak tokenu odświeżania w odpowiedzi potwierdzenia rejestracji.");
	}

	const session = await refreshSession(refreshToken);

	if (
		!session ||
		!session.access_token ||
		!session.refresh_token ||
		!session.user ||
		!session.user.id
	) {
		throw new Error("Supabase zwrócił niepełną sesję po potwierdzeniu rejestracji.");
	}

	return session;
}

export async function getValidSession() {
	const session = getSession();

	if (!session) {
		return null;
	}

	if (!session.access_token || !session.refresh_token) {
		clearSession();
		return null;
	}

	const expiresAt = session.expires_at;
	const currentTime = Math.floor(Date.now() / 1000);
	const hasValidExpiry =
		typeof expiresAt === "number" && Number.isFinite(expiresAt);

	if (hasValidExpiry && expiresAt > currentTime + 60) {
		return session;
	}

	try {
		const refreshedSession = await refreshSession(session.refresh_token);
		saveSession(refreshedSession);
		return refreshedSession;
	} catch (error) {
		clearSession();
		throw new Error(`Nie udało się odświeżyć sesji: ${error.message}`);
	}
}

export async function authenticatedFetch(requestFactory) {
	const session = await getValidSession();

	if (!session) {
		throw new Error("Brak aktywnej sesji użytkownika");
	}

	function createRequest(currentSession) {
		const request = requestFactory(currentSession);
		const options = request.options || {};
		const headers = new Headers(options.headers);

		headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
		headers.set("Authorization", `Bearer ${currentSession.access_token}`);

		return {
			url: request.url,
			options: {
				...options,
				headers: headers
			}
		};
	}

	let request = createRequest(session);
	let response = await fetch(request.url, request.options);

	if (response.status !== 401) {
		return response;
	}

	let refreshedSession;

	try {
		refreshedSession = await refreshSession(session.refresh_token);
		saveSession(refreshedSession);
	} catch (error) {
		clearSession();
		throw new Error(`Nie udało się odświeżyć sesji: ${error.message}`);
	}

	request = createRequest(refreshedSession);
	response = await fetch(request.url, request.options);

	return response;
}

export async function fetchTasks() {
	const response = await authenticatedFetch(function () {
		return {
			url: `${SUPABASE_URL}/rest/v1/tasks?select=id,created_at,text,completed`,
			options: {}
		};
	});

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	return response.json();
}


export async function insertTask(text) {
	const response = await authenticatedFetch(function (session) {
		return {
			url: `${SUPABASE_URL}/rest/v1/tasks`,
			options: {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Prefer: "return=representation"
				},
				body: JSON.stringify({
					text: text,
					completed: false,
					user_id: session.user.id
				})
			}
		};
	});

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	const createdTasks = await response.json();
	return createdTasks[0];
}

export async function updateTaskCompleted(id, completed) {
	const response = await authenticatedFetch(function () {
		return {
			url: `${SUPABASE_URL}/rest/v1/tasks?id=eq.${encodeURIComponent(id)}`,
			options: {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Prefer: "return=representation"
				},
				body: JSON.stringify({
					completed: completed
				})
			}
		};
	});

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
	const response = await authenticatedFetch(function () {
		return {
			url: `${SUPABASE_URL}/rest/v1/tasks?id=eq.${encodeURIComponent(id)}`,
			options: {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Prefer: "return=representation"
				},
				body: JSON.stringify({
					text: text
				})
			}
		};
	});

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
	const response = await authenticatedFetch(function () {
		return {
			url: `${SUPABASE_URL}/rest/v1/tasks?id=eq.${encodeURIComponent(id)}`,
			options: {
				method: "DELETE",
				headers: {
					Prefer: "return=representation"
				}
			}
		};
	});

	if (!response.ok) {
		throw new Error(`Supabase zwrócił HTTP ${response.status}`);
	}

	const deletedTasks = await response.json();
	if (deletedTasks.length === 0) {
		throw new Error("Supabase nie zwrócił usuniętego zadania");
	}

	return deletedTasks[0];
}
