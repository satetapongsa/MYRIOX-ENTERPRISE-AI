import os
import sys

# Get the absolute path to the project root (one level up from this file)
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Now we can import the app from the backend package
from backend.app.main import app
