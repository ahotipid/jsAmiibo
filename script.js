const app = {};

//request data of amiibo from character and type
app.amiibo = (character, type) => {
  //create object to contain parameter
  const dataQuery = {};
  if (type !== undefined) {
    dataQuery.type = type;
  }
  if (character !== undefined) {
    dataQuery.character = character;
  }
  const amiiboSearch = $.ajax({
    url: 'https://proxy.hackeryou.com',
    method: 'GET',
    dataType: 'json',
    data: {
      reqUrl: `https://www.amiiboapi.com/api/amiibo`,
      params: dataQuery
    }
  });
  return amiiboSearch;
}

//fuction to search for data of input amiibo and append to main
app.doSearch = (character, type) => {
  const amiiboData = app.amiibo(character, type)
  amiiboData.done((res) => {
    const searchResult = res.amiibo; //array of result(s)
    app.appendResultToHtml(searchResult);
  }).fail(() =>{
    //alert when no match result or error with modal box
    const $modal = $('#modalForError');
    //no result so empty main
    app.$main.empty();
    $modal.addClass('activate');
    //user click on x to exit
    $('span').on('click', ()=>{
      $modal.removeClass('activate');
    });
  });
}

//select main section in html
app.$main = $('main');

//function to append image and information into html for each result
app.appendResultToHtml = (arrayOfAmiibo) => {
  //empty main html first
  app.$main.empty();
  //append result to html for each entry
  arrayOfAmiibo.forEach((eachAmiibo) => {
    //get img url
    const imageUrl = eachAmiibo.image;
    //get amiibo name
    const amiiboName = eachAmiibo.name;
    //get amiibo series
    const amiiboSeries = eachAmiibo.amiiboSeries;
    //get game series
    const amiiboGameSeries = eachAmiibo.gameSeries;
    //get release date that store in an object an convert to an array
    const amiiboRelease = Object.entries(eachAmiibo.release);
    //filter the country with date that is null then turn each array in filterd array into string to get [country : date]
    const countryAndDate = amiiboRelease.filter( (country) => {
      if (country[1] !== null) {
        return true;
      }
    }).map((country) => {
      return country.join(' : ');
    });

    // turn array of [country : date] to string with line break
    const stringOfCountryAndDate = countryAndDate.join('</br>');

    //append datas in flip card 
    app.$main.append(`
      <div class="flipcard">
        <div class="flipcardAction">
          <div class="imageCardFront">
            <img class="amiiboImage"src="${imageUrl}" alt="${amiiboName}">
              <h3>${amiiboName}</h3>
          </div>
          <div class="imageCardBack">
              <p>Series :</br>${amiiboSeries}</p>
              <p>Game Series :</br>${amiiboGameSeries}</p>
              <p>Release</br><span>${stringOfCountryAndDate}</span></p>
          </div>
        </div>
      </div>
    `);
  });
}

app.init = () => {
  //grab input from form when submit, search for amiibo datas, and append to html
  const $form = $('form')
  $form.on('submit',(e)=>{
    e.preventDefault();
    //declare variables for inputs
    let inputCharacter = $('input[type=text]').val();
    const inputType = $('option:selected').val();
    //alert when user doesnt give character input and search
    if (inputCharacter.length === 0) {
      //alert modal when no character input by adding class activate
      const $modal = $('#modalForCharacter');
      $modal.addClass('activate');
      //user click on x to exit
      $('span').on('click', ()=>{
        $modal.removeClass('activate');
      });
      //set input character to undefined so it searches by type only
      inputCharacter = undefined;
      app.doSearch(inputCharacter,inputType);
    } else{
      //search 
      app.doSearch(inputCharacter,inputType);
    }
  }); 
}

//document ready
$(() => {
  app.init();
});