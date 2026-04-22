#!/usr/bin/python
import os
import sys
from pathlib import Path
from wsgiref.handlers import CGIHandler

BASE_DIR = Path(__file__).resolve().parent

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault("PYTHON_EGG_CACHE", str(BASE_DIR / ".python-eggs"))

from app import app

CGIHandler().run(app)
