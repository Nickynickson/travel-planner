document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-itinerary');
    const addExpenseButton = document.getElementById('add-expense');

    searchButton.addEventListener('click', loadDestinations);
    clearButton.addEventListener('click', clearItinerary);
    addExpenseButton.addEventListener('click', addExpense);
});

async function getAccommodations(destination) {
    const { lat: latitude, lng: longitude } = await getCoordinates(destination);
    const arrivalDate = '2025-04-05'; // Placeholder arrival date  
    const departureDate = '2025-04-12'; // Placeholder departure date
    const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotelsByCoordinates?latitude=${latitude}&longitude=${longitude}&arrival_date=${arrivalDate}&departure_date=${departureDate}&adults=1&children_age=0%2C17&room_qty=1&units=metric&page_number=1&temperature_unit=c&languagecode=en-us&currency_code=EUR`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'd3724cb7bcmsh9479db99ce4a7d7p19fb4bjsnc8ac5efa823e',
            'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.accommodations; // Adjust according to actual API response structure
    } catch (error) {
        console.error(error);
    }
}

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
            displayAccommodationDetails(accommodation);
        });
    } else {
        suggestions.innerHTML = '<p>No accommodations found.</p>';
    }

    // Fetch and display weather information
    const weatherData = await getWeather(destinationInput);
    displayWeather(weatherData);
}

function displayWeather(weatherData) {
    const weatherSection = document.getElementById('weather');
    weatherSection.innerHTML = '';

    if (weatherData) {
        const weatherInfo = document.createElement('div');
        weatherInfo.innerHTML = `
            <h3>Weather in ${weatherData.location.name}</h3>
            <p><strong>Condition:</strong> ${weatherData.current.condition.text}</p>
            <img src="${weatherData.current.condition.icon}" alt="Weather Icon">
            <p><strong>Temperature:</strong> ${weatherData.current.temp_c}°C</p>
            <p><strong>Humidity:</strong> ${weatherData.current.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${weatherData.current.wind_kph} kph</p>
            <h4>Air Quality</h4>
            <p><strong>CO:</strong> ${weatherData.current.air_quality.co} µg/m³</p>
            <p><strong>NO2:</strong> ${weatherData.current.air_quality.no2} µg/m³</p>
            <p><strong>O3:</strong> ${weatherData.current.air_quality.o3} µg/m³</p>
            <p><strong>PM2.5:</strong> ${weatherData.current.air_quality.pm2_5} µg/m³</p>
            <p><strong>PM10:</strong> ${weatherData.current.air_quality.pm10} µg/m³</p>
            <p><strong>SO2:</strong> ${weatherData.current.air_quality.so2} µg/m³</p>
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
    geocoder.geocode({ 'address': destination, 'api':API_KEYS.googleMaps }, (results, status) => {
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

// Accommodation details display function
function displayAccommodationDetails(accommodation) {
    const suggestions = document.getElementById('destination-suggestions');
    
    // Create a div for the accommodation card
    const card = document.createElement('div');
    card.classList.add('accommodation-card');

    // Create the card content
    card.innerHTML = `
        <img src="${accommodation.main_photo_url || ''}" alt="Accommodation Image" class="accommodation-image">
        <div class="accommodation-details">
            <h3>${accommodation.hotel_name || 'N/A'}</h3>
            <p><strong>Type:</strong> ${accommodation.accommodation_type || 'N/A'}</p>
            <p><strong>Location:</strong> ${accommodation.city || 'N/A'}</p>
            <p><strong>Price:</strong> £${accommodation.min_total_price || 'N/A'}</p>
            <p><strong>Check-in:</strong> ${accommodation.checkin.from || 'N/A'} - ${accommodation.checkin.until || 'N/A'}</p>
            <p><strong>Check-out:</strong> ${accommodation.checkout.from || 'N/A'} - ${accommodation.checkout.until || 'N/A'}</p>
            <button onclick="addToItinerary(accommodation)">Add to Itinerary</button>
        </div>
    `;

    // Append the card to the suggestions section
    suggestions.appendChild(card);
}