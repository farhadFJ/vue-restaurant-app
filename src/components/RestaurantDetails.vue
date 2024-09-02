<template>
  <div class="restaurant-details">
    <h1 class="restaurant-name">{{ restaurant.name }}</h1>
    <div v-for="group in articleGroups" :key="group.id" class="group-section">
      <h3>{{ group.name }}</h3>
      <table class="article-table">
        <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price (€)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="article in group.articles" :key="article.id">
          <td>
            <img :src="`http://localhost:8000/images/${article.image}`" alt="article image" class="article-image">
          </td>
          <td>{{ article.name }}</td>
          <td>{{ article.description }}</td>
          <td>{{ article.price }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <button @click="$router.push({ name: 'RestaurantList' })" class="back-button">Back to Restaurant List</button>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      restaurant: null,
      articleGroups: [],
    };
  },

  async created() {
    const restaurantId = this.$route.params.id;

    try {
      const restaurantsResponse = await api.getRestaurants();
      this.restaurant = restaurantsResponse.data.find(r => r.id == restaurantId);

      if (!this.restaurant) {
        throw new Error('Restaurant not found');
      }

      const articleGroupsResponse = await api.getArticleGroups();
      const groups = articleGroupsResponse.data;

      const articlesResponse = await api.allocateArticles(restaurantId, []);
      const articles = articlesResponse.data;

      this.articleGroups = groups.map(group => ({
        ...group,
        articles: articles.filter(article => article.article_group_id === group.id),
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
};
</script>

<style scoped>
.restaurant-name {
  color: #42b983;
  font-family: "Academy Engraved LET";
}
.restaurant-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-image {
  max-width: 100px;
  height: auto;
}

.back-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #2980b9;
}

h1, h2 {
  text-align: center;
  color: #2c3e50;
}

.group-section {
  margin-bottom: 30px;
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.article-table th,
.article-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.article-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: center;
}

.article-image {
  max-width: 100px;
  border-radius: 8px;
}
</style>
