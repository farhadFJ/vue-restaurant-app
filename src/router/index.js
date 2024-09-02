import { createRouter, createWebHistory } from 'vue-router';
import RestaurantList from '../components/RestaurantList.vue';
import RestaurantDetails from '../components/RestaurantDetails.vue';

const routes = [
    {
        path: '/',
        name: 'RestaurantList',
        component: RestaurantList,
    },
    {
        path: '/restaurant/:id',
        name: 'RestaurantDetail',
        component: RestaurantDetails,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
