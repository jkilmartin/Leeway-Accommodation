let screenLinks = $('.screen-link'),
    screens = $('.screen'),
    placeItemsEl = $(".accomodationBasedOnInput"),
    categoryListEl = $(".category-list")

let avPeopleDropdown = $('#avPeopleDropdown'),
    avLink = $('.advanced-search'),
    advancedSearchBox = $('.advancedSearchBox'),
    avNightsDropdown = $('#avNightDropdown'),
    avSubmitBtn = $('#avSubmitBtn')

let placeData,
    categoryData,
    peopleData,
    screenId

function init() {
    

    $.getJSON('json/places.json', function(places) { 
        placeData = places;
        displayPlaces(placeData.places);
    });

    $.getJSON('json/categories.json', function(categories) {
        categoryData = categories;
        displayCategories(categoryData.categories);
    });

    $.getJSON('json/people.json', function(people) {
        peopleData = people;
        displayPeople(peopleData.people);
    });

    screenLinks.on('click', changeScreen);
    if(localStorage.getItem('currentScreen')) {
        screenId = localStorage.getItem('currentScreen');
        let screenLink = $('*[data-screen="' + screenId + '"]');
        screenLink.click();
    }

    avLink.on('click', function() {
        advancedSearchBox.toggle();
    })
    avSubmitBtn.on('click', doAdvancedSearch);
}

// Advanced Search
function filterByPeople(places, peopleSelected) {
    return places.filter(function (places) {
        return places.minimumPeople <= peopleSelected && places.maximumPeople >= peopleSelected;
    });
}

function filterByNights(places, nightsSelected) {
    return places.filter(function (places) {
        return places.minimumNights <= nightsSelected && places.maximumNights >= nightsSelected;
    });
}

function doAdvancedSearch() {
    let peopleSelected = avPeopleDropdown.val();
    let nightsSelected = avNightsDropdown.val();
    let filteredPlaces = filterByPeople(placeData.places, peopleSelected);
    filteredPlaces = filterByNights(filteredPlaces, nightsSelected);
    displayPlaces(filteredPlaces); 
}

// Display Category Items
function getCategoryItemHTML(categories) {
    return `<li data-id="${categories.id}" class="category-item">
                ${categories.title}
            </li>`;
}

function displayCategories(categories){
    // display category list items
        let htmlString = '';
        $.each(categories, function(i, categories) {
            htmlString = htmlString + getCategoryItemHTML(categories);
        });
    
        categoryListEl.html(htmlString);

    // display category dropdown items
    htmlString = '<option value="" disabled selected>How Many People?</option>';
    $.each(categories, function(i, categories) {
        htmlString = htmlString + `<option value="${categories.id}">${categories.title}</option>`;
    });

    avNightsDropdown.html(htmlString);
}

// Display People Data in AV
function displayPeople(people){
    let htmlString = '<option value="" disabled selected>How Many People?</option>';
    $.each(people, function(i, people) {
        htmlString = htmlString + `<option value="${people.id}">${people.title}</option>`;
    });

    avPeopleDropdown.html(htmlString);
}

// Display Accommodation Data On Screen
function displayPlaces(places) {
    let htmlString = '';
    $.each(places, function(i, places) {
        htmlString = htmlString + getPlaceItemHTML(places);  
    });
    // this embeds the getTreatItemHTML function to html
    placeItemsEl.html(htmlString);

    accommodationInfo();
    
}

function getPlaceItemHTML(places) {
    return `<div data-id="${places.id}" class="${places.imgDetail} place-items ${places.modaalClass}">
                <img data-id="${places.id}" src="${places.imgSrc}">
                <h2>${places.name}</h2>
                <p>${places.information}</p>
            </div>`;
}

// Function to change the screen from home accommodation to the about us page
function changeScreen(){
    if(!screenId) {
        screenId = $(this).data('screen');
    }
    screenLinks.removeClass('active');
    $(this).addClass('active');
    // let screenId = $(this).data('screen');

    screens.removeClass('active');
    $('#' + screenId).addClass('active');

    localStorage.setItem('currentScreen', screenId);
    screenId = null;
}

function accommodationInfo() {
    $('.modaal0').modaal({
        content_source: '.modaal0Info'
    });

    $('.modaal1').modaal({
        content_source: '.modaal1Info'
    });

    $('.modaal2').modaal({
        content_source: '.modaal2Info'
    });

    $('.modaal3').modaal({
        content_source: '.modaal3Info'
    });
}

// init function to run the code
init();