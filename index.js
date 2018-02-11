const EDAMAM_SEARCH_URL = 'https://api.edamam.com/search';


function getDataFromApi(searchTerm, filter, callback) {
  const query = {
    q: `${searchTerm}`,
    diet: `${filter}`,
    from: 0,
    to: 12,
    app_id: '15ee63e4',
    app_key: 'd955b5e8d8941a9bf3c4736e3b6b08e7'
  }
  $.getJSON(EDAMAM_SEARCH_URL, query, callback);
}

function renderResult(result) {
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
  const results = data.hits.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
  $('.dataCount').text(results.length);
  
   
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    $('.js-output').prop('hidden', false);
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    const filterTarget = $(event.currentTarget).find('.diet-filter')
    const dietFilter = filterTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, dietFilter, displayRecipeData);
    let carbs = `${result.recipe.totalNutrients.CHOCDF.quantity}`
    console.log(carbs);
  });
}

$(watchSubmit);
