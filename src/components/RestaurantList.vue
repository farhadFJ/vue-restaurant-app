<template>
  <div class="restaurant-page">
    <div class="background-shape background-shape--top"></div>
    <div class="background-shape background-shape--bottom"></div>

    <main class="page-container">
      <header class="page-header">
        <div class="brand-badge">
          <span class="brand-badge__dot"></span>
          Digital Restaurant Guide
        </div>

        <div class="hero">
          <div class="hero__content">
            <span class="hero__eyebrow">
              Discover something delicious
            </span>

            <h1 class="hero__title">
              Find your next
              <span>restaurant</span>
            </h1>

            <p class="hero__description">
              Explore available restaurants and discover their menus,
              categories, food and drinks.
            </p>

            <div class="hero__statistics">
              <div class="statistic">
                <strong>{{ restaurants.length }}</strong>
                <span>
                  {{ restaurants.length === 1 ? 'Restaurant' : 'Restaurants' }}
                </span>
              </div>

              <div class="statistic-divider"></div>

              <div class="statistic">
                <strong>Fresh</strong>
                <span>Digital menus</span>
              </div>
            </div>
          </div>

          <div class="hero__visual">
            <div class="visual-circle">
              <div class="visual-circle__inner">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                  <path
                      d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c3 2 4 5 4 8h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section class="restaurants-section">
        <div class="section-header">
          <div>
            <span class="section-label">Available now</span>
            <h2>Restaurants</h2>
          </div>

          <span
              v-if="!loading && !error"
              class="restaurant-count"
          >
            {{ restaurants.length }}
            {{ restaurants.length === 1 ? 'place' : 'places' }}
          </span>
        </div>

        <div
            v-if="loading"
            class="restaurant-grid"
        >
          <article
              v-for="item in 6"
              :key="item"
              class="restaurant-card restaurant-card--skeleton"
          >
            <div class="skeleton skeleton--icon"></div>

            <div class="skeleton-content">
              <div class="skeleton skeleton--title"></div>
              <div class="skeleton skeleton--text"></div>
              <div class="skeleton skeleton--button"></div>
            </div>
          </article>
        </div>

        <div
            v-else-if="error"
            class="state-card state-card--error"
        >
          <div class="state-icon state-icon--error">
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
              <path
                  d="M12 8v5M12 17h.01M10.3 4.5 2.8 17.5A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.5L13.7 4.5a2 2 0 0 0-3.4 0Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </div>

          <h2>Restaurants could not be loaded</h2>

          <p>{{ error }}</p>

          <button
              type="button"
              class="retry-button"
              @click="loadRestaurants"
          >
            Try again
          </button>
        </div>

        <div
            v-else-if="restaurants.length === 0"
            class="state-card"
        >
          <div class="state-icon">
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
              <path
                  d="M4 10h16M5 10l1-6h12l1 6M6 10v10h12V10M9 14h6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </div>

          <h2>No restaurants found</h2>

          <p>
            There are currently no restaurants available.
          </p>
        </div>

        <div
            v-else
            class="restaurant-grid"
        >
          <router-link
              v-for="(restaurant, index) in restaurants"
              :key="restaurant.id"
              :to="{
              name: 'RestaurantDetail',
              params: {
                id: restaurant.id,
              },
            }"
              class="restaurant-card"
              :aria-label="`Open ${restaurant.name}`"
          >
            <div class="restaurant-card__top">
              <div class="restaurant-avatar">
                {{ getInitials(restaurant.name) }}
              </div>

              <span class="restaurant-number">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
            </div>

            <div class="restaurant-card__content">
              <span class="restaurant-card__label">
                Restaurant
              </span>

              <h3>
                {{ restaurant.name }}
              </h3>

              <p>
                Explore the digital menu, available categories,
                dishes and drinks.
              </p>
            </div>

            <div class="restaurant-card__footer">
              <span>View menu</span>

              <span class="arrow-button">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                  <path
                      d="m9 18 6-6-6-6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
          </router-link>
        </div>
      </section>

      <footer class="page-footer">
        <p>
          Select a restaurant to view its full digital menu.
        </p>
      </footer>
    </main>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'RestaurantList',

  data() {
    return {
      restaurants: [],
      loading: true,
      error: '',
    };
  },

  created() {
    this.loadRestaurants();
  },

  methods: {
    async loadRestaurants() {
      this.loading = true;
      this.error = '';

      try {
        const response = await api.getRestaurants();

        this.restaurants = Array.isArray(response.data)
            ? response.data
            : [];
      } catch (error) {
        console.error('Error fetching restaurants:', error);

        this.error =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred while loading the restaurants.';
      } finally {
        this.loading = false;
      }
    },

    getInitials(name) {
      if (!name) {
        return 'R';
      }

      return name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map(word => word.charAt(0).toUpperCase())
          .join('');
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.restaurant-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #172033;
  background:
      linear-gradient(
          180deg,
          #f8fafc 0%,
          #f5f8fb 48%,
          #edf4f2 100%
      );
}

.background-shape {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(12px);
}

.background-shape--top {
  top: -280px;
  right: -180px;
  width: 600px;
  height: 600px;
  background: rgba(16, 185, 129, 0.11);
}

.background-shape--bottom {
  bottom: -280px;
  left: -220px;
  width: 520px;
  height: 520px;
  background: rgba(59, 130, 246, 0.08);
}

.page-container {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 30px 0 52px;
}

.page-header {
  margin-bottom: 58px;
}

.brand-badge {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 26px;
  padding: 9px 14px;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.03em;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 999px;
  background: rgba(236, 253, 245, 0.8);
  backdrop-filter: blur(12px);
}

.brand-badge__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.1);
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  min-height: 390px;
  padding: 62px 68px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 34px;
  background:
      linear-gradient(
          130deg,
          rgba(255, 255, 255, 0.96),
          rgba(239, 253, 248, 0.88)
      );
  box-shadow:
      0 32px 80px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.hero::before {
  position: absolute;
  top: -160px;
  right: 140px;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.07);
  content: '';
}

