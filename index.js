let dietFilter = ''
let dayIndex = -1;

function getRecipeItems() { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=false&number=7&offset=${Math.floor(Math.random() * 100)}&instructionsRequired=true&intolerances=peanut%2C+shellfish&limitLicense=false&maxCalories=500&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipeData(result) },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
  };

function setHeader(xhr) {
        xhr.setRequestHeader('X-Mashape-Key', 'DwXMjCgQGQmshC8MyFU6bVgOQS1Lp1tlRvZjsn3JvI9Q2hZZBC');
      }

function getRecipeInstructions(id) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/analyzedInstructions`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipeData(result) },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
}



function renderMenu(result) {
  dayIndex++
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  return `
  <div class="col-4"> 
    <div class="recipe-card">
      <div class="recipe-title">
        <span class = "day-title">${days[dayIndex]}</span>
        <h3 class="recipe-title">${result.title}</h3>
        <p>Calories: ${result.calories}</p>
        <p>Protein: ${result.protein}</p>
      </div>
      <a class="js-result-name" href="${result.image}" target="_blank"><img class="card-image" src="${result.image}" alt="${result.title}"></a>
      <button class="view-recipe">View Recipe</button>
      <button class="next-option">Next Option</button>
      <button class="remove-day">Remove Day</button>
    </div>
  </div>`
}

function displayRecipeData(data) {
  const results = data.results.map((item, index) => renderMenu(item));
  $('.js-search-results').html(results);
}

function watchNextOptionClick() {
  $('.recipe-card').on('click', '.next-option', function(event) {
    event.preventDefault()
    let recipeId = $(event.currentTarget).find('.recipe-title').val()
    console.log(`the recipe id is ${recipeId}`);
    })
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
    //let query = items[Math.floor(Math.random()*items.length)];
    const query = ''
    //const filterTarget = $(event.currentTarget).find('.diet-filter')
    const dietFilter = 'vegetarian'//filterTarget.val();
    getRecipeItems();
  });
}

function handleMenuGenerator() {
  watchBeginClick();
  watchDietSubmit();
  watchDietSelection();
  watchMenuSubmit();
}

$(handleMenuGenerator)




