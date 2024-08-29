<template>
  <div>
    <h1>{{ restaurant.name }}</h1>
    <h2>Article Groups</h2>
    <ul>
      <li v-for="group in articleGroups" :key="group.id">
        <strong>{{ group.name }}</strong>
        <ul>
          <li v-for="article in group.articles" :key="article.id">
            {{ article.name }} - {{ article.price }}€
            <img :src="article.image" alt="article image" style="max-width: 100px;">
            <p>{{ article.description }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      restaurant: {},
      articleGroups: [],
    };
  },
  created() {
    const restaurantId = this.$route.params.id;

    api.getRestaurants().then((response) => {
      this.restaurant = response.data.data.find(r => r.id === restaurantId);
    });

    api.getArticleGroups().then((response) => {
      this.articleGroups = response.data.data;

      this.articleGroups.forEach((group) => {
        api.getArticles().then((response) => {
          group.articles = response.data.data.filter(a => a.article_group_id === group.id);
        });
      });
    });
  },
};
</script>
