import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components
const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 0.2rem;
  color: #f8f9fa;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #ced4da;
  margin-bottom: 0.2rem;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const FormRow = styled.div`
  margin-bottom: 0.7rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
  color: #e9ecef;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  margin-top: 0.3rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(255, 94, 98, 0.4);
  }
`;

const HoroscopeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 0.8rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  white-space: pre-line;
`;

const HoroscopeTitle = styled.h2`
  color: #f8f9fa;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  text-align: center;
`;

const HoroscopeText = styled.p`
  line-height: 1.4;
  font-size: 0.95rem;
`;

const HoroscopeSeparator = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 1.5rem 0;
`;

const Loading = styled.div`
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: #e9ecef;
`;

const LanguageToggle = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  display: flex;
  justify-content: flex-end;
  z-index: 10;
  max-width: 800px;
  width: 100%;
  padding-right: 1rem;
`;

const LanguageButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 94, 98, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  margin: 0 0.2rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  
  &:hover {
    background: ${props => props.active ? 'rgba(255, 94, 98, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.selected {
    background: rgba(255, 94, 98, 0.4);
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

// App Component
function App() {
  const [theme, setTheme] = useState('general');
  const [selectedSigns, setSelectedSigns] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
  const [horoscopes, setHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [language, setLanguage] = useState('ru'); // Default to Russian

  const zodiacSignsEn = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const zodiacSignsRu = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];
  
  // Mapping between Russian and English signs for backend API
  const zodiacSignMap = {
    'Овен': 'Aries', 
    'Телец': 'Taurus', 
    'Близнецы': 'Gemini', 
    'Рак': 'Cancer', 
    'Лев': 'Leo', 
    'Дева': 'Virgo',
    'Весы': 'Libra', 
    'Скорпион': 'Scorpio', 
    'Стрелец': 'Sagittarius', 
    'Козерог': 'Capricorn', 
    'Водолей': 'Aquarius', 
    'Рыбы': 'Pisces'
  };

  const themeOptions = [
    { value: 'general', label: 'General' },
    { value: 'career', label: 'Career & Finance' },
    { value: 'love', label: 'Love & Relationships' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'custom', label: 'Custom Topic...' }
  ];

  const toggleSign = (sign) => {
    setSelectedSigns(prev => {
      if (prev.includes(sign)) {
        return prev.filter(s => s !== sign);
      } else {
        return [...prev, sign];
      }
    });
  };

  const fetchHoroscope = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate custom topic if that option is selected
    if (theme === 'custom' && !customTopic.trim()) {
      setHoroscopes([{
        sign: '',
        text: language === 'ru' 
          ? 'Пожалуйста, введите тему перед созданием гороскопа.' 
          : 'Please enter a custom topic before generating your horoscope.'
      }]);
      setLoading(false);
      return;
    }
    
    // Validate that at least one sign is selected
    if (selectedSigns.length === 0) {
      setHoroscopes([{
        sign: '',
        text: language === 'ru' 
          ? 'Пожалуйста, выберите хотя бы один знак зодиака.' 
          : 'Please select at least one zodiac sign.'
      }]);
      setLoading(false);
      return;
    }
    
    try {
      const results = [];
      
      // Fetch horoscope for each selected sign
      for (const sign of selectedSigns) {
        // Convert Russian zodiac sign to English if needed
        const apiSign = language === 'ru' ? zodiacSignMap[sign] || sign : sign;
        
        // Use fetch with full URL including custom topic and language
        const url = `http://localhost:5001/api/horoscope?theme=${theme}&sign=${apiSign}&language=${language}${theme === 'custom' ? `&customTopic=${encodeURIComponent(customTopic)}` : ''}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        results.push({
          sign: sign,
          text: data.horoscope
        });
      }
      
      setHoroscopes(results);
    } catch (error) {
      console.error('Error fetching horoscopes:', error);
      setHoroscopes([{
        sign: '',
        text: language === 'ru' 
          ? 'Не удалось создать гороскоп. Пожалуйста, попробуйте позже.' 
          : 'Unable to generate horoscope at this time. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      {/* Stars background */}
      <div className="stars stars-1"></div>
      <div className="stars stars-2"></div>
      <div className="shooting-star shooting-star-1"></div>
      <div className="shooting-star shooting-star-2"></div>
      <div className="shooting-star shooting-star-3"></div>
      
      <LanguageToggle>
        <LanguageButton 
          active={language === 'ru'} 
          onClick={() => setLanguage('ru')}
        >
          Рус
        </LanguageButton>
        <LanguageButton 
          active={language === 'en'} 
          onClick={() => setLanguage('en')}
        >
          Eng
        </LanguageButton>
      </LanguageToggle>
        
      <Header>
        <Title>✨ {language === 'ru' ? 'Космические Прозрения' : 'Cosmic Insights'} ✨</Title>
        <Subtitle>
          {language === 'ru' 
            ? 'Персонализированный гороскоп к мудрости вселенной' 
            : 'Personalized horoscope guide to the universe\'s wisdom'}
        </Subtitle>
      </Header>
      
      <Form onSubmit={fetchHoroscope}>
        <FormRow>
          <Label htmlFor="theme">
            {language === 'ru' ? 'Выберите тему:' : 'Select a Theme:'}
          </Label>
          <Select 
            id="theme" 
            value={theme} 
            onChange={(e) => {
              const selectedTheme = e.target.value;
              setTheme(selectedTheme);
              setShowCustom(selectedTheme === 'custom');
            }}
          >
            {themeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {language === 'ru' && option.value === 'general' ? 'Общий' : 
                 language === 'ru' && option.value === 'career' ? 'Карьера и финансы' :
                 language === 'ru' && option.value === 'love' ? 'Любовь и отношения' :
                 language === 'ru' && option.value === 'health' ? 'Здоровье и самочувствие' :
                 language === 'ru' && option.value === 'custom' ? 'Своя тема...' :
                 option.label}
              </option>
            ))}
          </Select>
          
          {showCustom && (
            <Input
              id="customTopic"
              type="text"
              placeholder={language === 'ru' 
                ? "Введите свою тему (например, Путешествия, Образование, Творчество)" 
                : "Enter your custom topic (e.g., Travel, Education, Creativity)"}
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
            />
          )}
        </FormRow>
        
        <FormRow>
          <Label>
            {language === 'ru' ? 'Выберите знаки зодиака:' : 'Select Zodiac Signs:'}
          </Label>
          <CheckboxContainer>
            {(language === 'ru' ? zodiacSignsRu : zodiacSignsEn).map(zodiacSign => (
              <CheckboxLabel 
                key={zodiacSign}
                className={selectedSigns.includes(zodiacSign) ? 'selected' : ''}
              >
                <HiddenCheckbox 
                  checked={selectedSigns.includes(zodiacSign)}
                  onChange={() => toggleSign(zodiacSign)}
                />
                {zodiacSign}
              </CheckboxLabel>
            ))}
          </CheckboxContainer>
        </FormRow>
        
        <Button type="submit">
          {language === 'ru' ? 'Создать Гороскопы' : 'Generate Horoscopes'}
        </Button>
      </Form>
      
      {loading ? (
        <Loading>
          ✨ {language === 'ru' ? 'Консультируемся со звездами...' : 'Consulting the stars...'} ✨
        </Loading>
      ) : horoscopes.length > 0 && (
        <div>
          {horoscopes.map((horoscope, index) => (
            <div key={index}>
              {index > 0 && <HoroscopeSeparator />}
              <HoroscopeCard>
                <HoroscopeTitle>
                  {horoscope.sign 
                    ? (language === 'ru' ? `Прогноз для ${horoscope.sign}` : `Forecast for ${horoscope.sign}`) 
                    : (language === 'ru' ? 'Сообщение' : 'Message')}
                </HoroscopeTitle>
                <HoroscopeText>{horoscope.text}</HoroscopeText>
              </HoroscopeCard>
            </div>
          ))}
        </div>
      )}
    </AppContainer>
  );
}

export default App;