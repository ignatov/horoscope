from flask import Flask, request, jsonify
import random
from datetime import datetime

app = Flask(__name__)

# Sample horoscope content
horoscope_themes = {
    "career": [
        "New opportunities will arise at work this week.",
        "Consider a bold career move - the stars favor risk-takers now.",
        "A colleague may seek your guidance - your expertise is valued.",
        "Financial prosperity is indicated if you remain focused.",
        "Your leadership qualities will be recognized by higher-ups.",
    ],
    "love": [
        "Romance is in the air - be open to new connections.",
        "Communication with your partner will improve dramatically.",
        "A surprising turn in your love life may leave you breathless.",
        "Past relationships may resurface - trust your intuition.",
        "Your charisma is at its peak - use it wisely in matters of the heart.",
    ],
    "health": [
        "Focus on mental wellness through meditation or mindfulness.",
        "Physical exercise will bring unexpected benefits this week.",
        "Pay attention to your sleep patterns for improved vitality.",
        "A new health routine could transform your well-being.",
        "Balance is key - ensure you're nurturing both body and mind.",
    ],
    "general": [
        "The universe is aligning to bring you unexpected joy.",
        "Patience will be rewarded - good things come to those who wait.",
        "Trust your instincts when making important decisions.",
        "A surprising encounter will shift your perspective.",
        "Remember that challenges are opportunities for growth in disguise.",
    ]
}

def generate_horoscope(theme="general", sign=""):
    """Generate a horoscope based on theme and astrological sign."""
    # Select theme content (default to general if theme not found)
    theme_content = horoscope_themes.get(theme.lower(), horoscope_themes["general"])
    
    # Get the current date for the horoscope
    current_date = datetime.now().strftime("%B %d, %Y")
    
    # Get one random prediction from the theme
    prediction = random.choice(theme_content)
    
    # Additional personalized content based on sign
    sign_message = ""
    if sign:
        lucky_number = random.randint(1, 100)
        lucky_colors = random.choice(["blue", "red", "green", "purple", "yellow", "orange"])
        compatible_signs = random.sample(["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                                         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"], 2)
        
        sign_message = f"\nLucky Number: {lucky_number}\nLucky Colors: {lucky_colors}\nCompatible Signs: {', '.join(compatible_signs)}"
    
    # Construct the full horoscope
    horoscope = f"Horoscope for {sign if sign else 'you'} - {current_date}\n\n{prediction}{sign_message}"
    
    return horoscope

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to the Horoscope API',
        'endpoints': ['/api/horoscope']
    })

@app.route('/api/horoscope')
def get_horoscope():
    # Set CORS headers manually
    resp = jsonify({
        'horoscope': generate_horoscope(
            request.args.get('theme', 'general'),
            request.args.get('sign', '')
        ),
        'theme': request.args.get('theme', 'general'),
        'sign': request.args.get('sign', '')
    })
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)