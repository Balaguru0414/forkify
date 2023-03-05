import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

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

    // 1. updatating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading recipe
    await model.loadRecipe(id);
    // const {recipe} = model.state;           // recipe = model.state.recipe

    // 3. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch(err) {
    recipeView.renderError();
    console.error(err)
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
    bookmarksView.update(model.state.bookmarks);

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.error(err)
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
};

const controlAddBookmark = function () {
  // 1. add/remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. update recipe view
  recipeView.update(model.state.recipe);

  // 3. render bookmark
  bookmarksView.render(model.state.bookmarks)
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading Spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`);
    // window.history.back(); // automatically go back

    // close from window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error('😞',err);
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();


