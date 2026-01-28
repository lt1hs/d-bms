import { User } from '../types';

const API_URL = `http://${window.location.hostname}:8000/api`;

export const authService = {
    async login(username: string, password: string): Promise<{ user: User; token: string }> {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        // Parse permissions if it's a string (Laravel sometimes sends JSON as string)
        if (typeof data.user.permissions === 'string') {
            try {
                data.user.permissions = JSON.parse(data.user.permissions);
            } catch (e) {
                console.error('Failed to parse permissions:', e);
            }
        }
        return data;
    },

    async logout(token: string): Promise<void> {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });
    },

    async getUser(token: string): Promise<User> {
        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        const user = await response.json();
        if (typeof user.permissions === 'string') {
            try {
                user.permissions = JSON.parse(user.permissions);
            } catch (e) {
                console.error('Failed to parse permissions:', e);
            }
        }
        return user;
    },

    async getAllUsers(token: string): Promise<User[]> {
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        return users.map((u: User) => {
            if (typeof u.permissions === 'string') {
                try { u.permissions = JSON.parse(u.permissions); } catch (e) { }
            }
            return u;
        });
    },

    async createUser(token: string, user: Partial<User>): Promise<User> {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Failed to create user');
        const newUser = await response.json();
        if (typeof newUser.permissions === 'string') {
            try { newUser.permissions = JSON.parse(newUser.permissions); } catch (e) { }
        }
        return newUser;
    },

    async deleteUser(token: string, id: string): Promise<void> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to delete user');
    }
};