.hero::after {
  position: absolute;
  right: -110px;
  bottom: -170px;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.05);
  content: '';
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 700px;
}

.hero__eyebrow,
.section-label,
.restaurant-card__label {
  display: block;
  color: #059669;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero__eyebrow {
  margin-bottom: 15px;
}

.hero__title {
  max-width: 690px;
  margin: 0;
  color: #101828;
  font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  font-size: clamp(48px, 7vw, 82px);
  font-weight: 850;
  letter-spacing: -0.065em;
  line-height: 0.98;
}

.hero__title span {
  color: #059669;
}

.hero__description {
  max-width: 590px;
  margin: 26px 0 32px;
  color: #667085;
  font-size: 17px;
  line-height: 1.75;
}

.hero__statistics {
  display: inline-flex;
  gap: 24px;
  align-items: center;
  padding: 15px 21px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(10px);
}

.statistic {
  display: flex;
  gap: 7px;
  align-items: baseline;
}

.statistic strong {
  color: #101828;
  font-size: 20px;
  font-weight: 800;
}

.statistic span {
  color: #667085;
  font-size: 13px;
}

.statistic-divider {
  width: 1px;
  height: 24px;
  background: #d0d5dd;
}

.hero__visual {
  position: relative;
  z-index: 2;
  display: grid;
  width: 260px;
  place-items: center;
}

