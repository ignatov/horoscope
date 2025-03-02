"""
Main Flask application entry point for PythonAnywhere deployment.
This file imports the Flask app from the backend and makes it available for WSGI.
"""

import os
import sys
import pathlib

# Add backend directory to path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the Flask app from backend
from backend.app import app

if __name__ == '__main__':
    app.run(debug=True)