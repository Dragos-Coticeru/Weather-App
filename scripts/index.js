// Register a listener for the DOMContentLoaded event. This is triggered when the HTML is loaded and the DOM is constructed.

// We are doing this because the script is loaded in the head of the document, so the DOM is not yet constructed when the script is executed.

/*import 'node_modules/pexels';
const client = createClient('b6DGED1xQZUuuGRyDgHTyQXIuYo0Uk8qLDl74eLWzRYzNF4Yn0PsSH4F');
*/

document.addEventListener("DOMContentLoaded", (_event) => {
    alert("After DOM has loaded");
    // todo: Add code here that updates the HTML, registers event listeners, calls HTTP endpoints, etc.
});

const autocomplete_suggestions = 5;
const weatherDisplay = document.createElement('div'); 
const weatherInfo = document.createElement('div');
weatherInfo.classList.add('weather-info');
let today = [];
let day = [];
let month = [];
let year = [];
let formattedDate = [];
today = new Date();
day[0] = today.getDate();
month[0] = today.getMonth() + 1;
year[0] = today.getFullYear();
formattedDate[0] = `${year[0]}-${month[0] < 10 ? '0' + month[0] : month[0]}-${day[0] < 10 ? '0' + day[0] : day[0]}`;
console.log(formattedDate[0]);
let i;
for(i = 1; i < 5;i ++) {
    aux_date = new Date(today);
    aux_date.setDate(today.getDate() + i);
    day[i] = aux_date.getDate();
    month[i] = aux_date.getMonth() + 1;
    year[i] = aux_date.getFullYear();
    formattedDate[i] = `${year[i]}-${month[i] < 10 ? '0' + month[i] : month[i]}-${day[i] < 10 ? '0' + day[i] : day[i]}`;
    console.log(formattedDate[i]);
}


document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const root = document.getElementById('root');

    cityInput.addEventListener('input', function () {
        const inputValue = cityInput.value.trim();

        if (inputValue.length >= 3) {
            fetchCities(inputValue);
        } else {          
            clearCityList();
        }
    });

    function clearCityList() {
        const existingCityList = root.querySelector('ul');
        if (existingCityList) {
            existingCityList.remove();
        }
    }

    function fetchCities(query) {
        const apiKey = '95384ce79a694b4ab7fc8b0e7d3d56f9';
        fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&format=json&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            displayCities(result);
        })
        .catch(error => console.log('error', error));
        
    }
    
    function getCityImage(cityInput) {
        const pexels_api_key = "b6DGED1xQZUuuGRyDgHTyQXIuYo0Uk8qLDl74eLWzRYzNF4Yn0PsSH4F";
    
        const searchUrl = `https://api.pexels.com/v1/search?query=${cityInput}&per_page=1`;
    
        fetch(searchUrl, {
            headers: {
                Authorization: pexels_api_key,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            const imageUrl = data.photos[0].src.original;
            display_city_image(imageUrl);
        })
        .catch((error) => {
            console.error("Error fetching image:", error);
        });
    }

    const favoritesList = []; 

    const favoritesListContainer = document.getElementById('favoritesContainer');
    favoritesListContainer.classList.add('favorites-container');

    function addToFavorites(city) {
        if (!favoritesList.includes(city)) {
            favoritesList.push(city);
            displayFavorites(city);
        }
    }

    function displayFavorites() {
        const favoritesContainer = document.getElementById('favoritesContainer');
        favoritesContainer.classList.add("favorites-list");
        let favoritesListElement = favoritesContainer.querySelector('ul');
        if (!favoritesListElement) {
            favoritesListElement = document.createElement('ul');
            favoritesContainer.appendChild(favoritesListElement);
        }
        favoritesList.forEach((city) => {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            favoritesListElement.appendChild(listItem);
            listItem.addEventListener('click', function () {
                fetchWeather(city);
            });
        });
    }

    function display_city_image(imageUrl) {
        
        // Set the body background to the image
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
    
        // Clear the card container and append the image to it
        const cardContainer = document.getElementById('card');
        while (cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.firstChild);
        }
        cardContainer.appendChild(cityImage);
        cardContainer.classList.add('card');
    }



    function displayCities(predictions) {
        console.log(predictions.results[0].city);
        clearCityList();

        const predictionList = document.createElement('ul');
        predictionList.classList.add('city-list');
        for (let i = 0; i < autocomplete_suggestions && i < predictions.results.length; i++) {
            if(!predictions.results[i].city) {
                continue;
            }
            const listItem = document.createElement('li');
            const cityName = predictions.results[i].city;
            listItem.textContent = cityName;
            
            listItem.addEventListener('click', () => {
                cityInput.value = cityName;
                clearCityList();
            });
    
            predictionList.appendChild(listItem);
        }
        const inputRect = cityInput.getBoundingClientRect();
        predictionList.style.position = 'absolute';
        predictionList.style.top = `${inputRect.bottom}px`;
        predictionList.style.left = `${inputRect.left}px`;
        root.appendChild(predictionList);
    }

    searchButton.addEventListener('click', function () {
        const selectedCity = cityInput.value.trim();

        if (selectedCity.length > 0) {
            fetchWeather(selectedCity);
        }
    });

    function fetchWeather(city) {
        const weatherApiKey = '9f73deb810c94e57976145448243005';
        const weatherApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=5&aqi=no&alerts=no`;

        fetch(weatherApiUrl)
            .then(response => response.json())
            .then(result => {
            console.log(result);
            displayWeather(result);
            getCityImage(city);
        })
        .catch(error => console.log('error', error));
        
    }
    /*
        function displayWeather(weatherData) {

            for(i = 0; i < 5; i ++) {
                console.log(weatherData.forecast.forecastday[i].day.condition.text);
            }
        }
    */

    function clearWeatherDisplay() {
        const existingWeatherDisplay = root.querySelector('#weatherDisplay');
        if (existingWeatherDisplay) {
            existingWeatherDisplay.remove();
        }
    }

    function displayWeather(weatherData) {
        clearWeatherDisplay();

        const weatherInfo = document.createElement('div');
        weatherInfo.classList.add('weather-info');

        for (let i = 0; i < 5; i++) {
            const weatherCondition = document.createElement('div');
            weatherCondition.classList.add('weather-condition'); 
            weatherCondition.textContent = `${formattedDate[i]}:\n${weatherData.forecast.forecastday[i].day.condition.text}`;
            weatherInfo.appendChild(weatherCondition);
        }
        weatherDisplay.appendChild(weatherInfo);
        root.appendChild(weatherDisplay);
    }

    const spinner = document.getElementById("spinner");

    const heartButton = document.getElementById("heartButton");


    heartButton.addEventListener('click', function () {
        const selectedCity = cityInput.value.trim();

        if (selectedCity.length > 0) {
            addToFavorites(selectedCity);
        }
    });
})


