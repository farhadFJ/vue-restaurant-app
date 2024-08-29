<template>
  <div>
    <h1>Restaurants</h1>
    <ul>
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        <router-link :to="{ name: 'RestaurantDetail', params: { id: restaurant.id } }">
          {{ restaurant.name }}
        </router-link>
      </li>
    </ul>
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
    api.getRestaurants().then((response) => {
      this.restaurants = response.data.data; // Nutzen "data.data" wenn Laravel "data" um die eigentlichen Daten herum schickt
    }).catch((error) => {
      console.error('Error fetching restaurants:', error);
    });
  },
};
</script>
