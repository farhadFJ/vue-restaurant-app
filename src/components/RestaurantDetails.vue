<template>
  <div class="page-shell">
    <div class="background-glow background-glow--left"></div>
    <div class="background-glow background-glow--right"></div>

    <main class="menu-page">
      <header class="top-navigation">
        <button
            type="button"
            class="back-button"
            @click="goBack"
        >
          <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
          >
            <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>

          <span>Restaurants</span>
        </button>

        <div class="menu-badge">
          <span class="menu-badge__dot"></span>
          Digital Menu
        </div>
      </header>

      <section
          v-if="loading"
          class="state-card"
      >
        <div class="loader"></div>
        <h2>Loading menu</h2>
        <p>Please wait while we prepare the restaurant menu.</p>
      </section>

      <section
          v-else-if="error"
          class="state-card state-card--error"
      >
        <div class="state-icon">
          !
        </div>

        <h2>Unable to load the menu</h2>
        <p>{{ error }}</p>

        <button
            type="button"
            class="retry-button"
            @click="loadRestaurantData"
        >
          Try again
        </button>
      </section>

      <template v-else>
        <section class="hero-section">
          <div class="hero-content">
            <span class="eyebrow">Welcome to</span>

            <h1 class="restaurant-name">
              {{ restaurant.name }}
            </h1>

            <p class="hero-description">
              Discover our carefully selected dishes and drinks.
            </p>

            <div class="menu-statistics">
              <div class="statistic">
                <strong>{{ visibleGroups.length }}</strong>
                <span>Categories</span>
              </div>

              <div class="statistic-divider"></div>

              <div class="statistic">
                <strong>{{ totalArticles }}</strong>
                <span>Menu items</span>
              </div>
            </div>
          </div>

          <div class="hero-decoration">
            <div class="hero-decoration__circle">
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
        </section>

        <section
            v-if="visibleGroups.length === 0"
            class="state-card"
        >
          <div class="state-icon">
            ☰
          </div>

          <h2>No menu items yet</h2>
          <p>This restaurant has not added any menu items.</p>
        </section>

        <section
            v-for="group in visibleGroups"
            :key="group.id"
            class="group-section"
        >
          <div class="group-header">
            <div>
              <span class="group-label">Category</span>
              <h2>{{ group.name }}</h2>
            </div>

            <span class="item-count">
              {{ group.articles.length }}
              {{ group.articles.length === 1 ? 'item' : 'items' }}
            </span>
          </div>

          <div class="article-grid">
            <article
                v-for="article in group.articles"
                :key="article.id"
                class="article-card"
            >
              <div class="article-image-wrapper">
                <img
                    v-if="article.image && !imageErrors[article.id]"
                    :src="imageUrl(article.image)"
                    :alt="article.name"
                    class="article-image"
                    loading="lazy"
                    @error="handleImageError(article.id)"
                >

                <div
                    v-else
                    class="image-placeholder"
                >
                  <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                  >
                    <path
                        d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14H4V5Zm0 10 4-4 4 4 2-2 6 6M16 8h.01"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                  </svg>

                  <span>No image</span>
                </div>

                <div class="image-overlay"></div>
              </div>

              <div class="article-content">
                <div class="article-heading">
                  <h3>{{ article.name }}</h3>

                  <span class="article-price">
                    {{ formatPrice(article.price) }}
                  </span>
                </div>

                <p class="article-description">
                  {{ article.description || 'No description available.' }}
                </p>

                <div class="article-footer">
                  <span class="availability">
                    <span class="availability__dot"></span>
                    Available
                  </span>

                  <span class="category-name">
                    {{ group.name }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <footer class="page-footer">
          <button
              type="button"
              class="footer-back-button"
              @click="goBack"
          >
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
              <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>

            Back to restaurants
          </button>
        </footer>
      </template>
    </main>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'RestaurantDetails',

  data() {
    return {
      restaurant: null,
      articleGroups: [],
      imageErrors: {},
      loading: true,
      error: '',
    };
  },

  computed: {
    visibleGroups() {
      return this.articleGroups.filter(group => {
        return Array.isArray(group.articles) && group.articles.length > 0;
      });
    },

    totalArticles() {
      return this.visibleGroups.reduce((total, group) => {
        return total + group.articles.length;
      }, 0);
    },
  },

  created() {
    this.loadRestaurantData();
  },

  methods: {
    async loadRestaurantData() {
      this.loading = true;
      this.error = '';

      const restaurantId = Number(this.$route.params.id);

      try {
        const [
          restaurantsResponse,
          articleGroupsResponse,
          articlesResponse,
        ] = await Promise.all([
          api.getRestaurants(),
          api.getArticleGroups(),
          api.allocateArticles(restaurantId, []),
        ]);

        const restaurants = restaurantsResponse.data || [];
        const groups = articleGroupsResponse.data || [];
        const articles = articlesResponse.data || [];

        this.restaurant = restaurants.find(restaurant => {
          return Number(restaurant.id) === restaurantId;
        });

        if (!this.restaurant) {
          throw new Error('The requested restaurant could not be found.');
        }

        this.articleGroups = groups.map(group => ({
          ...group,
          articles: articles.filter(article => {
            return Number(article.article_group_id) === Number(group.id);
          }),
        }));
      } catch (error) {
        console.error('Error fetching restaurant data:', error);

        this.error =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred.';
      } finally {
        this.loading = false;
      }
    },

    imageUrl(imagePath) {
      if (!imagePath) {
        return '';
      }

      if (
          imagePath.startsWith('http://') ||
          imagePath.startsWith('https://')
      ) {
        return imagePath;
      }

      const normalizedPath = imagePath.replace(/^\/+/, '');

      return `http://127.0.0.1:8000/storage/${normalizedPath}`;
    },

    handleImageError(articleId) {
      this.$set(this.imageErrors, articleId, true);
    },

    formatPrice(price) {
      const numericPrice = Number(price);

      if (Number.isNaN(numericPrice)) {
        return '€0.00';
      }

      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(numericPrice);
    },

    goBack() {
      this.$router.push({
        name: 'RestaurantList',
      });
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #172033;
  background:
      linear-gradient(180deg, #f8fafc 0%, #f4f7fb 48%, #edf3f7 100%);
}

.background-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(20px);
  opacity: 0.55;
}

.background-glow--left {
  top: -220px;
  left: -180px;
  background: rgba(16, 185, 129, 0.18);
}

.background-glow--right {
  right: -220px;
  bottom: -240px;
  background: rgba(59, 130, 246, 0.13);
}

.menu-page {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 60px;
}

.top-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-button,
.footer-back-button,
.retry-button {
  font: inherit;
  cursor: pointer;
}

.back-button {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 15px;
  color: #344054;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(12px);
  transition:
      transform 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
}

.back-button:hover {
  border-color: rgba(16, 185, 129, 0.45);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}

.back-button svg,
.footer-back-button svg {
  width: 19px;
  height: 19px;
}

.menu-badge {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  padding: 9px 14px;
  color: #047857;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 999px;
  background: rgba(236, 253, 245, 0.78);
}

.menu-badge__dot,
.availability__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.11);
}

