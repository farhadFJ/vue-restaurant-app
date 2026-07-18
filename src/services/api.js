import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default {
    login(credentials) {
        return apiClient.post('/login', credentials);
    },
    register(userDetails) {
        return apiClient.post('/register', userDetails);
    },
    logout() {
        return apiClient.post('/logout');
    },
    getCompanies() {
        return apiClient.post('/companies/getCompanies');
    },
    getRestaurants() {
        return apiClient.post('/restaurants/getRestaurants');
    },
    allocateArticles(restaurantId, articles) {
        return apiClient.post(`/restaurant/${restaurantId}/allocate-articles`, { articles });
    },
    getArticleGroups() {
        return apiClient.post('/articleGroups/getArticleGroups');
    },
    getArticles() {
        return apiClient.post('/articles/getArticles');
    },
}