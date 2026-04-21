
import axios from 'axios';

// Main API instance
export const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
	withCredentials: true,
});

// Authenticated API instance factory
export const authApi = (token) =>
	axios.create({
		baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