.hero-section {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  min-height: 260px;
  padding: 50px 58px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  background:
      linear-gradient(
          125deg,
          rgba(255, 255, 255, 0.96),
          rgba(240, 253, 250, 0.88)
      );
  box-shadow:
      0 30px 80px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.hero-section::after {
  position: absolute;
  top: -90px;
  right: 120px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.08);
  content: '';
}

.hero-content {
  position: relative;
  z-index: 1;
}

.eyebrow,
.group-label {
  display: block;
  margin-bottom: 8px;
  color: #059669;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.restaurant-name {
  margin: 0;
  color: #101828;
  font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  font-size: clamp(38px, 6vw, 66px);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 1;
}

.hero-description {
  max-width: 520px;
  margin: 20px 0 28px;
  color: #667085;
  font-size: 16px;
  line-height: 1.7;
}

.menu-statistics {
  display: inline-flex;
  gap: 22px;
  align-items: center;
  padding: 14px 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.statistic {
  display: flex;
  gap: 6px;
  align-items: baseline;
}

.statistic strong {
  color: #101828;
  font-size: 20px;
}

.statistic span {
  color: #667085;
  font-size: 13px;
}

.statistic-divider {
  width: 1px;
  height: 22px;
  background: #d0d5dd;
}

.hero-decoration {
  position: relative;
  z-index: 1;
  padding-right: 30px;
}

.hero-decoration__circle {
  display: grid;
  width: 130px;
  height: 130px;
  place-items: center;
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 50%;
  background:
      linear-gradient(145deg, #ecfdf5, #ffffff);
  box-shadow:
      0 25px 60px rgba(16, 185, 129, 0.16),
      inset 0 0 0 12px rgba(16, 185, 129, 0.05);
}

.hero-decoration__circle svg {
  width: 52px;
  height: 52px;
}

.group-section {
  margin-top: 54px;
}

.group-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 22px;
}

.group-header h2 {
  margin: 0;
  color: #101828;
  font-size: 29px;
  font-weight: 800;
  letter-spacing: -0.035em;
}

.item-count {
  padding: 8px 12px;
  color: #667085;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #e4e7ec;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.article-card {
  display: grid;
  grid-template-columns: 180px 1fr;
  min-height: 190px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(12px);
  transition:
      transform 220ms ease,
      box-shadow 220ms ease,
      border-color 220ms ease;
}

.article-card:hover {
  border-color: rgba(16, 185, 129, 0.26);
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.13);
  transform: translateY(-5px);
}

