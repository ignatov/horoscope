import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0.8rem;
  position: relative;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 0.8rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.2rem;
  color: #f8f9fa;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #ced4da;
  margin-bottom: 0.2rem;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const FormRow = styled.div`
  margin-bottom: 0.6rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #e9ecef;
  font-size: 0.8rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.4rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 0.8rem;
  font-family: 'Poppins', sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.4rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 0.8rem;
  font-family: 'Poppins', sans-serif;
  margin-top: 0.25rem;
`;

const buttonHeight = '36px'; // Shared height for both buttons

const Button = styled.button`
  background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);
  color: white;
  border: none;
  padding: 0 1.2rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  min-width: 180px;
  height: ${buttonHeight};
  line-height: ${buttonHeight};
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(255, 94, 98, 0.4);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const IconButton = styled.button`
  background: linear-gradient(135deg, #9966ff 0%, #5e62ff 100%);
  color: white;
  border: none;
  width: ${buttonHeight};
  height: ${buttonHeight};
  border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: transform 0.2s, box-shadow 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 3px 10px rgba(94, 98, 255, 0.4)'};
  }
  
  &:hover::after {
    content: ${props => props.disabled ? '""' : '"' + props.title + '"'};
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    white-space: nowrap;
    z-index: 10;
    pointer-events: none;
  }
