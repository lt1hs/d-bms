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
        (data.user as any).profileImage = (data.user as any).profile_image || (data.user as any).profileImage;
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
        // Map snake_case to camelCase
        (user as any).profileImage = (user as any).profile_image || (user as any).profileImage;
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
        return users.map((u: any) => {
            if (typeof u.permissions === 'string') {
                try { u.permissions = JSON.parse(u.permissions); } catch (e) { }
            }
            // Map snake_case to camelCase
            u.profileImage = u.profile_image || u.profileImage;
            return u as User;
        });
    },

    async createUser(token: string, user: Partial<User>): Promise<User> {
        // Map camelCase to snake_case for backend
        const payload: any = { ...user };
        if (payload.profileImage) {
            payload.profile_image = payload.profileImage;
            delete payload.profileImage;
        }

        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to create user');
        const newUser = await response.json();
        if (typeof newUser.permissions === 'string') {
            try { newUser.permissions = JSON.parse(newUser.permissions); } catch (e) { }
        }
        (newUser as any).profileImage = (newUser as any).profile_image || (newUser as any).profileImage;
        return newUser;
    },

    async updateUser(token: string, id: string, user: Partial<User>): Promise<User> {
        // Map camelCase to snake_case for backend
        const payload: any = { ...user };
        if (payload.profileImage) {
            payload.profile_image = payload.profileImage;
            delete payload.profileImage;
        }

        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to update user');
        const updatedUser = await response.json();
        if (typeof updatedUser.permissions === 'string') {
            try { updatedUser.permissions = JSON.parse(updatedUser.permissions); } catch (e) { }
        }
        (updatedUser as any).profileImage = (updatedUser as any).profile_image || (updatedUser as any).profileImage;
        return updatedUser;
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
