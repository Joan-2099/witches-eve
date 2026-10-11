
const USERS_KEY = "witchesEveUsers";
const SESSION_KEY = "witchesEveCurrentUser";

const SESSION_DURATION = 21 * 24 * 60 * 60 * 1000; // 21 days

// Get registered users
export function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

// Save registered users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register a new user
export function registerUser(username, email, password) {
    const users = getUsers();
    const normalisedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
        user => user.email === normalisedEmail
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
        email: normalisedEmail,
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

// Log in and remember the user for 21 days
export function loginUser(email, password) {
    const users = getUsers();
    const normalisedEmail = email.trim().toLowerCase();

    const user = users.find(
        user =>
            user.email === normalisedEmail &&
            user.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Incorrect email or password."
        };
    }

    const session = {
        id: user.id,
        username: user.username,
        expiresAt: Date.now() + SESSION_DURATION
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return {
        success: true,
        message: "Welcome back, " + user.username + "!"
    };
}

// Get the logged-in user, checking the expiry
export function getCurrentUser() {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
        return null;
    }

    try {
        const session = JSON.parse(storedSession);

        if (!session.expiresAt || Date.now() >= session.expiresAt) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }

        // Make sure the account still exists
        const userExists = getUsers().some(
            user => user.id === session.id
        );

        if (!userExists) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }

        return session;
    } catch (error) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

// Log out explicitly
export function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
}
