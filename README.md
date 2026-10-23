# Weather-Smart Gardening Dashboard 🌦️🌱

A frontend web application that combines real-time weather tracking with regional vegetable-planting data to help beginner gardeners protect their crops.
Instead of building a generic weather application, I built this dashboard to solve a real user problem: helping beginners decide what to plant, when to plant it, and how to react to changing weather conditions.
🔗 Live Demo Link

## key Features

• Dynamic Weather Tracking: Fetches real-time temperature, humidity, and wind speed data for any searched city.
• Garden Shield Alerts: Displays an instant system status message notifying users of extreme weather conditions or stability.
• Smart Vegetable Cards: Renders clean UI cards for crops (like Lettuce and Carrots) showing sunlight needs, watering frequencies, and dynamic planting seasons.
• Temperature Unit Toggle: Allows users to switch seamlessly between Celsius (°C) and Fahrenheit (°F) across the entire application state.

## Built With

• HTML5 – Structured semantic layout
• CSS3 – Clean user interface, layout cards, and responsive columns
• JavaScript (Vanilla) – Async API fetching, dynamic DOM manipulation, and state management

## Technical Challenges & Lessons Learned

Building this application pushed my JavaScript skills forward. Here are the core problems I investigated and solved during development:
• DOM Selector Accuracy: Fixed a vegetable search issue where the event listener originally targeted the wrong HTML element by correcting it to point directly to the garden input field.
• Deep Data Management: Resolved a TypeError where .join() was called on undefined by refactoring how the application navigated nested regional objects to find accurate planting months.
• Component State Synchronization: Solved a state bug where the main temperature toggle changed the units on the display but not on individual crop cards by passing the active state down through the rendering functions.
• Disciplined Debugging: Instead of guessing code fixes, I learned to slow down, read terminal and console errors carefully, and trace the execution path of my code.