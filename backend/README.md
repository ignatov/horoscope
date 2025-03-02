# Horoscope Generator

A horoscope generator website with React frontend and Python/Flask backend.

## Key Components

### Backend (Python/Flask)
- Flask endpoints that generate horoscopes
- API integration with Claude AI to generate personalized horoscopes
- Language support (English/Russian)
- Multilingual support for zodiac signs, dates, and lucky elements
- Fallback mechanisms when API is unavailable

### Frontend (React)
- Responsive UI with styled-components
- Language switcher (Russian default, English option)
- Theme selection (General, Career, Love, Health, Custom)
- Zodiac sign selection
- Compact responsive interface with star-themed background
- Animated star background with twinkling and shooting stars

## Features
- Generates personalized horoscopes based on theme and zodiac sign
- Supports custom topics
- Displays horoscopes in Russian or English
- Shows lucky numbers, colors, and compatible signs
- Includes fully translated interface elements
- Visually appealing cosmic design with animations

## Files
- `/backend/app.py`: Flask server with horoscope generation logic
- `/backend/requirements.txt`: Python dependencies
- `/frontend/src/App.js`: Main React component
- `/frontend/src/index.css`: Global styles including star animations
- `/frontend/public/index.html`: HTML entry point

## Getting Started

### Backend Setup
1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment: 
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `python app.py`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`