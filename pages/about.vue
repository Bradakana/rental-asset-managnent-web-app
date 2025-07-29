<template>
  <div class="about-page">
    <div class="about-container">
      <h1 class="about-title">About Us</h1>
      <p class="about-desc">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam eros, a facilisis enim erat nec urna. 
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
        Suspendisse potenti. Etiam euismod, justo eu facilisis cursus, enim urna dictum massa, nec cursus enim erat nec urna.
      </p>
      <p class="about-desc">
        Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing vitae est. 
        Sed nec felis pellentesque, lacinia dui sed, ultricies sapien. Pellentesque orci lectus, consectetur vel posuere posuere, rutrum eu ipsum.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #1d4857;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}
.about-container {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(29, 72, 87, 0.10);
  padding: 48px 36px;
  max-width: 700px;
  width: 100%;
}
.about-title {
  color: #1d4857;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}
.about-desc {
  color: #444;
  font-size: 1.15rem;
  margin-bottom: 18px;
  line-height: 1.7;
  text-align: center;
}
</style>