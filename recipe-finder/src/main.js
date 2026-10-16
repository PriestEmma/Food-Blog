const API = 'https://www.themealdb.com/api/json/v1/1';

const resultEl = document.getElementById('results');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const statusEl = document.getElementById('status');
const detailEl = document.getElementById('detail');

let allMeals = [];

async function getAll(query) {
  const [meals, categories] = await Promise.all([
    (await fetch(`${API}/search.php?s=${query}`)).json(),
    getCategories(),
  ]);

  return [meals, categories];
}

async function getMeals(query) {
  const res = await fetch(`${API}/search.php?s=${query}`);
  const data = await res.json();
  return data.meals ?? [];
}

async function getCategories() {
  const res = await fetch(`${API}/categories.php`);
  const data = await res.json();
  return data;
}

async function getMealById(id) {
  const res = await fetch(`${API}/lookup.php?i=${id}`);
  const data = await res.json();

  return data.meals[0];
}

function renderMeals(meals) {
  if (meals.length === 0) {
    resultEl.innerHTML = '';
    statusEl.textContent = 'No recipes found. Try another search.';
    return;
  }
  statusEl.textContent = '';

  const cards = meals.map(
    (meal) =>
      `
 <article class="recipe-card" data-id="${meal.idMeal}">

  <img class="recipe-card__img" src="${meal.strMealThumb}" alt="${meal.strMeal}" crossorigin="anonymous" />

  <div class="recipe-card__body">
  <h2 class="recipe-card__title">${meal.strMeal}</h2>

  <p class="recipe-card__meta">${meal.strCategory} · ${meal.strArea ?? 'International'}</p>

     </div>
      </article>
  `,
  );
  resultEl.innerHTML = cards.join('');
}

function renderFiltered() {
  const category = categoryFilter.value;

  const meals = category
    ? allMeals.filter((meal) => meal.strCategory === category)
    : allMeals;

  renderMeals(meals);
}

function getIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    console.log(measure, name);

    if (name && name.trim() !== '') {
      ingredients.push(`${measure ?? ''} ${name}`.trim());
    }
  }

  return ingredients;
}

function renderDetail(meal) {
  const ingredients = getIngredients(meal);
  detailEl.innerHTML = `
    <button class="detail__back" type="button">← Back to results</button>
    <img class="detail__img" src="${meal.strMealThumb}" alt="${meal.strMeal}" crossorigin="anonymous" />
    <h2 class="detail__title">${meal.strMeal}</h2>
    <p class="detail__meta">${meal.strCategory} · ${meal.strArea ?? 'International'}</p>
    <h3>Ingredients</h3>
    <ul class="detail__ingredients">
      ${ingredients.map((item) => `<li>${item}</li>`).join('')}
    </ul>
    <h3>Instructions</h3>
    <p class="detail__instructions">${meal.strInstructions}</p>`;
  detailEl.hidden = false;
  resultEl.hidden = true;
}

function showResults() {
  detailEl.hidden = true;
  resultEl.hidden = false;
}

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  allMeals = await getMeals(searchInput.value);

  renderFiltered();
});

categoryFilter.addEventListener('change', () => {
  renderFiltered();
});

resultEl.addEventListener('click', async (e) => {
  const card = e.target.closest('.recipe-card');

  if (!card) return;
  statusEl.textContent = 'Loading Recipe....';

  try {
    const meal = await getMealById(card.dataset.id);
    statusEl.textContent = '';
    renderDetail(meal);
  } catch (error) {
    statusEl.textContent = error.message;
  }
});

detailEl.addEventListener('click', (e) => {
  if (e.target.closest('.detail__back')) {
    showResults();
  }
});

async function init() {
  statusEl.textContent = 'Loading recipes...';
  try {
    const [{ meals }, { categories }] = await getAll('');

    categories.forEach((category) => {
      let option = document.createElement('option');
      option.value = category.strCategory;
      option.textContent = category.strCategory;

      categoryFilter.appendChild(option);
    });

    allMeals = await meals;

    renderMeals(allMeals);
    renderFiltered();
  } catch (error) {
    statusEl.textContent = 'Could not load recipes. Please refresh the page.';
  }
}

init();
