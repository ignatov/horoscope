#!/bin/bash

# Этот скрипт запускает локальное тестирование WSGI приложения

# Устанавливаем переменные окружения, если нужно
# export ANTHROPIC_API_KEY="your_key_here"

echo "Запуск приложения через WSGI интерфейс..."

# Использование gunicorn для запуска WSGI приложения
gunicorn --bind 0.0.0.0:5000 --workers 1 --reload 'flask_app:app'

# Альтернативно можно использовать Flask напрямую:
# python test_wsgi.py