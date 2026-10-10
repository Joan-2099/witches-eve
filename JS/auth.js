
const USERS_KEY = "witchGameUsers";
const CURRENT_USER_KEY = "witchGameCurrentUser";

export function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(username, email, password) {
    const users = getUsers();

    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        return {
            success: false,
            message: "An account with this email already exists."
        };
    }

    const newUser = {
        id: crypto.randomUUID(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        highScore: 0
    };

    users.push(newUser);
    saveUsers(users);

    return {
        success: true,
        message: "Account created successfully!"
    };
}

export function loginUser(email, password) {
    const users = getUsers();

    const user = users.find(
        user => user.email === email.trim().toLowerCase()
            && user.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Incorrect email or password."
        };
    }

    // Store only the information needed for the current session.
    sessionStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
            id: user.id,
            username: user.username
        })
    );

    return {
        success: true,
        message: "Login successful!"
    };
}

export function getCurrentUser() {
    return JSON.parse(
        sessionStorage.getItem(CURRENT_USER_KEY) || "null"
    );
}

export function logoutUser() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
}