`;

// Copy icon SVG
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

// Tooltip styling for the copy icon
const Tooltip = styled.span`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
`;

const CopySuccess = styled.div`
  text-align: center;
  margin: 0.5rem auto;
  color: #66ff99;
  font-size: 0.75rem;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
  height: ${props => props.visible ? 'auto' : 0};
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
  gap: 0.25rem;
  margin-top: 0.4rem;
  justify-content: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.5rem;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  user-select: none;
  white-space: nowrap;
  font-size: 0.75rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.selected {
    background: rgba(255, 94, 98, 0.4);
    transform: scale(1.05);
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
  // Load saved preferences from localStorage or use defaults
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('horoscopeTheme');
    return savedTheme || 'general';
  };
  
  const getSavedSignsRu = () => {
    try {
      const savedSigns = localStorage.getItem('horoscopeSignsRu');
      return savedSigns ? JSON.parse(savedSigns) : [];
    } catch (e) {
      console.error('Error parsing saved signs from localStorage:', e);
      return [];
    }
  };
  
  const getSavedSignsEn = () => {
    try {
      const savedSigns = localStorage.getItem('horoscopeSignsEn');
      return savedSigns ? JSON.parse(savedSigns) : [];
    } catch (e) {
      console.error('Error parsing saved signs from localStorage:', e);
      return [];
    }
  };
  
  const getSavedLanguage = () => {
    const savedLanguage = localStorage.getItem('horoscopeLanguage');
    return savedLanguage === 'en' ? 'en' : 'ru'; // Default to Russian if invalid
  };
  
  const getSavedCustomTopic = () => {
    return localStorage.getItem('horoscopeCustomTopic') || '';
  };
  
  // Initialize state with saved values
  const [theme, setTheme] = useState(getSavedTheme());
  const [selectedSignsRu, setSelectedSignsRu] = useState(getSavedSignsRu());
  const [selectedSignsEn, setSelectedSignsEn] = useState(getSavedSignsEn());
  const [customTopic, setCustomTopic] = useState(getSavedCustomTopic());
  const [horoscopes, setHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(theme === 'custom');
  const [language, setLanguage] = useState(getSavedLanguage());
  const [copySuccess, setCopySuccess] = useState(false);

  const zodiacSignsEn = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const zodiacSignsRu = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];
  
  // Shorter versions of Russian zodiac names for UI display
  const zodiacSignsRuShort = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];
  
  // Mapping between Russian and English zodiac signs (both directions)
  const zodiacSignMapRuToEn = {
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
  
  const zodiacSignMapEnToRu = {
    'Aries': 'Овен',
    'Taurus': 'Телец',
    'Gemini': 'Близнецы',
    'Cancer': 'Рак',
    'Leo': 'Лев',
    'Virgo': 'Дева',
    'Libra': 'Весы',
    'Scorpio': 'Скорпион',
    'Sagittarius': 'Стрелец',
    'Capricorn': 'Козерог',
    'Aquarius': 'Водолей',
    'Pisces': 'Рыбы'
  };

  const themeOptions = [
    { value: 'general', label: 'General' },
    { value: 'career', label: 'Career & Finance' },
    { value: 'love', label: 'Love & Relationships' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'custom', label: 'Custom Topic...' }
  ];
  
  // Current selected signs based on language
  const selectedSigns = language === 'ru' ? selectedSignsRu : selectedSignsEn;
  
  // Save preferences to localStorage whenever they change
  const savePreferences = (key, value) => {
    try {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };
  
  // Save preferences whenever they change
  useEffect(() => {
    savePreferences('horoscopeTheme', theme);
  }, [theme]);
  
  useEffect(() => {
    savePreferences('horoscopeSignsRu', selectedSignsRu);
  }, [selectedSignsRu]);
  
  useEffect(() => {
    savePreferences('horoscopeSignsEn', selectedSignsEn);
  }, [selectedSignsEn]);
  
  useEffect(() => {
    savePreferences('horoscopeLanguage', language);
  }, [language]);
  
  useEffect(() => {
    savePreferences('horoscopeCustomTopic', customTopic);
  }, [customTopic]);

  // Toggle sign selection and maintain sync between languages
  const toggleSign = (sign) => {
    if (language === 'ru') {
      setSelectedSignsRu(prev => {
        const newSelection = prev.includes(sign) ? 
          prev.filter(s => s !== sign) : 
          [...prev, sign];
          
        // Keep English selection in sync
        const syncedEnSigns = newSelection.map(ruSign => zodiacSignMapRuToEn[ruSign]);
        setSelectedSignsEn(syncedEnSigns);
        
        return newSelection;
      });
    } else {
      setSelectedSignsEn(prev => {
        const newSelection = prev.includes(sign) ? 
          prev.filter(s => s !== sign) : 
          [...prev, sign];
          
        // Keep Russian selection in sync
        const syncedRuSigns = newSelection.map(enSign => zodiacSignMapEnToRu[enSign]);
        setSelectedSignsRu(syncedRuSigns);
        
        return newSelection;
      });
    }
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
        // Convert to English for API regardless of current UI language
        const apiSign = language === 'ru' ? zodiacSignMapRuToEn[sign] : sign;
        
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
          onClick={() => {
            setLanguage('ru');
            savePreferences('horoscopeLanguage', 'ru');
          }}
        >
          Рус
        </LanguageButton>
        <LanguageButton 
          active={language === 'en'} 
          onClick={() => {
            setLanguage('en');
            savePreferences('horoscopeLanguage', 'en');
          }}
        >
          Eng
        </LanguageButton>
      </LanguageToggle>
        
      <Header>
        <Title>✨ {language === 'ru' ? 'Космические Прозрения' : 'Cosmic Insights'} ✨</Title>
        <Subtitle>
          {language === 'ru' 
            ? 'Гороскоп на сегодня' 
            : 'Today\'s horoscope'}
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
              // Save selection to localStorage
              savePreferences('horoscopeTheme', selectedTheme);
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
              onChange={(e) => {
                setCustomTopic(e.target.value);
                savePreferences('horoscopeCustomTopic', e.target.value);
              }}
            />
          )}
        </FormRow>
        
        <FormRow>
          <Label>
            {language === 'ru' ? 'Выберите знаки зодиака:' : 'Select Zodiac Signs:'}
          </Label>
          <CheckboxContainer>
            {(language === 'ru' ? zodiacSignsRu : zodiacSignsEn).map((zodiacSign, index) => (
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
        
        <ButtonRow>
          <Button type="submit">
            {language === 'ru' ? 'Создать Гороскопы' : 'Generate Horoscopes'}
          </Button>
          <IconButton 
            type="button"
            disabled={horoscopes.length === 0}
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              
              // Format all horoscopes into a single text
              const horoscopesText = horoscopes
                .map(h => `${h.sign ? (language === 'ru' ? `ПРОГНОЗ ДЛЯ ${h.sign.toUpperCase()}` : `FORECAST FOR ${h.sign.toUpperCase()}`) : ''}
${h.text}
`)
                .join('\n---\n\n');
              
              // Copy to clipboard
              navigator.clipboard.writeText(horoscopesText)
                .then(() => {
                  setCopySuccess(true);
                  // Hide success message after 3 seconds
                  setTimeout(() => setCopySuccess(false), 3000);
                })
                .catch(err => {
                  console.error('Failed to copy text: ', err);
                  alert(language === 'ru' 
                    ? 'Не удалось скопировать текст. Попробуйте еще раз.' 
                    : 'Failed to copy text. Please try again.');
                });
            }}
            title={language === 'ru' ? 'Скопировать все гороскопы' : 'Copy all horoscopes'}
          >
            <CopyIcon />
          </IconButton>
        </ButtonRow>
      </Form>
      
      <CopySuccess visible={copySuccess}>
        {language === 'ru' ? '✓ Скопировано в буфер обмена' : '✓ Copied to clipboard'}
      </CopySuccess>
      
      {loading ? (
        <Loading>
          ✨ {language === 'ru' ? 'Консультируемся со звездами...' : 'Consulting the stars...'} ✨
        </Loading>
      ) : horoscopes.length > 0 && (
        <div>
          {/* Horoscope cards */}
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