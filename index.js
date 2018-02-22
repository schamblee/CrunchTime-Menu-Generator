
//Global variables are set by the user to indicate their diet and allergy information
let allergies = [];
let dietFilter = '';


let dayIndex = -1;
let offset = 1

function getRecipesForWeek(allergies, diet) { 
  let recipeIndex = Math.floor(Math.random() * 200)
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?diet=${diet}&addRecipeInformation=false&number=7&offset=${recipeIndex}&instructionsRequired=true&intolerances=${allergies}&limitLicense=false&maxCalories=600&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { console.log(result); displayRecipesForWeek(result, recipeIndex) },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
  };


function getRecipeForDay(allergies, diet, day, query, offset) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?query=${query}&diet=${diet}&addRecipeInformation=false&number=1&offset=${offset}&instructionsRequired=true&intolerances=${allergies}&limitLicense=false&maxCalories=600&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipeForDay(result, day) },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
  };



function setHeader(xhr) {
        xhr.setRequestHeader('X-Mashape-Key', 'DwXMjCgQGQmshC8MyFU6bVgOQS1Lp1tlRvZjsn3JvI9Q2hZZBC');
      }


function getRecipeInfo(id) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/information`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { console.log(result); renderRecipeInfo(result) },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
}




function displayRecipeForDay(data, day) {
  const results = data.results.map((item, day, index) => renderDayCard(item, day));
  $(`#${day}Card`).html(results);
}


function renderRecipeInfo(result)  {
  for (let i = 0; i < result.extendedIngredients.length; i++) {
    $(`.recipe-ingredients`).append(`<li> ${result.extendedIngredients[i].amount} ${result.extendedIngredients[i].unit} - ${result.extendedIngredients[i].name}</li>`)
  }
  for (let x = 0; x < result.analyzedInstructions.length; x++) {
    for (let y = 0; y < result.analyzedInstructions[x].steps.length; y++) {
    $(`.recipe-instructions`).append(`<li>${result.analyzedInstructions[x].steps[y].step}</li>`)
    }
  }
}



function renderMenu(offset, result) {
  dayIndex++
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  return `
  <div class="col-4"> 
    <span id="ingredient-query${days[dayIndex]}" class="ingredient-query"></span>
    <span id="day-title${days[dayIndex]}" class = "day-title">${days[dayIndex]}</span>
    <div id="${days[dayIndex]}Card" class="recipe-card">
        <h3 id="recipe-title${days[dayIndex]}" class="recipe-title">${result.title}</h3>
        <p id="calories${days[dayIndex]}">Calories: ${result.calories}</p>
        <p id="protein${days[dayIndex]}">Protein: ${result.protein}</p>
        <img id="card-image${days[dayIndex]}" class="card-image" src="${result.image}" alt="${result.title} image">
    </div>
        <!-- Trigger/Open The Modal -->
         <button id="js-view-recipe-btn" class="js-view-recipe-btn" value="${result.id}">View Recipe</button>

         <input id="search-by-ingredient${days[dayIndex]}" class="search-by-ingredient" type="search" name="search-by-ingredient" placeholer="Search By Ingredient">
         <button id="search-by-ingredient-btn" class="search-by-ingredient-btn" value="${days[dayIndex]}">Search</button>
         <button id="js-next-result-btn${days[dayIndex]}" class="js-next-result-btn" value="${days[dayIndex]}">Next Result</button>
         <button id="js-previous-result-btn${days[dayIndex]}" class="js-previous-result-btn" value="${days[dayIndex]}" aria-live="assertive" hidden>Previous Result</button>
         <button id="js-remove-day${days[dayIndex]}" class="js-remove-day" value="${days[dayIndex]}">Remove Day</button>

        <!-- The Modal -->
        <div id="recipeModal" class="modal">

        <!-- Modal content -->
      <div class="modal-content">
          <span class="close">&times;</span>
          <h3 id="recipe-title${days[dayIndex]}">${result.title}</h3>
          <img id="card-image${days[dayIndex]}" class="modal-card-image" src="${result.image}" alt="${result.title} image">
          <section role="region" id="recipe-ingredients${days[dayIndex]}" class="recipe-ingredients">
          </section>  
          <section role="region" id="recipe-instructions${days[dayIndex]}" class="recipe-instructions">
          </section>     
        </div>
      </div>
    </div>
`
}


