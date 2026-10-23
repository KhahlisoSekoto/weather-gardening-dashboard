import { getRecommendedVegetables, getPlantSpecificProtection } from './gardenLogic.js';
const gardenSearchInput = document.getElementById('garden-search-input'); 
const cropsList = document.getElementById('crop-recommendation');
// ==========================================
// 🚀 WEATHER DASHBOARD ENGINE
// ==========================================

// Global Configurations
const API_KEY = 'X5NQVHQMD6JGYS37HFTL3RNMD'; 
let currentWeatherData = null;
let isCelsius = true;
let activeRecommendedCrops = [];

// DOM Element Registry
const weatherForm = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const loadingIndicator = document.getElementById('loading');
const weatherDisplayCard = document.getElementById('weather-display');
const unitToggleBtn = document.getElementById('unit-toggle');
const unitLabel = document.getElementById('unit-label');

/**
 * Requirement 1: Asynchronous Data Ingestion Pipeline
 */
async function fetchRawWeatherData(location) {
    // Official documentation base route
    const baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    const cleanLocation = encodeURIComponent(location);
    const endpoint = baseUrl + cleanLocation + "?key=" + API_KEY;
    
    // Establishing direct cors handshake configuration
    const response = await fetch(endpoint, { mode: 'cors' });
    
    if (!response.ok) {
        throw new Error("Location not found or API failure.");
    }
    
    return await response.json();
}

/**
 * Requirement 2: Data Sanitization Layer
 */
function sanitizeWeatherData(rawJsonData) {
    const current = rawJsonData.currentConditions;
    return {
        resolvedAddress: rawJsonData.resolvedAddress,
        latitude: rawJsonData.latitude,
        conditions: current.conditions,
        icon: current.icon,
        humidity: current.humidity,
        tempF: current.temp,
        feelsLikeF: current.feelslike,
        tempC: Math.round(((current.temp - 32) * 5) / 9 * 10) / 10,
        feelsLikeC: Math.round(((current.feelslike - 32) * 5) / 9 * 10) / 10,
        windSpeedMph: current.windspeed,
        windSpeedKmh: Math.round((current.windspeed * 1.60934) * 10) / 10
    };
}

/**
 * Requirement 3: DOM Rendering & Metric Engine
 */
function renderWeatherToDOM() {
    if (!currentWeatherData) return;
    const data = currentWeatherData;
    
    // Reveal the weather display card instantly when data is rendered!
    if (weatherDisplayCard) weatherDisplayCard.classList.remove('hidden');
    // Reveal the unit toggle controls along with the weather data
    const toggleContainer = document.querySelector('.toggle-container');
    if (toggleContainer) toggleContainer.classList.remove('hidden');
    
    document.getElementById('display-location').textContent = data.resolvedAddress;
    document.getElementById('display-condition').textContent = data.conditions;
    document.getElementById('display-humidity').textContent = `${data.humidity}%`;
    
    if (isCelsius) {
        document.getElementById('display-temp').textContent = `${data.tempC}°C`;
        document.getElementById('display-feels').textContent = `${data.feelsLikeC}°C`;
        document.getElementById('display-wind').textContent = `${data.windSpeedKmh} km/h`;
        unitLabel.textContent = "Displaying: °C";
        unitToggleBtn.textContent = "Switch to °F";
    } else {
        document.getElementById('display-temp').textContent = `${data.tempF}°F`;
        document.getElementById('display-feels').textContent = `${data.feelsLikeF}°F`;
        document.getElementById('display-wind').textContent = `${data.windSpeedMph} mph`;
        unitLabel.textContent = "Displaying: °F";
        unitToggleBtn.textContent = "Switch to °C";
    }

    applyWeatherTheme(data.icon);
    renderGardenFeatures(data);
}

/**
 * Requirement 4: Environmental UI Styling Dynamic Modifier
 */
function applyWeatherTheme(iconCode) {
    const icon = iconCode.toLowerCase();
    if (icon.includes('rain') || icon.includes('snow') || icon.includes('sleet')) {
        document.body.className = 'theme-cold';
    } else if (icon.includes('clear') || icon.includes('sunny')) {
        document.body.className = 'theme-warm';
    } else {
        document.body.className = 'theme-default';
    }
}



/**
 * Runtime Form Controller Configuration
 */
weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const targetLocation = locationInput.value.trim();
    if (!targetLocation) return;

    loadingIndicator.classList.remove('hidden');
    weatherDisplayCard.classList.add('hidden');

    try {
        const rawPayload = await fetchRawWeatherData(targetLocation);
        currentWeatherData = sanitizeWeatherData(rawPayload);
        
        console.log("Data serialization complete:", currentWeatherData);
        
        renderWeatherToDOM();
    } catch (error) {
        console.error("Weather fetch failed:", error);
    }
});
        
        
        
        // // PUSH THE NEW GARDEN LOGIC RIGHT HERE:// // 
