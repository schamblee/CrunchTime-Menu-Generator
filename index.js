let dietFilter = ''
let currentView = ''

/*$(document).ready(function() {
  let $window = $(window);
  function checkWidth() {
    var windowsize = $window.width();
      if (windowsize > 700) {
       currentView ='basicWeek'
       } else {
       currentView ='basicDay'
      }
  }
  checkWidth();
  $(window).resize(checkWidth)
    $('#calendar').fullCalendar('next');
    $('#calendar').fullCalendar({
      defaultView: 'basicWeek',
      firstDay: 1,
      height: 400,
      events: [
        {
        title  : 'event',
        start  : '2018-02-17',
        end  : '2018-02-17',
        imageurl:'https://www.caitofoods.com/hs-fs/hubfs/OSD_Theme/veggies.png?t=1518201131871&width=326&name=veggies.png'
        }
      ]
  });
  });*/

function getDataFromApi() { 
  $.ajax({
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=false&excludeIngredients=coconut%2C+mango&fillIngredients=false&includeIngredients=onions%2C+lettuce%2C+tomato&instructionsRequired=false&intolerances=peanut%2C+shellfish&limitLicense=false&maxCalories=500&maxCarbs=100&maxFat=100&maxProtein=100&minCalories=150&minCarbs=5&minFat=5&minProtein=5&number=7&offset=7&ranking=1&type=main+course',
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


function renderMenu(result) {
  let calories = `${result.calories}`
  let protein = `${result.protein}`
  return `
  <div class="col-4"> 
    <div class="recipe-card">
      <div class="recipe-title">
        <span class = "day-title">Monday</span>
        <h3 class="recipe-title">${result.title}</h3>
        <p>Calories: ${calories}</p>
        <p>Protein: ${protein}</p>
      </div>
      <a class="js-result-name" href="${result.image}" target="_blank"><img class="card-image" src="${result.image}" alt="${result.title}"></a>
      <button class="next-option">Next Option</button>
    </div>
  </div>`;
}

function displayRecipeData(data) {
  const results = data.results.map((item, index) => renderMenu(item));
  $('.js-search-results').html(results);
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
    getDataFromApi(query, dietFilter, displayRecipeData);
  });
}

function handleMenuGenerator() {
  watchBeginClick();
  watchDietSubmit();
  watchDietSelection();
  watchMenuSubmit();
}

$(handleMenuGenerator)




