const EDAMAM_SEARCH_URL = 'https://api.edamam.com/search';

let start = 0;
let end = 1;
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


function watchBeginClick() {
  $('.js-begin-btn').click(event => {
    event.preventDefault();
    $('.js-select-diet').prop('hidden', false);
    $('.js-intro').prop('hidden', true);
    });
}


function watchDietSubmit() {
  $('.js-select-diet').submit(event => {
    event.preventDefault();
    let userAnswer = $('input[name=selectDiet]:checked').val()
    if (userAnswer === 'yes') {
      $('.js-select-diet').prop('hidden', true);
      $('.js-select-diet-yes').prop('hidden', false);
    } else {
      $('.js-select-diet').remove();
      $('.js-select-days').prop('hidden', false);

    }
  });
}


function watchDietSelection() {
  $('.js-select-diet-yes').submit(event => {
    event.preventDefault();
    $('.js-select-diet-yes').prop('hidden', true);
    $('.js-select-days').prop('hidden', false);
  });
}

function watchMenuSubmit() {
  $('.js-select-days').submit(event => {
    event.preventDefault();
    $('.js-select-days').prop('hidden', true);
    $('.js-output').prop('hidden', false);
    /*const query = 'chicken'
    const filterTarget = $(event.currentTarget).find('.diet-filter')
    const dietFilter = filterTarget.val();
    getDataFromApi(query, dietFilter, start, end, displayRecipeData);*/
  });
}

function handleMenuGenerator() {
  watchBeginClick();
  watchDietSubmit();
  watchDietSelection();
  watchMenuSubmit();
}

$(handleMenuGenerator);




