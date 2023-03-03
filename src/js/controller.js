import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot){
//   module.hot.accept()
// }

///////////////////////////////////////

const controlRecipes = async function () {    
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

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
    resultsView.renderSpinner ();
    
    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search results
    await model.loadSearchResults(query);

    // 3. Render Results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err)
  }
};

const controlPagination = function (goToPage) {
  // 1. Render New Results
    resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render New pagination buttons
  paginationView.render(model.state.search)
};

const controlServings  = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view;
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();