.visual-circle {
  display: grid;
  width: 190px;
  height: 190px;
  place-items: center;
  border: 1px solid rgba(16, 185, 129, 0.18);
  border-radius: 50%;
  background:
      linear-gradient(145deg, #ecfdf5, #ffffff);
  box-shadow:
      0 28px 70px rgba(16, 185, 129, 0.18),
      inset 0 0 0 18px rgba(16, 185, 129, 0.045);
}

.visual-circle__inner {
  display: grid;
  width: 116px;
  height: 116px;
  place-items: center;
  color: #059669;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
}

.visual-circle svg {
  width: 54px;
  height: 54px;
}

.restaurants-section {
  margin-top: 10px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-label {
  margin-bottom: 7px;
}

.section-header h2 {
  margin: 0;
  color: #101828;
  font-size: 34px;
  font-weight: 850;
  letter-spacing: -0.045em;
}

.restaurant-count {
  padding: 9px 14px;
  color: #667085;
  font-size: 12px;
  font-weight: 750;
  border: 1px solid #e4e7ec;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.restaurant-card {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  padding: 25px;
  color: inherit;
  text-decoration: none;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(12px);
  transition:
      transform 220ms ease,
      box-shadow 220ms ease,
      border-color 220ms ease;
}

.restaurant-card:hover {
  color: inherit;
  text-decoration: none;
  border-color: rgba(16, 185, 129, 0.32);
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.13);
  transform: translateY(-7px);
}

.restaurant-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.restaurant-avatar {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  color: #047857;
  font-size: 17px;
  font-weight: 850;
  letter-spacing: -0.03em;
  border-radius: 17px;
  background:
      linear-gradient(145deg, #d1fae5, #ecfdf5);
  box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.14);
}

.restaurant-number {
  color: #b0b8c4;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.restaurant-card__content {
  padding-top: 28px;
}

.restaurant-card__label {
  margin-bottom: 8px;
  font-size: 10px;
}

.restaurant-card h3 {
  margin: 0;
  overflow-wrap: anywhere;
  color: #101828;
  font-size: 24px;
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1.2;
}

.restaurant-card p {
  display: -webkit-box;
  margin: 14px 0 26px;
  overflow: hidden;
  color: #667085;
  font-size: 14px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.restaurant-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 18px;
  color: #344054;
  font-size: 13px;
  font-weight: 800;
  border-top: 1px solid #f0f2f5;
}

.arrow-button {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: #047857;
  border-radius: 12px;
  background: #ecfdf5;
  transition:
      color 180ms ease,
      background-color 180ms ease,
      transform 180ms ease;
}

.arrow-button svg {
  width: 18px;
  height: 18px;
}

.restaurant-card:hover .arrow-button {
  color: #ffffff;
  background: #059669;
  transform: translateX(3px);
}

.state-card {
  display: flex;
  min-height: 360px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.state-icon {
  display: grid;
  width: 66px;
  height: 66px;
  place-items: center;
  color: #059669;
  border-radius: 20px;
  background: #ecfdf5;
}

.state-icon svg {
  width: 31px;
  height: 31px;
}

.state-icon--error {
  color: #dc2626;
  background: #fef2f2;
}

.state-card h2 {
  margin: 22px 0 9px;
  color: #101828;
  font-size: 24px;
}

.state-card p {
  max-width: 470px;
  margin: 0;
  color: #667085;
  line-height: 1.7;
}

.retry-button {
  margin-top: 24px;
  padding: 12px 20px;
  color: #ffffff;
  font: inherit;
  font-weight: 750;
  border: 0;
  border-radius: 12px;
  background: #101828;
  box-shadow: 0 14px 30px rgba(16, 24, 40, 0.18);
  cursor: pointer;
  transition:
      background-color 180ms ease,
      transform 180ms ease;
}

.retry-button:hover {
  background: #1d2939;
  transform: translateY(-2px);
}

.restaurant-card--skeleton {
  pointer-events: none;
}

.skeleton {
  overflow: hidden;
  border-radius: 10px;
  background: #eef1f4;
}

.skeleton::after {
  display: block;
  width: 100%;
  height: 100%;
  background:
      linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.7),
          transparent
      );
  content: '';
  animation: skeleton-loading 1.4s infinite;
  transform: translateX(-100%);
}

.skeleton--icon {
  width: 58px;
  height: 58px;
  border-radius: 17px;
}

.skeleton-content {
  padding-top: 30px;
}

.skeleton--title {
  width: 68%;
  height: 22px;
}

.skeleton--text {
  width: 100%;
  height: 58px;
  margin-top: 18px;
}

.skeleton--button {
  width: 100%;
  height: 48px;
  margin-top: 26px;
}

@keyframes skeleton-loading {
  to {
    transform: translateX(100%);
  }
}

.page-footer {
  padding-top: 48px;
  text-align: center;
}

.page-footer p {
  margin: 0;
  color: #98a2b3;
  font-size: 13px;
}

@media (max-width: 1020px) {
  .hero {
    padding: 54px 50px;
  }

  .hero__visual {
    width: 200px;
  }

  .visual-circle {
    width: 155px;
    height: 155px;
  }

  .restaurant-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .page-container {
    width: min(100% - 24px, 1180px);
    padding-top: 18px;
  }

  .page-header {
    margin-bottom: 42px;
  }

  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 42px 28px;
    border-radius: 27px;
  }

  .hero__visual {
    display: none;
  }

  .hero__title {
    font-size: clamp(43px, 14vw, 62px);
  }

  .hero__description {
    font-size: 15px;
  }

  .hero__statistics {
    width: 100%;
    justify-content: center;
  }

  .restaurant-grid {
    grid-template-columns: 1fr;
  }

  .section-header h2 {
    font-size: 29px;
  }
}

@media (max-width: 440px) {
  .brand-badge {
    font-size: 10px;
  }

  .hero {
    padding: 35px 21px;
  }

  .hero__statistics {
    gap: 15px;
    padding: 13px;
  }

  .statistic {
    flex-direction: column;
    gap: 2px;
    align-items: center;
  }

  .statistic-divider {
    height: 38px;
  }

  .restaurant-card {
    min-height: 260px;
    padding: 22px;
  }

  .restaurant-count {
    display: none;
  }
}
</style>