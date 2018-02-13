const EDAMAM_SEARCH_URL = 'https://api.edamam.com/search';

let start = 0;
let end = 2;

function getDataFromApi(searchTerm, filter, from, to, callback) {
  
  const query = {
    q: `${searchTerm}`,
    diet: `${filter}`,
    from: `${from}`,
    to: `${to}`,
    ingr: 5,
    app_id: '46681c55',
    app_key: 'f465e674bcbfcc6fc086f66b4b1b75f6'
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

function loadMoreRecipes(query, dietFilter) {
  $(window).scroll(function() {
	  if ($(this).scrollTop() + 1 >= $('body').height() - $(window).height()) {
		start += 9;
		end += 9;
		$('body').append(getDataFromApi(query, dietFilter, start, end, displayRecipeData))
	    setTimeout(80000)
	  }
	})
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
    getDataFromApi(query, dietFilter, start, end, displayRecipeData);
    //loadMoreRecipes(query, dietFilter);
  });
}

$(watchSubmit);



