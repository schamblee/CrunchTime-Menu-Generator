
//-----------Global Variables------------------//
//Manipulated by functions throughout app to provide desired content

let allergies = [];
let dietFilter = '';
//Set by the user to indicate their diet and allergy information

let dayIndex = -1;
let printDayIndex = -1
//Keep track of what day of the week should be rendered in the days array in the renderMenu() and watchRefreshMenuClick() functions
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
let printDays = [];
let offset = Math.floor(Math.random() * 500);
//Determine which recipes are diplayed by the result index of the first recipe. Initial offset is random.


//-----------API Data-------------------------//

function setHeader(xhr) {
//Set headers with API key
        xhr.setRequestHeader('X-Mashape-Key', 'DwXMjCgQGQmshC8MyFU6bVgOQS1Lp1tlRvZjsn3JvI9Q2hZZBC');
      }

function getRecipesForWeek() { 
//Get general recipe data for week's menu
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?diet=${dietFilter}&addRecipeInformation=false&number=7&offset=${offset}&instructionsRequired=true&intolerances=${allergies}&limitLicense=false&maxCalories=600&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipesForWeek(result) },
      error: function() { alert('Sorry, there was an error. Please try again.') },
      beforeSend: setHeader
      });
  };


function getRecipeForDay(day, query) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?query=${query}&diet=${dietFilter}&addRecipeInformation=false&number=1&offset=${offset}&instructionsRequired=true&intolerances=${allergies}&limitLicense=false&maxCalories=600&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipeForDay(result, day) },
      error: function() { renderNoResultsCard(day) },
      beforeSend: setHeader
      });
  };


function getRecipeInfo(id, day) { 
//Get instructions, ingredient and source info for specific recipes found by previous searches
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/information`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { renderRecipeInfo(result) },
      error: function() { alert('Sorry, there was an error. Please try again.') },
      beforeSend: setHeader
      });
}

function getRecipeInfoForWeek(ids) {
  https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk
    $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=${ids}`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { handlePrintSheetSuccess(result) },
      error: function() { handlePrintSheetError() },
      beforeSend: setHeader
      });
}

function handlePrintSheetSuccess(result) {
  displayPrintSheet(result); 
  $('.js-print-menu').text('Print Menu').removeAttr('disabled')
}

function handlePrintSheetError() {
  clickCount --
  alert('Sorry, there was an error. Please try again.')
  $('.js-print-menu').text('Pepare Printable Menu').removeAttr('disabled')
}

//---------Menu Cards----------------------------//


function displayRecipesForWeek(data) {
//render menu
  const results = data.results.map((item, index) => renderMenu(offset, item));
  $('.js-search-results').html(results);
}

function renderMenu(offset, result) {
//Day card for each day of the week. Days are stored as data within elements.
  dayIndex++
  let html = `
  <div class="col-4"> 
    <span class="day-title">${days[dayIndex]}</span>
    <div id="${days[dayIndex]}Card" class="recipe-card">
      <h3 id="recipe-title" class="recipe-title">${result.title}</h3>
      <button id="js-view-recipe-btn-${days[dayIndex]}" class="js-view-recipe-btn controls-button" data-recipe-id="${result.id}" data-day="${days[dayIndex]}">
          <img id="card-image" class="card-image" src="${result.image}" alt="${result.title} image">
        <br><div class="view-recipe-div">View Recipe</div>
      </button>
    </div>
    <form class="ingredient-form">
      <input id="search-by-ingredient${days[dayIndex]}" class="search-by-ingredient" type="search" name="search-by-ingredient" placeholer="Search By Ingredient">
      <button title="Search For Recipes By Ingredient" class="search-by-ingredient-btn controls-button" data-day="${days[dayIndex]}">Search</button>
    </form>
    <div class="recipe-controls">
      <button title="View Previous Recipe Option" class="js-previous-result-btn controls-button previous" data-day="${days[dayIndex]}" aria-live="assertive">
      <i class="fas fa-chevron-circle-left"></i></button>
      <button title="Remove Recipe For ${days[dayIndex]}" class="js-remove-day controls-button remove" data-day="${days[dayIndex]}">
      <i class="far fa-times-circle"></i></button>
      <button title="View Next Recipe Option" class="js-next-result-btn controls-button next" data-day="${days[dayIndex]}">
      <i class="fas fa-chevron-circle-right"></i></button>
    </div>
    <!-- The Modal -->
    <section role="region" id="recipeModal${days[dayIndex]}" class="modal" aria-live="assertive" hidden>
    <!-- Modal content -->
      <div class="modal-content">  
      </div>
    </section>
  </div>

  `
  return html
  
}

