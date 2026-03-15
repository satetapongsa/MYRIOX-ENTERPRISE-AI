import os
import sys

# Crucial: Add the current directory (project root) to sys.path
# This ensures that 'backend', 'agents', and 'ml_engine' can be imported correctly by Vercel
root_dir = os.path.dirname(os.path.abspath(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.main import app
