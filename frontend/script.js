// Переменные для хранения состояния
let language = 'ru'; // По умолчанию русский язык
let selectedSigns = []; // Выбранные знаки зодиака
let horoscopes = []; // Полученные гороскопы

// Массивы знаков зодиака
const zodiacSignsEn = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const zodiacSignsRu = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
];

// Словарь переводов
const translations = {
    'ru': {
        'title': 'Космические Прозрения',
        'subtitle': 'Гороскоп на сегодня',
        'theme_label': 'Выберите тему:',
        'signs_label': 'Выберите знаки зодиака:',
        'generate_button': 'Создать Гороскопы',
        'copy_button_title': 'Скопировать все гороскопы',
        'loading_text': '✨ Консультируемся со звездами... ✨',
        'copy_success': 'Скопировано в буфер обмена',
        'theme_options': {
            'general': 'Общий',
            'career': 'Карьера и финансы',
            'love': 'Любовь и отношения',
            'health': 'Здоровье и самочувствие',
            'custom': 'Своя тема...'
        },
        'custom_topic_placeholder': 'Введите свою тему (например, Путешествия, Образование, Творчество)'
    },
    'en': {
        'title': 'Cosmic Insights',
        'subtitle': 'Today\'s horoscope',
        'theme_label': 'Select a Theme:',
        'signs_label': 'Select Zodiac Signs:',
        'generate_button': 'Generate Horoscopes',
        'copy_button_title': 'Copy all horoscopes',
        'loading_text': '✨ Consulting the stars... ✨',
        'copy_success': 'Copied to clipboard',
        'theme_options': {
            'general': 'General',
            'career': 'Career & Finance',
            'love': 'Love & Relationships',
            'health': 'Health & Wellness',
            'custom': 'Custom Topic...'
        },
        'custom_topic_placeholder': 'Enter your custom topic (e.g., Travel, Education, Creativity)'
    }
};

// Русско-английский словарь для API
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

// Англо-русский словарь
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

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация языка из localStorage, если есть
    if (localStorage.getItem('horoscopeLanguage')) {
        language = localStorage.getItem('horoscopeLanguage');
    }
    
    // Загрузка сохраненных знаков зодиака
    loadSavedSigns();
    
    // Заполнение знаков зодиака
    populateZodiacSigns();
    
    // Установка обработчиков событий
    setupEventListeners();
    
    // Инициализировать интерфейс с текущим языком
    updateLanguage(language);
    
    // Показать/скрыть поле для пользовательской темы
    const themeSelect = document.getElementById('theme');
    const customTopic = document.getElementById('customTopic');
    
    // Загрузка сохраненной темы
    if (localStorage.getItem('horoscopeTheme')) {
        themeSelect.value = localStorage.getItem('horoscopeTheme');
        if (themeSelect.value === 'custom') {
            customTopic.style.display = 'block';
            if (localStorage.getItem('horoscopeCustomTopic')) {
                customTopic.value = localStorage.getItem('horoscopeCustomTopic');
            }
        }
    }
    
    // Обновление кнопки копирования
    updateCopyButton();
});

// Функция для заполнения знаков зодиака
function populateZodiacSigns() {
    const container = document.querySelector('.zodiac-container');
    container.innerHTML = '';
    
    const signs = language === 'ru' ? zodiacSignsRu : zodiacSignsEn;
    
    signs.forEach(sign => {
        // Создаем простую кнопку вместо label+checkbox
        const button = document.createElement('button');
        button.type = 'button'; // Чтобы не отправлял форму
        button.className = 'zodiac-button';
        button.textContent = sign;
        
        // Если знак уже выбран, добавляем класс selected
        if (selectedSigns.includes(sign)) {
            button.classList.add('selected');
        }
        
        // Добавляем простой обработчик нажатия
        button.addEventListener('click', () => {
            // Переключаем состояние выбора
            if (selectedSigns.includes(sign)) {
                // Удаляем из выбранных
                selectedSigns = selectedSigns.filter(s => s !== sign);
                button.classList.remove('selected');
            } else {
                // Добавляем в выбранные
                selectedSigns.push(sign);
                button.classList.add('selected');
            }
            
            // Синхронизация выбора между языками
            syncSelectedSigns();
            // Сохранение выбранных знаков
            saveSelectedSigns();
            // Обновление кнопки копирования
            updateCopyButton();
        });
        
        container.appendChild(button);
    });
}