function displayRecipeForDay(data, day) {
//Render new day card when user clicks next, previous or search
  let dayCard = `${day}`
  if (data.results.length > 0) {
    const results = data.results.map((item, day, index) => renderDayCard(item, dayCard));
    $(`#${day}Card`).html(results);
  } else {
    renderNoResultsCard(dayCard);
  }
}

function renderDayCard(result, day) {  
//Replace card image and recipe title for day with new results
  let html = `
      <h3 class="recipe-title">${result.title}</h3>
      <button id="js-view-recipe-btn-${day}" class="js-view-recipe-btn controls-button" data-recipe-id="${result.id}" data-day="${day}">
        <img id="card-image${day}" class="card-image" src="${result.image}" alt="${result.title}">
        <div class="view-recipe-div">View Recipe</div>
      </button>`
 offset += 7 //increase the offset to provide variety in results
 return html
}

function renderNotCooking(day) {  
//If the user removes a day, display this HTML:
  const notCookingImgArray = ['https://www.displayfakefoods.com/store/pc/catalog/2189-lg.jpg', 'https://www.tupperware4sale.com/wp-content/uploads/2016/11/food-storage.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tom%27s_Restaurant%2C_NYC.jpg/220px-Tom%27s_Restaurant%2C_NYC.jpg','https://i.warosu.org/data/ck/img/0090/05/1496450672947.png'];
  let notCookingImg = notCookingImgArray[Math.floor(Math.random()*notCookingImgArray.length)] //For fun, get a random "Not Cooking" image
  return `<h3 id="recipe-title${day}" class="recipe-title">Not Cooking</h3>
    <img id="card-image${day}" class="card-image" src="${notCookingImg}" alt="Not cooking image">
    <div class="view-recipe-div">View Recipe</div>`
}

function renderNoResultsCard(day) {  
//If there are no search results or there is an error, display this HTML:
  let html = `
        <h3 id="recipe-title${day}" class="recipe-title">No Results Available</h3>
      <img id="card-image${day}" class="card-image" src="https://d30y9cdsu7xlg0.cloudfront.net/png/98632-200.png" alt="No Results image">
  `
  $(`#${day}Card`).html(html)
}

//---------Modal Content-------------------------//

function renderRecipeInfo(result) {
//Render source, ingredients list and instructions to modal content
  $('.modal-content').html(renderModalContent(result));
  appendIngredients(result);
  appendSourceName(result);
  appendInstructions(result);
}

function formatMeasurements (amount, unit) {
//Measurement amount data is retieved as a decimal which must be manipulated 
//to look like either a fraction of rounded decimal, depending on the unit
  if (amount % 1 === 0) {
  //if the amount is a whole number, return the amount normally
      return amount
  } else if (unit === "oz" || unit === "Ounces" || unit === "ounces" ) {
  //display ounces as decimals rounded to the nearest hundreth
    return Math.round(amount, 2)
  } else {
  //return other measurements (cups, pounds, teaspoons, etc.) as fractions
    let fraction = math.fraction(amount)
    //improper fractions are converted into mixed numbers
    let denominator = fraction.d
    let numerator = fraction.n
    let remainder = numerator % denominator // 2.25  => 9/4   
    let wholeNumber = parseInt(numerator/denominator) // => 2
    if (wholeNumber === 0) {
    //if there isn't a whole number, then just return the fraction
      return `${remainder}/${denominator} `
    } else {
    //otherwise, return the mixed number
      return `${wholeNumber} ${remainder}/${denominator} ` // => 2 1/4
    }
  }
}

function appendInstructions(result) {
  for (let x = 0; x < result.analyzedInstructions.length; x++) {
  //for each array of steps in the analyzed instruction array, render a list item for each step
    for (let y = 0; y < result.analyzedInstructions[x].steps.length; y++) {
      if ((result.analyzedInstructions[x].steps[y].step).length > 1) { 
      //Don't append steps that are just a number or character because I have my own ordered list
      $(`.recipe-instructions`).append(`<li>${result.analyzedInstructions[x].steps[y].step}</li>`)
      }
    }
  }
}

