# Cosmic Insights - AI-Powered Horoscope Generator

A web application that generates personalized horoscopes using Claude Sonnet 3.7 AI with a React frontend and Python Flask backend.

## Features

- AI-generated horoscopes using Anthropic's Claude Sonnet 3.7 model
- Personalized content based on zodiac signs and astrological knowledge
- Multiple themes available (General, Career, Love, Health)
- Smart recommendations for compatible signs based on elemental relationships
- Responsive design that works on mobile and desktop
- Beautiful cosmic-themed UI

## Project Structure

```
horo/
├── backend/            # Python Flask backend
│   ├── app.py          # Main Flask application
│   └── requirements.txt # Python dependencies
├── frontend/           # React frontend
│   ├── public/         # Static files
│   └── src/            # React source code
└── README.md           # Project documentation
```

## Setup & Running

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up Anthropic API key:
   - Edit the `.env` file in the backend directory
   - Replace `your_api_key_here` with your actual Anthropic API key
   - If you don't have an API key, the app will fall back to pre-written content

5. Run the Flask server:
   ```
   python app.py
   ```

The backend will be available at http://localhost:5001

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will be available at http://localhost:3000 and will connect to the backend at http://localhost:5001

## How It Works

1. The React frontend provides a user interface for selecting horoscope themes and zodiac signs
2. When a user requests a horoscope, the Flask backend creates a prompt for Claude based on the selected theme and sign
3. The Anthropic API is called with the prompt to generate a personalized horoscope using Claude Sonnet 3.7
4. The AI-generated content is enhanced with additional personalized elements like lucky numbers and compatible signs
5. The finished horoscope is returned to the frontend and displayed in a visually appealing card
6. If the API call fails or no API key is provided, the app falls back to pre-written content

## Technologies Used

- **Frontend**: React, Styled Components, Fetch API
- **Backend**: Python, Flask
- **AI Integration**: Anthropic's Claude API (Sonnet 3.7 model)
- **Configuration**: python-decouple for environment variables