.article-image-wrapper {
  position: relative;
  min-height: 190px;
  overflow: hidden;
  background: #e8eef3;
}

.article-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 190px;
  object-fit: cover;
  object-position: center;
  transition: transform 500ms ease;
}

.article-card:hover .article-image {
  transform: scale(1.06);
}

.image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
      linear-gradient(
          90deg,
          transparent 55%,
          rgba(15, 23, 42, 0.08)
      );
}

.image-placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 190px;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  color: #98a2b3;
  background:
      linear-gradient(135deg, #f2f4f7, #e4e7ec);
}

.image-placeholder svg {
  width: 36px;
  height: 36px;
}

.image-placeholder span {
  font-size: 12px;
  font-weight: 600;
}

.article-content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 24px;
}

.article-heading {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: space-between;
}

.article-heading h3 {
  margin: 0;
  overflow-wrap: anywhere;
  color: #101828;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.025em;
  text-transform: capitalize;
}

.article-price {
  flex-shrink: 0;
  color: #047857;
  font-size: 17px;
  font-weight: 800;
}

.article-description {
  display: -webkit-box;
  margin: 15px 0 22px;
  overflow: hidden;
  color: #667085;
  font-size: 14px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.article-footer {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.availability {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  color: #475467;
  font-size: 12px;
  font-weight: 700;
}

.availability__dot {
  width: 6px;
  height: 6px;
}

.category-name {
  max-width: 120px;
  overflow: hidden;
  color: #98a2b3;
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.page-footer {
  display: flex;
  justify-content: center;
  padding-top: 54px;
}

.footer-back-button,
.retry-button {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  padding: 13px 20px;
  color: #ffffff;
  border: 0;
  border-radius: 13px;
  background: #101828;
  box-shadow: 0 14px 28px rgba(16, 24, 40, 0.18);
  transition:
      transform 180ms ease,
      background-color 180ms ease;
}

.footer-back-button:hover,
.retry-button:hover {
  background: #1d2939;
  transform: translateY(-2px);
}

.state-card {
  display: flex;
  min-height: 360px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  padding: 48px;
  text-align: center;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.state-card h2 {
  margin: 20px 0 8px;
  color: #101828;
}

.state-card p {
  max-width: 440px;
  margin: 0 0 24px;
  color: #667085;
  line-height: 1.6;
}

.state-icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  color: #059669;
  font-size: 24px;
  font-weight: 800;
  border-radius: 18px;
  background: #ecfdf5;
}

.state-card--error .state-icon {
  color: #dc2626;
  background: #fef2f2;
}

.loader {
  width: 42px;
  height: 42px;
  border: 4px solid #d1fae5;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 750ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .article-grid {
    grid-template-columns: 1fr;
  }

  .hero-section {
    padding: 44px;
  }
}

@media (max-width: 700px) {
  .menu-page {
    width: min(100% - 24px, 1180px);
    padding-top: 16px;
  }

  .menu-badge {
    display: none;
  }

  .hero-section {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 36px 26px;
    border-radius: 24px;
  }

  .hero-decoration {
    display: none;
  }

  .restaurant-name {
    font-size: 42px;
  }

  .menu-statistics {
    width: 100%;
    justify-content: center;
  }

  .group-section {
    margin-top: 40px;
  }

  .group-header {
    align-items: flex-start;
  }

  .group-header h2 {
    font-size: 25px;
  }

  .article-card {
    grid-template-columns: 1fr;
  }

  .article-image-wrapper,
  .article-image,
  .image-placeholder {
    min-height: 230px;
  }

  .article-content {
    padding: 22px;
  }
}

@media (max-width: 430px) {
  .hero-description {
    font-size: 14px;
  }

  .menu-statistics {
    gap: 14px;
    padding: 12px;
  }

  .statistic {
    flex-direction: column;
    gap: 1px;
    align-items: center;
  }

  .statistic-divider {
    height: 34px;
  }

  .article-heading {
    flex-direction: column;
    gap: 9px;
  }

  .article-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>