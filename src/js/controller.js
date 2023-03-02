import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime';



///////////////////////////////////////

const controlRecipes = async function () {    
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1. Loading recipe
    await model.loadRecipe(id);
    // const {recipe} = model.state;           // recipe = model.state.recipe

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch(err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search results
    await model.loadSearchResults(query);

    // 3. Render Results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err)
  }
};
controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}
init();