// Функция для переключения выбора знака зодиака (оставлена для обратной совместимости)
function toggleZodiacSign(sign, label) {
    const checkbox = label.querySelector('.zodiac-checkbox');
    if (checkbox) {
        // Инвертируем состояние чекбокса программно
        checkbox.checked = !checkbox.checked;
        // Вызываем событие change, чтобы использовать новую логику
        checkbox.dispatchEvent(new Event('change'));
    } else {
        // Старая реализация как запасной вариант
        if (selectedSigns.includes(sign)) {
            selectedSigns = selectedSigns.filter(s => s !== sign);
            label.classList.remove('selected');
        } else {
            selectedSigns.push(sign);
            label.classList.add('selected');
        }
        
        // Синхронизация выбора между языками
        syncSelectedSigns();
        
        // Сохранение выбранных знаков
        saveSelectedSigns();
        
        // Обновление кнопки копирования
        updateCopyButton();
    }
}

// Функция для синхронизации выбора между языками
function syncSelectedSigns() {
    if (language === 'ru') {
        const selectedSignsEn = selectedSigns.map(sign => zodiacSignMapRuToEn[sign] || sign);
        localStorage.setItem('horoscopeSignsEn', JSON.stringify(selectedSignsEn));
    } else {
        const selectedSignsRu = selectedSigns.map(sign => zodiacSignMapEnToRu[sign] || sign);
        localStorage.setItem('horoscopeSignsRu', JSON.stringify(selectedSignsRu));
    }
}

// Функция для сохранения выбранных знаков
function saveSelectedSigns() {
    if (language === 'ru') {
        localStorage.setItem('horoscopeSignsRu', JSON.stringify(selectedSigns));
    } else {
        localStorage.setItem('horoscopeSignsEn', JSON.stringify(selectedSigns));
    }
}

// Функция для загрузки сохраненных знаков
function loadSavedSigns() {
    try {
        if (language === 'ru' && localStorage.getItem('horoscopeSignsRu')) {
            selectedSigns = JSON.parse(localStorage.getItem('horoscopeSignsRu'));
        } else if (language === 'en' && localStorage.getItem('horoscopeSignsEn')) {
            selectedSigns = JSON.parse(localStorage.getItem('horoscopeSignsEn'));
        }
    } catch (e) {
        console.error('Error loading saved signs:', e);
        selectedSigns = [];
    }
}

// Функция для обновления языка интерфейса
function updateLanguage(newLanguage) {
    language = newLanguage;
    localStorage.setItem('horoscopeLanguage', language);
    
    // Обновление активной кнопки языка
    document.querySelectorAll('.language-button').forEach(button => {
        if (button.dataset.lang === language) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Обновление текстов
    document.querySelector('.title-text').textContent = translations[language].title;
    document.querySelector('.subtitle-text').textContent = translations[language].subtitle;
    document.querySelector('.theme-label').textContent = translations[language].theme_label;
    document.querySelector('.signs-label').textContent = translations[language].signs_label;
    document.querySelector('.generate-button').textContent = translations[language].generate_button;
    document.querySelector('.copy-button').title = translations[language].copy_button_title;
    document.querySelector('.loading-text').textContent = translations[language].loading_text;
    
    // Обновление опций в выпадающем списке тем
    const themeSelect = document.getElementById('theme');
    const currentValue = themeSelect.value;
    themeSelect.innerHTML = '';
    
    Object.entries(translations[language].theme_options).forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        themeSelect.appendChild(option);
    });
    
    themeSelect.value = currentValue;
    
    // Обновление placeholder для пользовательской темы
    document.getElementById('customTopic').placeholder = translations[language].custom_topic_placeholder;
    
    // Загрузка сохраненных знаков для текущего языка
    loadSavedSigns();
    
    // Обновление знаков зодиака
    populateZodiacSigns();
}

// Функция для настройки обработчиков событий
function setupEventListeners() {
    // Обработчик для переключения языка
    document.querySelectorAll('.language-button').forEach(button => {
        button.addEventListener('click', () => {
            updateLanguage(button.dataset.lang);
        });
    });
    
    // Обработчик для изменения темы
    const themeSelect = document.getElementById('theme');
    const customTopic = document.getElementById('customTopic');
    
    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        localStorage.setItem('horoscopeTheme', selectedTheme);
        
        if (selectedTheme === 'custom') {
            customTopic.style.display = 'block';
        } else {
            customTopic.style.display = 'none';
        }
    });
    
    // Обработчик для изменения пользовательской темы
    customTopic.addEventListener('input', () => {
        localStorage.setItem('horoscopeCustomTopic', customTopic.value);
    });
    
    // Обработчик для отправки формы
    document.querySelector('.horoscope-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetchHoroscopes();
    });
    
    // Обработчик для кнопки копирования
    document.querySelector('.copy-button').addEventListener('click', copyHoroscopes);
}

