<template>
  <div class="restaurant-list">
    <h1 class="restaurant-title" style="color: #42b983">Restaurants</h1>
    <ul v-if="restaurants.length">
      <li v-for="restaurant in restaurants" :key="restaurant.id" class="restaurant-item">
        <router-link @click="navigateToRestaurant(restaurant.id)" :to="{ name: 'RestaurantDetail', params: { id: restaurant.id } }" class="restaurant-link">
          {{ restaurant.name }}
        </router-link>
      </li>
    </ul>
    <p v-else>Keine Restaurants gefunden.</p>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      restaurants: [],
    };
  },
  created() {
    api.getRestaurants()
        .then((response) => {
          console.log('API Response:', response.data);
          this.restaurants = response.data;
        })
        .catch((error) => {
          console.error('Error fetching restaurants:', error);
          alert('Es gab ein Problem beim Laden der Restaurants. Bitte versuchen Sie es später erneut.');
        });
  },
  methods: {
    navigateToRestaurant(id) {
      // Leite zur Restaurant-Seite weiter und lade die Seite neu
      window.location.href = `/restaurant/${id}`;
    },
  },
};
</script>

<style scoped>
.restaurant-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.restaurant-title {
  color: #42b983;
  font-family: "Academy Engraved LET";
}

.restaurant-list h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  color: #2c3e50;
}

.restaurant-item {
  background: #f7f7f7;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.restaurant-item:hover {
  background: #e0e0e0;
}

.restaurant-link {
  text-decoration: none;
  color: #3498db;
  font-weight: bold;
  font-size: 1.2em;
}

.restaurant-link:hover {
  color: #2980b9;
}
</style>
