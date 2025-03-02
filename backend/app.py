from flask import Flask, request, jsonify, make_response
import random
from datetime import datetime
import anthropic
from decouple import config
import os

app = Flask(__name__)

# Initialize Anthropic client
ANTHROPIC_API_KEY = config('ANTHROPIC_API_KEY', default='')
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

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

def generate_horoscope(theme="general", sign="", custom_topic="", language="en"):
    """Generate a horoscope based on theme and astrological sign using Claude."""
    # Get the current date for the horoscope based on language
    if language == "ru":
        # Russian date format with Russian month names
        month_names_ru = {
            "January": "января", "February": "февраля", "March": "марта", 
            "April": "апреля", "May": "мая", "June": "июня",
            "July": "июля", "August": "августа", "September": "сентября", 
            "October": "октября", "November": "ноября", "December": "декабря"
        }
        eng_date = datetime.now().strftime("%B %d, %Y")
        month = eng_date.split()[0]
        day = eng_date.split()[1].replace(",", "")
        year = eng_date.split()[2]
        current_date = f"{day} {month_names_ru[month]} {year}"
    else:
        current_date = datetime.now().strftime("%B %d, %Y")
    
    # Theme descriptions in English
    theme_descriptions_en = {
        "general": "overall life path, destiny, and general outlook",
        "career": "career prospects, finances, professional development, and workplace dynamics",
        "love": "romantic relationships, emotional connections, and matters of the heart",
        "health": "physical wellbeing, mental health, energy levels, and overall wellness",
        "custom": custom_topic
    }
    
    # Theme descriptions in Russian
    theme_descriptions_ru = {
        "general": "общий жизненный путь, судьба и общие перспективы",
        "career": "карьерные перспективы, финансы, профессиональное развитие и рабочая динамика",
        "love": "романтические отношения, эмоциональные связи и сердечные дела",
        "health": "физическое благополучие, психическое здоровье, энергетические уровни и общее самочувствие",
        "custom": custom_topic
    }
    
    # Choose the appropriate descriptions based on language
    theme_descriptions = theme_descriptions_ru if language == "ru" else theme_descriptions_en
    
    # If a custom topic is provided and theme is set to custom, use that
    if custom_topic and theme.lower() == "custom":
        theme_desc = custom_topic
    else:
        # Otherwise use one of the predefined themes
        theme_desc = theme_descriptions.get(theme.lower(), theme_descriptions["general"])
    
    # Create a prompt for Claude
    if not ANTHROPIC_API_KEY or ANTHROPIC_API_KEY == 'your_api_key_here':
        # Fallback to pre-written horoscopes if API key is not set
        return generate_fallback_horoscope(theme, sign, language)
    
    try:
        # Get zodiac traits if sign is provided (with appropriate language)
        sign_traits = get_zodiac_traits(sign, language) if sign else ""
        
        # Create different prompts based on language
        if language == "ru":
            prompt = f"""
            Вы мистический астролог с глубоким космическим знанием. Создайте краткий персонализированный гороскоп о {theme_desc}.
            
            Сегодняшняя дата: {current_date}
            {"Знак зодиака: " + sign if sign else "Это общий гороскоп."}
            {sign_traits}
            
            Напишите ОЧЕНЬ КОРОТКИЙ гороскоп, содержащий ТОЛЬКО 2-3 КРАТКИХ утверждения, включая:
            1. Краткое предсказание о {theme} человека в ближайшие дни
            2. Короткий совет или наставление
            
            Избегайте сложных метафор и длинных предложений. Пишите просто и понятно.
            Весь гороскоп должен состоять не более чем из 2-3 КОРОТКИХ предложений.
            
            ОЧЕНЬ ВАЖНО! Пишите ТОЛЬКО на русском языке.
            """
        else:
            prompt = f"""
            You are a mystical astrologer with deep cosmic knowledge. Create a concise personalized horoscope about {theme_desc}.
            
            Today's date: {current_date}
            {"Zodiac sign: " + sign if sign else "This is a general horoscope."}
            {sign_traits}
            
            Write a VERY SHORT horoscope with ONLY 2-3 BRIEF statements that includes:
            1. A brief prediction about the person's {theme} in the coming days
            2. A short piece of advice or guidance
            
            Avoid complex metaphors and long sentences. Write simply and clearly.
            The entire horoscope should be no more than 2-3 SHORT sentences total.
            """
        
        # Call Claude API with Anthropic client
        try:
            # Set up the system prompt for the astrologer based on language
            if language == "ru":
                system_prompt = "Вы мистический астролог, который пишет очень краткие, глубокие гороскопы. Ваш тон мудрый, мистический и позитивный - но вы ОЧЕНЬ кратки, используя не более 2-3 коротких предложений всего. Пишете ТОЛЬКО на русском языке. Не подписывайте свои предсказания. Избегайте сложных метафор и очень длинных предложений."
            else:
                system_prompt = "You are a mystical astrologer who writes very concise, insightful horoscopes. Your tone is wise, mystical, and positive - but you are EXTREMELY brief, using only 2-3 short sentences total. Keep predictions simple and easy to understand. Avoid complex metaphors and very long sentences. Do not sign your predictions."
            
            # Try with Claude 3.5 Sonnet
            try:
                message = client.messages.create(
                    model="claude-3-5-sonnet-latest",
                    max_tokens=120,  # Reduce token limit to ensure we don't get cutoff
                    temperature=0.7,
                    system=system_prompt,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                horoscope_text = message.content[0].text.strip()
            except Exception as e1:
                print(f"Error with Claude 3.5 Sonnet: {e1}")
                # If that fails, try Claude 3 Opus
                try:
                    message = client.messages.create(
                        model="claude-3-opus-20240229",
                        max_tokens=120,  # Reduce token limit for consistent length
                        temperature=0.7,
                        system=system_prompt,
                        messages=[
                            {"role": "user", "content": prompt}
                        ]
                    )
                    horoscope_text = message.content[0].text.strip()
                except Exception as e2:
                    print(f"Error with Claude 3 Opus: {e2}")
                    # Final fallback - use the pre-written content
                    raise Exception("All Claude models failed")
        
        except Exception as e:
            print(f"Error calling Anthropic API: {e}")
            return generate_fallback_horoscope(theme, sign)
        
        # Generate additional personalized elements
        lucky_number = random.randint(1, 100)
        lucky_colors = random.choice(["blue", "red", "green", "purple", "yellow", "orange", "teal", "gold", "silver", "indigo"])
        
        # Get compatible signs based on element groups
        compatible_signs = get_compatible_signs(sign) if sign else random.sample(["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                                         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"], 2)
        
        # Color names in Russian
        color_names_ru = {
            "blue": "синий", "red": "красный", "green": "зелёный", 
            "purple": "фиолетовый", "yellow": "жёлтый", "orange": "оранжевый",
            "teal": "бирюзовый", "gold": "золотой", "silver": "серебряный", "indigo": "индиго"
        }
        
        # Translate zodiac sign names for compatible signs if Russian is selected
        if language == "ru":
            # Map for English to Russian zodiac signs
            en_to_ru_signs = {
                "Aries": "Овен", "Taurus": "Телец", "Gemini": "Близнецы", 
                "Cancer": "Рак", "Leo": "Лев", "Virgo": "Дева",
                "Libra": "Весы", "Scorpio": "Скорпион", "Sagittarius": "Стрелец", 
                "Capricorn": "Козерог", "Aquarius": "Водолей", "Pisces": "Рыбы"
            }
            translated_compatible_signs = [en_to_ru_signs.get(s, s) for s in compatible_signs]
            translated_lucky_color = color_names_ru.get(lucky_colors, lucky_colors)
            
            # Russian output with proper grammatical cases
            if sign:
                sign_name = en_to_ru_signs.get(sign, sign)
                # Dictionary for proper genitive case endings in Russian
                sign_name_genitive = {
                    "Овен": "Овна", "Телец": "Тельца", "Близнецы": "Близнецов", 
                    "Рак": "Рака", "Лев": "Льва", "Дева": "Девы",
                    "Весы": "Весов", "Скорпион": "Скорпиона", "Стрелец": "Стрельца", 
                    "Козерог": "Козерога", "Водолей": "Водолея", "Рыбы": "Рыб"
                }
                # Just use the sign name as the title
                full_horoscope = f"{sign_name}\n\n"
            else:
                full_horoscope = f"Общий\n\n"
                
            full_horoscope += horoscope_text
            full_horoscope += f"\n\nСчастливое число: {lucky_number}"
            full_horoscope += f"\nСчастливые цвета: {translated_lucky_color}"
            full_horoscope += f"\nСовместимые знаки: {', '.join(translated_compatible_signs)}"
        else:
            # English output
            full_horoscope = f"{sign if sign else 'General'}\n\n"
            full_horoscope += horoscope_text
            full_horoscope += f"\n\nLucky Number: {lucky_number}"
            full_horoscope += f"\nLucky Colors: {lucky_colors}"
            full_horoscope += f"\nCompatible Signs: {', '.join(compatible_signs)}"
        
        return full_horoscope
        
    except Exception as e:
        # Fallback to pre-generated content if API call fails
        print(f"Error calling Anthropic API: {e}")
        return generate_fallback_horoscope(theme, sign, language)

def get_zodiac_traits(sign, language="en"):
    """Get personality traits and characteristics for a specific zodiac sign in the specified language."""
    # English zodiac traits
    zodiac_traits_en = {
        "Aries": "Known for being confident, determined, and enthusiastic. A fire sign ruled by Mars.",
        "Taurus": "Known for being reliable, patient, and practical. An earth sign ruled by Venus.",
        "Gemini": "Known for being adaptable, outgoing, and curious. An air sign ruled by Mercury.",
        "Cancer": "Known for being loyal, emotional, and caring. A water sign ruled by the Moon.",
        "Leo": "Known for being creative, passionate, and generous. A fire sign ruled by the Sun.",
        "Virgo": "Known for being analytical, kind, and hardworking. An earth sign ruled by Mercury.",
        "Libra": "Known for being cooperative, diplomatic, and social. An air sign ruled by Venus.",
        "Scorpio": "Known for being brave, passionate, and resourceful. A water sign ruled by Pluto.",
        "Sagittarius": "Known for being optimistic, honest, and adventurous. A fire sign ruled by Jupiter.",
        "Capricorn": "Known for being responsible, disciplined, and self-controlled. An earth sign ruled by Saturn.",
        "Aquarius": "Known for being progressive, original, and independent. An air sign ruled by Uranus.",
        "Pisces": "Known for being compassionate, artistic, and intuitive. A water sign ruled by Neptune."
    }
    
    # Russian zodiac traits
    zodiac_traits_ru = {
        "Aries": "Известен своей уверенностью, решительностью и энтузиазмом. Огненный знак под управлением Марса.",
        "Taurus": "Известен своей надежностью, терпением и практичностью. Земной знак под управлением Венеры.",
        "Gemini": "Известен своей адаптивностью, общительностью и любознательностью. Воздушный знак под управлением Меркурия.",
        "Cancer": "Известен своей верностью, эмоциональностью и заботливостью. Водный знак под управлением Луны.",
        "Leo": "Известен своей креативностью, страстностью и щедростью. Огненный знак под управлением Солнца.",
        "Virgo": "Известен своей аналитичностью, добротой и трудолюбием. Земной знак под управлением Меркурия.",
        "Libra": "Известен своей склонностью к сотрудничеству, дипломатичностью и общительностью. Воздушный знак под управлением Венеры.",
        "Scorpio": "Известен своей смелостью, страстностью и находчивостью. Водный знак под управлением Плутона.",
        "Sagittarius": "Известен своим оптимизмом, честностью и любовью к приключениям. Огненный знак под управлением Юпитера.",
        "Capricorn": "Известен своей ответственностью, дисциплинированностью и самоконтролем. Земной знак под управлением Сатурна.",
        "Aquarius": "Известен своей прогрессивностью, оригинальностью и независимостью. Воздушный знак под управлением Урана.",
        "Pisces": "Известен своим состраданием, художественностью и интуицией. Водный знак под управлением Нептуна."
    }
    
    # Choose the appropriate language
    zodiac_traits = zodiac_traits_ru if language == "ru" else zodiac_traits_en
    
    return zodiac_traits.get(sign, "")

def get_compatible_signs(sign):
    """Get compatible signs based on elemental relationships."""
    fire_signs = ["Aries", "Leo", "Sagittarius"]
    earth_signs = ["Taurus", "Virgo", "Capricorn"]
    air_signs = ["Gemini", "Libra", "Aquarius"]
    water_signs = ["Cancer", "Scorpio", "Pisces"]
    
    # Get the element group of the sign
    if sign in fire_signs:
        # Fire is compatible with Air and other Fire
        compatible_group = air_signs + [s for s in fire_signs if s != sign]
    elif sign in earth_signs:
        # Earth is compatible with Water and other Earth
        compatible_group = water_signs + [s for s in earth_signs if s != sign]
    elif sign in air_signs:
        # Air is compatible with Fire and other Air
        compatible_group = fire_signs + [s for s in air_signs if s != sign]
    elif sign in water_signs:
        # Water is compatible with Earth and other Water
        compatible_group = earth_signs + [s for s in water_signs if s != sign]
    else:
        # Fallback if sign not recognized
        compatible_group = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                           "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    
    # Remove the current sign if it's in the compatible group
    if sign in compatible_group:
        compatible_group.remove(sign)
    
    # Return 2-3 random compatible signs
    return random.sample(compatible_group, min(3, len(compatible_group)))

def generate_fallback_horoscope(theme="general", sign="", language="en"):
    """Fallback to generate a horoscope based on pre-written content."""
    # Get the current date for the horoscope based on language
    if language == "ru":
        # Russian date format with Russian month names
        month_names_ru = {
            "January": "января", "February": "февраля", "March": "марта", 
            "April": "апреля", "May": "мая", "June": "июня",
            "July": "июля", "August": "августа", "September": "сентября", 
            "October": "октября", "November": "ноября", "December": "декабря"
        }
        eng_date = datetime.now().strftime("%B %d, %Y")
        month = eng_date.split()[0]
        day = eng_date.split()[1].replace(",", "")
        year = eng_date.split()[2]
        current_date = f"{day} {month_names_ru[month]} {year}"
    else:
        current_date = datetime.now().strftime("%B %d, %Y")
    
    # Select theme content (default to general if theme not found)
    theme_content = horoscope_themes.get(theme.lower(), horoscope_themes["general"])
    
    # Get one random prediction from the theme
    prediction = random.choice(theme_content)
    
    # Additional personalized content based on sign
    lucky_number = random.randint(1, 100)
    lucky_colors = random.choice(["blue", "red", "green", "purple", "yellow", "orange"])
    compatible_signs = random.sample(["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                                     "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"], 2)
    
    # Format output based on language
    if language == "ru":
        # Russian translations for colors
        color_names_ru = {
            "blue": "синий", "red": "красный", "green": "зелёный", 
            "purple": "фиолетовый", "yellow": "жёлтый", "orange": "оранжевый"
        }
        
        # Russian translations for zodiac signs
        en_to_ru_signs = {
            "Aries": "Овен", "Taurus": "Телец", "Gemini": "Близнецы", 
            "Cancer": "Рак", "Leo": "Лев", "Virgo": "Дева",
            "Libra": "Весы", "Scorpio": "Скорпион", "Sagittarius": "Стрелец", 
            "Capricorn": "Козерог", "Aquarius": "Водолей", "Pisces": "Рыбы"
        }
        
        # Translate compatible signs and color
        translated_compatible_signs = [en_to_ru_signs.get(s, s) for s in compatible_signs]
        translated_lucky_color = color_names_ru.get(lucky_colors, lucky_colors)
        
        # Set sign message with Russian labels
        sign_message = f"\n\nСчастливое число: {lucky_number}\nСчастливые цвета: {translated_lucky_color}\nСовместимые знаки: {', '.join(translated_compatible_signs)}"
        
        # Provide basic Russian fallback prediction if not provided by Claude
        ru_prediction = "Звезды сегодня благоприятствуют вашим начинаниям. Внимательно отнеситесь к деталям и доверяйте своей интуиции."
        
        # Russian horoscope format with genitive case
        if sign:
            sign_name = en_to_ru_signs.get(sign, sign)
            # Dictionary for proper genitive case endings in Russian
            sign_name_genitive = {
                "Овен": "Овна", "Телец": "Тельца", "Близнецы": "Близнецов", 
                "Рак": "Рака", "Лев": "Льва", "Дева": "Девы",
                "Весы": "Весов", "Скорпион": "Скорпиона", "Стрелец": "Стрельца", 
                "Козерог": "Козерога", "Водолей": "Водолея", "Рыбы": "Рыб"
            }
            # Just the sign name as title
            horoscope = f"{sign_name}\n\n{ru_prediction}{sign_message}"
        else:
            horoscope = f"Общий\n\n{ru_prediction}{sign_message}"
    else:
        # English format
        sign_message = f"\n\nLucky Number: {lucky_number}\nLucky Colors: {lucky_colors}\nCompatible Signs: {', '.join(compatible_signs)}"
        horoscope = f"{sign if sign else 'General'}\n\n{prediction}{sign_message}"
    
    return horoscope

@app.route('/')
def home():
    resp = jsonify({
        'message': 'Welcome to the Horoscope API',
        'endpoints': ['/api/horoscope']
    })
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/api/horoscope')
def get_horoscope():
    # Get parameters
    theme = request.args.get('theme', 'general')
    sign = request.args.get('sign', '')
    custom_topic = request.args.get('customTopic', '')
    language = request.args.get('language', 'en')  # Default to English if not specified
    
    # Generate horoscope with custom topic and language
    horoscope_text = generate_horoscope(theme, sign, custom_topic, language)
    
    # Set CORS headers manually
    resp = jsonify({
        'horoscope': horoscope_text,
        'theme': theme,
        'sign': sign,
        'customTopic': custom_topic,
        'language': language
    })
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)