function renderDayCard(result, day) {  
  day = `${day}`
  return `
        <h3 class="recipe-title">${result.title}</h3>
        <p>Calories: ${result.calories}</p>
        <p>Protein: ${result.protein}</p>
      <img id="card-image${days}" class="card-image" src="${result.image}" alt="${result.title}">

`
}

function displayRecipesForWeek(data, recipeIndex) {
  const results = data.results.map((item, recipeIndex, index) => renderMenu(recipeIndex, item));
  $('.js-search-results').html(results);
  // Get the modal
let modal = document.getElementById('recipeModal');


// Get the button that opens the modal
let btn = document.getElementById("js-view-recipe-btn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
    let recipeId = $(this).val();
    getRecipeInfo(recipeId);
    console.log(`${recipeId}`)
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
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
    $('.js-menu-controls').prop('hidden', false);
    
    dietFilter = ''//filterTarget.val();
    allergyList = ['dairy']
    getRecipesForWeek(allergyList, dietFilter);
  });
}

function watchSearchByIngredientClick() {
  $('.js-output').on('click', '.search-by-ingredient-btn', function(event) {
  event.preventDefault();
  let day = $(this).val();
  let ingredient = $(`#search-by-ingredient${day}`).val();
  $(`#ingredient-query${day}`).text(`Result for ${ingredient}`)
  dietFilter = ''
  allergyList = ['']
  offset = Math.floor(Math.random() * 200)
  getRecipeForDay(allergyList, dietFilter, day, ingredient, offset);
  console.log(`${day} ${ingredient} option pressed`)
  })
}

function watchNextResultClick() {
  $('.js-output').on('click', '.js-next-result-btn', function(event) {
  event.preventDefault();
  let day = $(this).val()
  $(`#js-previous-result-btn${day}`).prop('hidden', false);
  let ingredient = ''
  dietFilter = ''
  allergyList = ['dairy']
  offset ++
  getRecipeForDay(allergyList, dietFilter, day, ingredient, offset);
  console.log(`${day} ${ingredient} option pressed`)
  })
}

function watchPreviousResultClick() {
  $('.js-output').on('click', '.js-previous-result-btn', function(event) {
  event.preventDefault();
  let day = $(this).val()
  let ingredient = ''
  dietFilter = ''//filterTarget.val();
  allergyList = ['dairy']
  offset --
  getRecipeForDay(allergyList, dietFilter, day, ingredient, offset);
  console.log(`${day} ${ingredient} option pressed`)
  })
}

function renderDayCard(result, day) {  
  return `
        <h3 id="recipe-title${day}" class="recipe-title">${result.title}</h3>
        <p id="calories${day}"">Calories: ${result.calories}</p>
        <p id="protein${day}">Protein: ${result.protein}</p>
      <img id="card-image${day}" class="card-image" src="${result.image}" alt="${result.title}">

`}

function watchRemoveClick() {
   $('.js-output').on('click', '.js-remove-day', function(event) {
  event.preventDefault();
  let day = $(this).val()
  let ingredient = ''
  dietFilter = ''
  allergyList = ['']
  $(`#${day}Card`).html(renderNotCooking(day));
  console.log(`${day} ${ingredient} option pressed`)
  })
}

function renderNotCooking(day) {  
  return `
        <h3 id="recipe-title${day}" class="recipe-title">Not Cooking</h3>
        <p id="calories${day}""> </p>
        <p id="protein${day}"></p>
      <img id="card-image${day}" class="card-image" src="https://www.displayfakefoods.com/store/pc/catalog/2189-lg.jpg" alt="Not cooking image">

`}

function watchStartOver() {
  $('.js-menu-controls').on('click', '.js-start-over', function(event) {
    event.preventDefault();
    console.log("refresh clicked")
    location.reload();
  })
}

function watchRefreshMenuClick() {
  $('.js-menu-controls').on('click', '.js-refresh-menu', function(event) {
    dietFilter = ''
    allergyList = ['']
    dayIndex -= 7
    getRecipesForWeek(allergyList, dietFilter);
})
}


function handleMenuGenerator() {
  watchBeginClick();
  watchDietSubmit();
  watchDietSelection();
  watchMenuSubmit();
  watchSearchByIngredientClick();
  watchNextResultClick();
  watchPreviousResultClick();
  watchRemoveClick();
  watchRefreshMenuClick();
  watchStartOver()
}

$(handleMenuGenerator)