// Функция для получения гороскопов
async function fetchHoroscopes() {
    const themeSelect = document.getElementById('theme');
    const customTopic = document.getElementById('customTopic');
    const theme = themeSelect.value;
    const results = document.querySelector('.horoscope-results');
    const loading = document.querySelector('.loading');
    const copyButton = document.querySelector('.copy-button');
    
    // Проверка на выбранную тему
    if (theme === 'custom' && !customTopic.value.trim()) {
        results.innerHTML = `<div class="horoscope-card">
            <p class="horoscope-text">${language === 'ru' ? 'Пожалуйста, введите тему перед созданием гороскопа.' : 'Please enter a custom topic before generating your horoscope.'}</p>
        </div>`;
        return;
    }
    
    // Если знаки не выбраны, запросим общий гороскоп
    const originalSigns = [...selectedSigns];
    if (selectedSigns.length === 0) {
        // Создаем временный "Общий" для запроса
        selectedSigns = [""];
    }
    
    // Показать индикатор загрузки
    results.innerHTML = '';
    loading.style.display = 'block';
    copyButton.disabled = true;
    
    try {
        horoscopes = [];
        
        // Получение гороскопа для каждого выбранного знака
        for (const sign of selectedSigns) {
            // Если знак пустой - это общий гороскоп
            const isGeneralHoroscope = sign === "";
            
            // Конвертация русского знака зодиака в английский для API
            const apiSign = isGeneralHoroscope ? "" : (language === 'ru' ? zodiacSignMapRuToEn[sign] : sign);
            
            // Формирование URL с параметрами
            let url = `http://localhost:5001/api/horoscope?theme=${theme}&sign=${apiSign}&language=${language}`;
            
            // Добавление пользовательской темы, если выбрана
            if (theme === 'custom') {
                url += `&customTopic=${encodeURIComponent(customTopic.value)}`;
            }
            
            // Отправка запроса
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
            // Если это общий гороскоп, используем "Общий" как заголовок
            horoscopes.push({
                sign: isGeneralHoroscope ? (language === 'ru' ? 'Общий' : 'General') : sign,
                text: data.horoscope
            });
        }
        
        // Отображение результатов
        displayHoroscopes();
        
        // Восстанавливаем исходный список знаков после запроса
        selectedSigns = originalSigns;
    } catch (error) {
        console.error('Error fetching horoscopes:', error);
        results.innerHTML = `<div class="horoscope-card">
            <p class="horoscope-text">${language === 'ru' ? 'Не удалось создать гороскоп. Пожалуйста, попробуйте позже.' : 'Unable to generate horoscope at this time. Please try again later.'}</p>
        </div>`;
    } finally {
        // Скрыть индикатор загрузки
        loading.style.display = 'none';
        
        // Обновить кнопку копирования
        updateCopyButton();
    }
}

// Функция для отображения гороскопов
function displayHoroscopes() {
    const results = document.querySelector('.horoscope-results');
    results.innerHTML = '';
    
    horoscopes.forEach((horoscope, index) => {
        if (index > 0) {
            const separator = document.createElement('hr');
            separator.className = 'horoscope-separator';
            results.appendChild(separator);
        }
        
        const card = document.createElement('div');
        card.className = 'horoscope-card';
        
        const text = document.createElement('p');
        text.className = 'horoscope-text';
        text.textContent = horoscope.text;
        
        card.appendChild(text);
        results.appendChild(card);
    });
}

// Функция для копирования гороскопов
function copyHoroscopes() {
    if (horoscopes.length === 0) return;
    
    const copyText = horoscopes.map(h => h.text).join('\n\n---\n\n');
    // Удаляем возможные дополнительные пустые строки
    const cleanText = copyText.replace(/\n{3,}/g, '\n\n');
    
    navigator.clipboard.writeText(cleanText)
        .then(() => {
            // Визуальная обратная связь - изменение цвета иконки
            const paths = document.querySelectorAll('.copy-button path');
            const originalStroke = paths[0].getAttribute('stroke');
            
            paths.forEach(path => {
                path.setAttribute('stroke', '#66FF99'); // Зеленый цвет для индикации успеха
            });
            
            // Возврат к исходному цвету через 1.5 секунды
            setTimeout(() => {
                paths.forEach(path => {
                    path.setAttribute('stroke', originalStroke);
                });
            }, 1500);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert(language === 'ru' 
                ? 'Не удалось скопировать текст. Попробуйте еще раз.' 
                : 'Failed to copy text. Please try again.');
        });
}

// Функция для обновления кнопки копирования
function updateCopyButton() {
    const copyButton = document.querySelector('.copy-button');
    copyButton.disabled = horoscopes.length === 0;
}