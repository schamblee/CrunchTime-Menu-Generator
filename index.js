const EDAMAM_SEARCH_URL = 'https://api.edamam.com/search';

let start = 0;
let end = 2;
let dietFilter = ''
let days = [];

function getDataFromApi(searchTerm, filter, from, to, callback) {
  
  const query = {
    q: `${searchTerm}`,
    diet: `${filter}`,
    from: `${from}`,
    to: `${to}`,
    calries: 'lte%20600',
    app_id: '46681c55',
    app_key: 'f465e674bcbfcc6fc086f66b4b1b75f6'
  }
  $.getJSON(EDAMAM_SEARCH_URL, query, callback);
}

function renderMenu(result) {
  let calories = `${result.recipe.calories}`
  let protein = `${result.recipe.totalNutrients.PROCNT.quantity}`
  let servings = `${result.recipe.yield}`
  let calorieCount = (calories/servings).toFixed();
  let proteinCount = (protein/servings).toFixed();

  return `<div class="col-4"> 
    <div class="recipe-card">
      <div class="recipe-title">
        <h3>${result.recipe.label}</h3>
        <p>Calories: ${calorieCount}</p>
        <p>Protein: ${proteinCount}</p>
      </div>
      <a class="js-result-name card-image" href="${result.recipe.url}" target="_blank"><img src="${result.recipe.image}" alt="${result.recipe.label}"></a>
    </div>
    </div>`;
}

function displayRecipeData(data) {
  const results = data.hits.map((item, index) => renderMenu(item));
  $('.js-search-results').html(results);
  $('.dataCount').text(results.length);  
}


function watchBeginSubmit() {
  $('.js-begin-btn').click(function(event) {
    event.preventDefault();
    console.log("begin pressed")
    $('.js-select-diet').prop('hidden', false);
    });
}


function watchDietSubmit() {
  $('.js-diet-selected').submit(event => {
    event.preventDefault();
    let userAnswer = $('input[name=selectDiet]:checked').val()
    if (userAnswer === 'yes') {
      $('.js-select-diet-yes').prop('hidden', false);
      $('.js-select-diet').prop('hidden', true);
    } else {
      $('.js-select-days').prop('hidden', false);
      $('.js-select-diet').prop('hidden', true);
    }
  });
}


function watchDietSelectedSubmit() {
  $('.js-diet-selected').submit(event => {
    event.preventDefault();
    $('.js-select-days').prop('hidden', false);
    $('.js-select-diet-yes').prop('hidden', true);
  });
}



function watchMenuSubmit() {
  $('.js-create-menu').submit(event => {
    event.preventDefault();
    $('.js-select-days').prop('hidden', true);
    $('.js-output').prop('hidden', false);
//    const queryTarget = $(event.currentTarget).find('.js-query');
//    const query = queryTarget.val();
    const filterTarget = $(event.currentTarget).find('.diet-filter')
    const dietFilter = filterTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, dietFilter, start, end, displayRecipeData);
  });
}

function handleMenuGenerator() {
  watchBeginSubmit();
  watchDietSubmit();
  watchDietSubmit();
  watchDietSelectedSubmit();
  watchMenuSubmit();
}





