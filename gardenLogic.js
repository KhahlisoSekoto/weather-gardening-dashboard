// gardenLogic.js
import { beginnerVegetables } from './gardenData.js';

// RECOMMENDATION ENGINE (Based on location hemisphere month windows)
export function getRecommendedVegetables(latitude) {
    const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });
    const isSouthernHemisphere = latitude < 0;
    const zoneKey = isSouthernHemisphere ? 'southernHemisphereTemperate' : 'northernHemisphereTemperate';

    return beginnerVegetables.filter(veg => veg.plantingZones[zoneKey].includes(currentMonthName));
}

// DYNAMIC CROP-SPECIFIC WEATHER SHIELD ALERT ENGINE
export function getPlantSpecificProtection(veg, weatherData, isCelsiusMode) {
    const temp = weatherData.tempC;
    const conditionText = weatherData.conditions.toLowerCase();

    let alertTitle = "✅ Conditions Look Stable";
    let alertClass = "stable";
    let adviceMessage = `Weather metrics look good for your ${veg.name}. Normal growing parameters apply. Keep tabs on local forecast transitions!`;

    // Dynamic Heatwave Rules (Sensitive crops like lettuce vs robust crops)
    if (temp > 32) {
        alertTitle = "⚠️ HOT WEATHER ALERT";
        alertClass = "heat";
        if (veg.id === "lettuce" || veg.id === "spinach") {
            adviceMessage = `Temperatures are hitting a scorching ${isCelsiusMode ? weatherData.tempC + '°C' : weatherData.tempF + '°F'}! 🥬 ${veg.name} is highly heat-sensitive. You MUST protect it from the intense afternoon sun with a shade cloth, or it will bolt and turn bitter. Run a finger-test check on your soil immediately!`;
        } else {
            adviceMessage = `Temperatures are reaching ${isCelsiusMode ? weatherData.tempC + '°C' : weatherData.tempF + '°F'}. Check your soil moisture levels deeply before adding any more water to your patch.`;
        }
    } 
    // Cold Frost Rules
    else if (temp < 4) {
        alertTitle = "❄️ COLD & FROST WARNING";
        alertClass = "cold";
        adviceMessage = `Chilly conditions ahead (${temp}°C). Check whether your young ${veg.name} setups need a protective frost blanket cover or move container arrangements indoors tonight.`;
    } 
    // Heavy Precipitation Storm Rules
    else if (conditionText.includes("rain") || conditionText.includes("shower") || conditionText.includes("storm")) {
        alertTitle = "🌧️ HEAVY RAIN ALERT";
        alertClass = "rain";
        adviceMessage = `Precipitation detected (${weatherData.conditions}). Check that your garden plot has good drainage, especially around young ${veg.name} seedlings, to avoid root rot. Reconsider manual watering lines today!`;
    }

    return { title: alertTitle, message: adviceMessage, class: alertClass };
}