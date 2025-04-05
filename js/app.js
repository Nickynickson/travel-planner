document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-itinerary');
    const addExpenseButton = document.getElementById('add-expense');

    searchButton.addEventListener('click', loadDestinations);
    clearButton.addEventListener('click', clearItinerary);
    addExpenseButton.addEventListener('click', addExpense);
});

async function loadDestinations() {
    const destinationInput = document.getElementById('destination-input').value;
    const suggestions = document.getElementById('destination-suggestions');
    const weatherSection = document.getElementById('weather');

    // Clear previous suggestions and weather
    suggestions.innerHTML = '';
    weatherSection.innerHTML = '';

    // Fetch accommodation suggestions
    const accommodations = await getAccommodations(destinationInput);
    if (accommodations && accommodations.length) {
        accommodations.forEach(accommodation => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = accommodation.name;
            suggestionItem.addEventListener('click', () => addToItinerary(accommodation));
            suggestions.appendChild(suggestionItem);
        });
    } else {
        suggestions.innerHTML = '<p>No accommodations found.</p>';
    }

    // Fetch and display weather information
    const weatherData = await getWeather(destinationInput);
    displayWeather(weatherData);
}

function addToItinerary(destination) {
    const itineraryList = document.getElementById('itinerary-list');
    const listItem = document.createElement('li');
    listItem.textContent = destination.name;
    itineraryList.appendChild(listItem);

    // Save to local storage
    saveToLocalStorage(destination);
    initMap(destination.name); // Initialize map for the selected destination
}

function saveToLocalStorage(destination) {
    let itineraries = JSON.parse(localStorage.getItem('itineraries')) || [];
    itineraries.push(destination);
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
}

function displayWeather(weatherData) {
    const weatherSection = document.getElementById('weather');
    weatherSection.innerHTML = '';

    if (weatherData && weatherData.weather) {
        const weatherInfo = document.createElement('div');
        weatherInfo.innerHTML = `
            <h3>Weather in ${weatherData.name}</h3>
            <p>${weatherData.weather[0].description}</p>
            <p>Temperature: ${(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
        `;
        weatherSection.appendChild(weatherInfo);
    } else {
        weatherSection.innerHTML = '<p>No weather data available.</p>';
    }
}

function clearItinerary() {
    const itineraryList = document.getElementById('itinerary-list');
    itineraryList.innerHTML = '';
    localStorage.removeItem('itineraries'); // Clear local storage
}

function addExpense() {
    const expenseInput = document.getElementById('expense-input');
    const totalExpensesDisplay = document.getElementById('total-expenses');
    let totalExpenses = parseFloat(totalExpensesDisplay.textContent) || 0;

    const expense = parseFloat(expenseInput.value);
    if (!isNaN(expense)) {
        totalExpenses += expense;
        totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
        expenseInput.value = ''; // Clear input
    }
}

function initMap(destination) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 }, // Default center
        zoom: 8
    });

    // Geocode the destination
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': destination }, (results, status) => {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                position: results[0].geometry.location,
                map: map
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