function appendIngredients(result) {
  for (let i = 0; i < result.extendedIngredients.length; i++) {
  //for each ingredient in array, render a list item with the amount, unit and the ingredient
    let amount = result.extendedIngredients[i].amount;
    let unit = result.extendedIngredients[i].unit;
    let ingredient = result.extendedIngredients[i].name;
    let formattedAmount = formatMeasurements(amount, unit)
    $(`.recipe-ingredients`).append(`<li>${formattedAmount} ${unit} - ${ingredient}</li>`);
  }
}

function appendSourceName(result) {
//credit the source of the recipe
  let sourceName = result.sourceName;
  if (sourceName == null) {
    sourceName = 'Visit Source'
  }
  $('.credit').append(`<a title="Go to Source" href="${result.sourceUrl}" target="_blank">Credit: ${sourceName}</a>`);
}

function renderModalContent(result) {
//Modal content HTML
  return `<span class="close">&times;</span>
    <h3 id="recipe-title">${result.title}</h3>
    <p>Ready in: ${result.readyInMinutes} minutes</p>
    <img id="card-image" class="modal-card-image" src="${result.image}" alt="${result.title} image">
    <div class="ingredient-container">
      <span class="modal-section-title">Ingredients:</span><br>
      <ul class="recipe-ingredients">
      </ul>
    </div>  
    <div class="instructions-container">
      <span class="modal-section-title">Directions:</span>
      <ol class="recipe-instructions">
      </ol>
    </div>
    <span class="credit"></span><br>
    <button class="close-modal-btn controls-button">Close</button>`  
}

//-----------Print Sheet---------------------------------//

function displayPrintSheet(data) {
  data.map((item, index) => renderPrintSheet(item));
}

function renderPrintSheet(result) {
  let recipePrintSheet = printSheetHTML(result);
  $('.print-sheet').append(recipePrintSheet);
  appendIngredients(result);
  appendSourceName(result);
  appendInstructions(result);
}

function printSheetHTML(result) {
  printDayIndex++
  day = printDays[printDayIndex]
  return `<section role="region" class="day-menu-print">
    <div class="day-title-div">
      <h2>${day}</h2>
      <h3 id="recipe-title">${result.title}</h3>
      <p>Ready in ${result.readyInMinutes} minutes</p>
    </div>
    <div class="recipe-div">
      <div class="ingredient-container">
      <span class="modal-section-title">Ingredients:</span><br>
        <ul class="recipe-ingredients">
        </ul>
    </div>  
    <div class="instructions-container">
      <span class="modal-section-title">Directions:</span>
        <ol class="recipe-instructions">
        </ol>
    </div> 
    <p class="sourceName">Source: ${result.sourceUrl}<p>
    </div>
  </section>`
}


//------------User Actions-------------------------//
//User clicks and submits trigger the following functions

function watchBeginClick() {
//Hide intro, display the select diet section
  $('.js-begin-btn').click(event => {
    event.preventDefault();
    $('.js-select-diet').prop('hidden', false);
    $('.js-intro').prop('hidden', true);
    });
}

function watchMenuSubmit() {
//Update global variables (diet and allergies) and get the recipes for the week
  $('.js-select-diet').submit(event => {
    event.preventDefault();
    $('.js-output').prop('hidden', false);
    $('.js-menu-controls').prop('hidden', false);
    $('.js-select-diet').prop('hidden', true);
    $('input:checkbox[name=intolerance]:checked').map(function() 
      {
        allergies.push($(this).val())
      });
    dietFilter = $('#diet-filter').val();
    getRecipesForWeek();
  });
}

function watchViewRecipeClick() {
//Open modal by clicking "View Recipe". Use the recipe id to get the info for modal content.
  $('.js-output').on('click', '.js-view-recipe-btn', function(event) {
    event.preventDefault();
    let day = $(this).data('day')
    $(`#recipeModal${day}`).prop('hidden', false);
    let recipeId = $(this).data('recipe-id');
    getRecipeInfo(recipeId, day);
    closeRecipeModal(day);
  });
}

