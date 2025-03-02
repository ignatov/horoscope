"""
Main Flask application entry point for PythonAnywhere deployment.
This file imports the Flask app from the backend and makes it available for WSGI.
"""

import os
import sys
import pathlib

# Получаем абсолютный путь к корневой директории проекта
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT_DIR)

# Add backend directory to path
backend_dir = os.path.join(ROOT_DIR, 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Устанавливаем переменную окружения для Flask
os.environ['FLASK_APP_ROOT_DIR'] = ROOT_DIR

# Import the Flask app from backend
from backend.app import app

# Дополнительные настройки для обслуживания статических файлов
@app.route('/')
def serve_root():
    """Явно обслуживаем корневой URL"""
    frontend_dir = os.path.join(ROOT_DIR, 'frontend')
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)