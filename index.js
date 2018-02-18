
let dietFilter = '';
let dayIndex = -1;
let allergies = [];

function getRecipesForWeek(allergies, diet) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?diet=${diet}&addRecipeInformation=false&number=7&offset=${Math.floor(Math.random() * 900)}&instructionsRequired=true&intolerances=${allergies}&limitLicense=false&maxCalories=600&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipesForWeek(result) },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
  };


function getRecipeForDay(allergies, diet, day) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?diet=${diet}&addRecipeInformation=false&number=1&offset=${Math.floor(Math.random() * 900)}&instructionsRequired=true&intolerances=${allergies}&limitLicense=false&maxCalories=600&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { 
        
        $(`.${day}`).text(`${result.title}`); 
        console.log(`${result.title}`)
      },
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
        <h3 class="recipe-title ${days[dayIndex]}">${result.title}</h3>
        <p>Calories: ${result.calories}</p>
        <p>Protein: ${result.protein}</p>
      </div>
      <a class="js-result-name" href="${result.image}" target="_blank"><img class="card-image" src="${result.image}" alt="${result.title}"></a>
      <button type="button" class="js-view-recipe">View Recipe</button>
      <button class="js-next-option" value="${days[dayIndex]}">Next Option</button>
      <button class="js-remove-day">Remove Day</button>
    </div>
  </div>
`
}

function displayRecipesForWeek(data) {
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
      $('.js-select-diet').prop('hidden', false);
    } else {
      $('.js-select-diet').remove();
      $('.js-select-days').prop('hidden', false);

    }
  });
}


function watchDietSelection() {
  $('.js-select-diet').submit(event => {
    event.preventDefault();
    $('.js-select-diet').prop('hidden', true);
    $('.js-select-days').prop('hidden', false);
  });
}

function watchMenuSubmit() {
  $('.js-select-diet').submit(event => {
    event.preventDefault();
    $('.js-select-days').prop('hidden', true);
    $('.js-output').prop('hidden', false);
    dietFilter = 'vegetarian'//filterTarget.val();
    allergyList = ['dairy']
    getRecipesForWeek(dietFilter, allergyList);
  });
}

function findNextRecipe() {
  $('.js-output').on('click', '.js-next-option', function(event) {
  event.preventDefault();
  let dayCard = $(this).val();
  getRecipeForDay(dietFilter, allergyList, dayCard);
  console.log(`${dayCard} option pressed`)
  })
}

function handleMenuGenerator() {
  watchBeginClick();
  watchDietSubmit();
  watchDietSelection();
  watchMenuSubmit();
  findNextRecipe();
}

$(handleMenuGenerator)




