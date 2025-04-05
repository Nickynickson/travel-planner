const API_KEYS = {
    opencage: '67ceddd1b1d641e2875b4343ba2900bb',
    googleMaps: 'AIzaSyCbJAkrRdj0JNs165T6dF_-QQuQ6KxIRGg',
    weather: '488b35dde47f4b61b98212410250504',
    booking: 'd3724cb7bcmsh9479db99ce4a7d7p19fb4bjsnc8ac5efa823e',  // Placeholder
    tripAdvisor: 'd3724cb7bcmsh9479db99ce4a7d7p19fb4bjsnc8ac5efa823e'  // Placeholder
};


// Function to fetch data from APIs
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to initialize Google Maps
function initMap(location) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': location }, (results, status) => {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            const marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
}


// Fetch weather data for a specific location
async function getWeather(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEYS.weather}&q=${location}&aqi=yes`
    //const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEYS.weather}`;
    const response = await fetchData(url);
    console.log(response);
}

const getCoordinates = async (city) => {
    /*const geocoder = new google.maps.Geocoder();
   
    try {
      const [results, status] = await geocoder.geocode({ address: city });
      if (status === 'OK' && results.length > 0) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        return {latitude, longitude};
      } else {
        console.error('Geocoding failed:', status);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    } */
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${API_KEYS.opencage}`;

    const response = await fetchData(url);
    return response.results[0].geometry
};
// Fetch accommodation data from Booking.com API (placeholder)

async function getAccommodations(location) {

    const {lat:latitude,lng:longitude} = await getCoordinates(location);
    //console.log(coordinates); // Log the coordinates to the console

    //const bookingUrl = `https://api.booking.com/v1/hotels?location=${location}&apikey=${API_KEYS.booking}`;
    //return await fetchData(bookingUrl);
    //const latitude = 19.24232736426361;
    //const longitude = 72.85841985686734; // Placeholder coordinates for Mumbai, India
    const arrivalDate = '2025-04-05'; // Placeholder arrival date  
    const departureDate = '2025-04-12'; // Placeholder departure date
    const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotelsByCoordinates?latitude=${latitude}&longitude=${longitude}&arrival_date=${arrivalDate}&departure_date=${departureDate}&adults=1&children_age=0%2C17&room_qty=1&units=metric&page_number=1&temperature_unit=c&languagecode=en-us&currency_code=EUR&location=US`;
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
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
}

//https://booking-com.p.rapidapi.com/v1/metadata/exchange-rates?locale=en-gb&currency=AED
// https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=304554
//

// Fetch activity data from TripAdvisor API (placeholder)
async function getActivities(location) {
    const tripAdvisorUrl = `https://api.tripadvisor.com/v2/activities?location=${location}&apikey=${API_KEYS.tripAdvisor}`;
    return await fetchData(tripAdvisorUrl);
}