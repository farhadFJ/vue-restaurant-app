import axios from "axios";
const apiClient = axios.create({
    baseURL: 'http://eventstream.test/api', // Ersetzen durch die tatsächliche URL meines Laravel-Servers
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
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
    // Unternehmen
    getCompanies() {
        return apiClient.post('/companies/getCompanies');
    },
    // Restaurants
    getRestaurants() {
        return apiClient.post('/restaurants/getRestaurants');
    },
    allocateArticles(restaurantId, articles) {
        return apiClient.post(`/restaurant/${restaurantId}/allocate-articles`, { articles });
    },
    // Artikelgruppen
    getArticleGroups() {
        return apiClient.post('/articleGroups/getArticleGroups');
    },
    // Artikel
    getArticles() {
        return apiClient.post('/articles/getArticles');
    },


}