function renderGardenFeatures(weatherData) {
    const recommendedVeggies = getRecommendedVegetables(weatherData.latitude);
    const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });
    const filteredCrops = recommendedVeggies.filter(veg => {
        const monthsArray = weatherData.latitude < 0 
            ? veg.plantingZones.southernHemisphereTemperate 
            : veg.plantingZones.northernHemisphereTemperate;
        return monthsArray.includes(currentMonthName);
    });
    activeRecommendedCrops = filteredCrops;
    // Hide the loading text indicator immediately when data arrives
    const loadingIndicator = document.getElementById('loading');
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    // 1. Make the garden container visible alongside the weather card
    const gardenContainer = document.getElementById('garden-container');
    if (gardenContainer) gardenContainer.classList.remove('hidden');

    // 2. Clear out old DOM list configurations
    const alertsList = document.getElementById('alerts-list');
    const cropsList = document.getElementById('crop-recommendations');
    if (alertsList) alertsList.innerHTML = '';
    if (cropsList) cropsList.innerHTML = '';

    // 3. Process each recommended vegetable step by step
    filteredCrops.forEach(veg => {
        // Feature 2: Fetch specific weather alerts matching this crop's profile
        const protection = getPlantSpecificProtection(veg, weatherData, isCelsius);

        // Feature 1: Build the clean visual interface card structure
        const veggieCard = document.createElement('div');
        veggieCard.className = 'crop-card';
        
        veggieCard.innerHTML = `
            <div class="crop-header">
                <h3>${veg.name}</h3>
                <span class="badge ${protection.class}">${protection.title}</span>
            </div>
            <div class="crop-details">
                <p><strong>☀️ Sunlight:</strong> ${veg.sunlight}</p>
                <p><strong>💧 Watering:</strong> ${veg.watering}</p>
                <p><strong>📅 Planting Season:</strong> Suitable during: ${(weatherData.latitude < 0 ? veg.plantingZones.southernHemisphereTemperate : veg.plantingZones.northernHemisphereTemperate).join(', ')}</p>
                <p><strong>🌱 Growing Tip:</strong> ${veg.careInstructions}</p>
            </div>
            <div class="crop-protection-box alert-${protection.class}">
                <p><strong>💡 Weather Guide:</strong> ${protection.message}</p>
            </div>
        `;

        // Append the finished card container straight to your screen grid layout
        cropsList.appendChild(veggieCard);
        const alertsList = document.getElementById('alerts-list');
    });
    let alertHTML = '';

    if (weatherData.tempC >= 32 ) {
        alertHTML += `
            <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: #ea580c; margin: 0 0 0.5rem 0;">⚠️ HOT WEATHER ALERT</h4>
               <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem; color: #7c2d12;">Temperatures are expected to reach <strong>${isCelsius ? weatherData.tempC + '°C' : weatherData.tempF + '°F'}</strong>.</p>
                <p style="margin: 0; font-size: 0.85rem; color: #9a3412;"><strong>🌱 Garden suggestion:</strong> Consider protecting heat-sensitive vegetables from intense afternoon sun. Check the soil moisture before watering.</p>
            </div>
        `;
    }
    const conditionText = weatherData.conditions ? weatherData.conditions.toLowerCase() : '';
    if (conditionText.includes('rain') || conditionText.includes('shower') || conditionText.includes('storm')) {
        alertHTML += `
            <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: #16a34a; margin: 0 0 0.5rem 0;">🌧️ HEAVY RAIN ALERT</h4>
                <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem; color: #14532d;">Heavy rain is expected tomorrow.</p>
                <p style="margin: 0; font-size: 0.85rem; color: #166534;"><strong>🌱 Garden suggestion:</strong> Check that your garden has good drainage, especially around young seedlings.</p>
            </div>
        `;
    }
    if (alertHTML === '') {
        alertHTML = `
            <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h4 style="color: #2563eb; margin: 0 0 0.5rem 0;">🛡️ System Status: Stable</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #1e3a8a;">No extreme weather threats detected for your patch today! Standard growing parameters apply.</p>
            </div>
        `;
    }

    if (alertsList) alertsList.innerHTML = alertHTML;
}

 
    gardenSearchInput.oninput = (e) => {
    const cropsList = document.getElementById('crop-recommendations');
    const query = e.target.value.toLowerCase().trim();
    
    // Clear the current list container on the screen
    cropsList.innerHTML = '';

    // Filter through the global beginnerVegetables array directly
    const filtered = activeRecommendedCrops.filter(item => 
        item.id.toLowerCase().includes(query) || 
        item.name.toLowerCase().includes(query)
    );

    // Re-render only the cards matching the typed text
    filtered.forEach(veg => {
        // Fetch weather protection rules if weather data exists
        const protection = currentWeatherData ? getPlantSpecificProtection(veg, currentWeatherData, isCelsius) : null;
        const alertClass = protection ? protection.class : 'stable';
        const alertTitle = protection ? protection.title : '✅ Core Profile';
        const alertMessage = protection ? protection.message : 'Search a city above to see live weather alerts for this crop!';

        const card = document.createElement('div');
        card.className = `crop-card alert-border-${alertClass}`;
        card.innerHTML = `
            <div class="crop-header">
                <h3>${veg.name}</h3>
                <span class="badge ${alertClass}">${alertTitle}</span>
            </div>
            <div class="crop-details">
                <p><strong>☀️ Sunlight:</strong> ${veg.sunlight}</p>
                <p><strong>💧 Watering:</strong> ${veg.watering}</p>
                <p><strong>📅 Planting Season:</strong> Suitable during: ${(currentWeatherData && currentWeatherData.latitude < 0 ? veg.plantingZones.southernHemisphereTemperate : veg.plantingZones.northernHemisphereTemperate).join(', ')}</p>
                <p><strong>🌱 Growing Tip:</strong> ${veg.careInstructions}</p>
            </div>
            <div class="crop-protection-box alert-${alertClass}">
                <p><strong>💡 Weather Guide:</strong> ${alertMessage}</p>
            </div>
        `;
        cropsList.appendChild(card);
    });
};


/**
 * Interactive Metric Event Registration
 */
unitToggleBtn.addEventListener('click', () => {
    isCelsius = !isCelsius;
    renderWeatherToDOM();
});
