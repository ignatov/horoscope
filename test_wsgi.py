#\!/usr/bin/env python3

# Простой файл для тестирования WSGI локально
from flask_app import app as application

if __name__ == '__main__':
    # Запускаем стандартный сервер Flask для проверки
    application.run(debug=True, host='0.0.0.0', port=5000)
