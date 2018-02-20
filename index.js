
let dietFilter = '';
let dayIndex = -1;
let allergies = [];

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


function getRecipeForDay(allergies, diet, day, query) { 
  dayCard = `${day}Card`
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?query=${query}&diet=${diet}&addRecipeInformation=false&number=1&offset=1&instructionsRequired=true&intolerances=${allergies}&limitLicense=false&maxCalories=600&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipeForDay(result, dayCard)
      },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
  };


function displayRecipeForDay(data, day) {
  const results = data.results.map((item, day, index) => renderDayCard(item, day));
  $(`.recipe-details`).html(results);
}



function setHeader(xhr) {
        xhr.setRequestHeader('X-Mashape-Key', 'DwXMjCgQGQmshC8MyFU6bVgOQS1Lp1tlRvZjsn3JvI9Q2hZZBC');
      }

function getRecipeInfo(id) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/324694/analyzedInstructions`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { console.log(result); displayRecipeInfo(result) },
      error: function() { alert('boo!'); },
      beforeSend: setHeader
      });
}

function displayRecipeInfo(data) {
    renderRecipeDetails(data);
    const results = data.map((item, index) => renderRecipeDetails(item));
    $(`.recipe-details`).html(results);
}

function renderRecipeDetails(result) {
  let steps = `${result.steps}`
  for(let i = 0; i < steps.length; i++) {
    return `<div>${steps[i].step}</div>`
  }

}



function renderMenu(offset, result) {
  dayIndex++
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  return `
  <div class="col-4"> 
    <span class="${days[dayIndex]}ingredient-query"></span>
    <span class = "day-title" value="${days[dayIndex]}">${days[dayIndex]}</span>
    <div class="recipe-card ${days[dayIndex]}Card">
        <h3 class="recipe-title">${result.title}</h3>
        <p>Calories: ${result.calories}</p>
        <p>Protein: ${result.protein}</p>
        <a class="js-result-name" href="${result.image}" target="_blank"><img class="card-image" src="${result.image}" alt="${result.title} image"></a>
        <!-- Trigger/Open The Modal -->
        <button id="js-view-recipe-btn" value="${result.id}">View Recipe</button>

        <!-- The Modal -->
        <div id="recipeModal" class="modal">

        <!-- Modal content -->
      <div class="modal-content">
          <span class="close">&times;</span>
          <h3 class="recipe-title">${result.title}</h3>
          <img class="card-image" src="${result.image}" alt="${result.title} image">
          <section role="region" class="recipe-details">
          </section>
        
       </div>

        </div>
        <form>
      <div>
        <input class="search-by-ingredient" type="search" id="${days[dayIndex]}-search" name="search-by-ingredient" placeholer="Search By Ingredient">
        <button class="search-by-ingredient-btn" value="${days[dayIndex]}">Search</button>
      </div>
        </form>
        <button class="js-remove-day">Remove Day</button>
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
      <a class="js-result-name" href="${result.image}" target="_blank"><img class="card-image" src="${result.image}" alt="${result.title}"></a>
      <button type="button" class="js-view-recipe">View Recipe</button>
        <input class="search-by-ingredient" type="search" id="${day}-search" name="search-by-ingredient" placeholer="Search By Ingredient">
        <button class="search-by-ingredient-btn" value="${day}">Search</button>
      <button class="js-remove-day">Remove Day</button>
`
}

function displayRecipesForWeek(data, recipeIndex) {
  const results = data.results.map((item, recipeIndex, index) => renderMenu(recipeIndex, item));
  $('.js-search-results').html(results);
  // Get the modal
var modal = document.getElementById('recipeModal');

// Get the button that opens the modal
var btn = document.getElementById("js-view-recipe-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
    let recipeId = 324694
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
    getRecipesForWeek(allergyList, dietFilter);
  });
}

function watchSearchByIngredientClick() {
  $('.js-output').on('click', '.search-by-ingredient-btn', function(event) {
  event.preventDefault();
  let dayCard = $(this).val();
  let ingredient = $(`#${dayCard}-search`).val();
  $(`.${dayCard}ingredient-query`).text(`Result for ${ingredient}`)
  dietFilter = 'vegetarian'//filterTarget.val();
  allergyList = ['dairy']
  getRecipeForDay(allergyList, dietFilter, dayCard, ingredient);
  console.log(`${dayCard} ${ingredient} option pressed`)
  })
}





function handleMenuGenerator() {
  watchBeginClick();
  watchDietSubmit();
  watchDietSelection();
  watchMenuSubmit();
  watchSearchByIngredientClick();
}

$(handleMenuGenerator)




