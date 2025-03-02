#!/usr/bin/env python3
import sys
import os

# Добавляем путь к директории проекта в sys.path
project_home = os.path.expanduser('/Users/ignatov/src/horo')
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Добавляем путь к директории backend в sys.path
backend_dir = os.path.join(project_home, 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Активируем виртуальное окружение, если используется
activate_this = os.path.join(project_home, 'backend/venv/bin/activate_this.py')
if os.path.exists(activate_this):
    with open(activate_this) as file_:
        exec(file_.read(), dict(__file__=activate_this))

# Импортируем Flask-приложение
from backend.app import app as application

# Проверяем, что переменные окружения загружены
if __name__ == '__main__':
    application.run()