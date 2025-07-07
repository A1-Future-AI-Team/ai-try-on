@echo off
echo Creating and pushing to diya branch...

REM Add the backend files we modified
git add backend/config.py
git add backend/database.py
git add backend/main.py
git add backend/requirements.txt
git add backend/ml_models.py
git add backend/simple_main.py
git add backend/start_server.py
git add backend/start_backend.bat
git add backend/SETUP.md

REM Create and switch to diya branch
git checkout -b diya

REM Commit the changes
git commit -m "Fix backend issues and add startup scripts"

REM Add the remote if not already added
git remote add origin https://github.com/A1-Future-AI-Team/ai-try-on.git 2>nul

REM Push to the diya branch
git push -u origin diya

echo Done! Changes pushed to diya branch.
pause 