const EDAMAM_SEARCH_URL = 'https://api.edamam.com/search';

function getDataFromApi(searchTerm, callback) {
  const query = {
    q: `${searchTerm}`,
    app_id: '15ee63e4',
    from: 0,
    to: 9,
    app_key: 'd955b5e8d8941a9bf3c4736e3b6b08e7'
  }
  $.getJSON(EDAMAM_SEARCH_URL, query, callback);
}

function renderResult(result) {
  return `<div class="col-4"> 
    <div class="recipe-card">
      <div class="recipe-title">
        <h3>${result.recipe.label}</h3>
        <p>
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
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayRecipeData);
  });
}

$(watchSubmit);