function closeRecipeModal(day) {
//Close modal by clicking "X", the close button at the bottom, or clicking outside of the modal
  $('.js-output').on('click', '.close-modal-btn', function(event) {
    event.preventDefault();
    $(`#recipeModal${day}`).prop('hidden', true);
  });

  $('.js-output').on('click', '.close', function(event) {
    event.preventDefault();
    $(`#recipeModal${day}`).prop('hidden', true);
  });

  $(document).click(function(event) {
    if (!$(event.target).closest('.modal-content, .js-view-recipe-btn' ).length) {
      $("body").find(".modal").prop('hidden', true);
    }
  });
}

function watchSearchByIngredientClick() {
//Search for an ingredient to update the day card's recipe
  $('.js-output').on('click', '.search-by-ingredient-btn', function(event) {
  event.preventDefault();
  let day = $(this).data('day');
  let ingredient = $(`#search-by-ingredient${day}`).val();
  offset = Math.floor(Math.random() * 100) //Randomized result to provide variety
  getRecipeForDay(day, ingredient);
  })
}

function watchNextResultClick() {
//Get the next recipe. If user has a search term submitted, apply the ingredient in the search
  $('.js-output').on('click', '.js-next-result-btn', function(event) {
  event.preventDefault();
  let day = $(this).data('day');
  let ingredient = $(`#search-by-ingredient${day}`).val();
  getRecipeForDay(day, ingredient);
  })
}

function watchPreviousResultClick() {
//Click on previous button to see last result, or the result further back in recipe index
  $('.js-output').on('click', '.js-previous-result-btn', function(event) {
  event.preventDefault();
  let day = $(this).data('day');
  let ingredient = $(`#search-by-ingredient${day}`).val();
  offset -= 14; //Subtract 14 from the offset to provide variety in results
  getRecipeForDay(day, ingredient);
  })
}

function watchRemoveClick() {
//Display the "Not Cooking" card when remove button is clicked
  $('.js-output').on('click', '.js-remove-day', function(event) {
    event.preventDefault();
    let day = $(this).data('day');
    let ingredient = ''
    $(`#${day}Card`).html(renderNotCooking(day));
  })
}

function watchStartOverClick() {
//Reload the app to start over
  $('.js-menu-controls').on('click', '.js-start-over', function(event) {
    event.preventDefault();
    location.reload();
  })
}

function watchRefreshMenuClick() {
//reload the week with new recipes for each day
  $('.js-menu-controls').on('click', '.js-refresh-menu', function(event) {
    dayIndex = -1 //Start back at Monday
    offset = Math.floor(Math.random() * 500); //Get a random offset to provide variety
    getRecipesForWeek();
  })
}

let clickCount = 0 //Global variable to keep track of "Print" button clicks
function watchPrintClick() {
  $('.js-output').on('click', '.js-print-menu', function(event) {
    if (clickCount === 1) {
    //Either prepare print sheet or print the sheet depending on which click (0 or 1)
      clickCount -- //Reset clicks
      $('.js-print-menu').text("Prepare Printable Menu"); //Reset button text
      window.print(); //Print sheet
    } else {
      preparePrintSheet();
      $('.js-print-menu').text("Loading Recipes...").prop('disabled', 'true'); //disable print button until data loads
    }
  });
}

function preparePrintSheet() {
  $('.print-sheet').html(''); //Clear the print sheet so that only one week can be appended in a menu
  clickCount ++; //Count the click
  dayIndex = -1; //Reset the week days
  printDays = [];
  printDayIndex = -1; //Reset the print week days
  let recipeIds = []; 
  for (let i = 0; i < 7; i ++) {
  //create an array of the current recipe ID's
    if ($(`#js-view-recipe-btn-${days[i]}`).data('recipe-id')) {
      printDays.push(`${days[i]}`)
      recipeIds.push($(`#js-view-recipe-btn-${days[i]}`).data('recipe-id')) 
    }
  }
  getRecipeInfoForWeek(recipeIds); //Send the ID's and collect data from bulk info API
}

function handleMenuGenerator() { 
//Call each action's function
  watchBeginClick();
  watchMenuSubmit();
  watchViewRecipeClick()
  watchSearchByIngredientClick();
  watchNextResultClick();
  watchPreviousResultClick();
  watchRemoveClick();
  watchRefreshMenuClick();
  watchStartOverClick();
  watchPrintClick();
}

$(handleMenuGenerator)