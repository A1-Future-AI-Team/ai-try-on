@echo off
echo Pushing entire repository to diya branch...

REM Add all files to staging
git add .

REM Create and switch to diya branch
git checkout -b diya

REM Commit all changes
git commit -m "Complete Virtual Try-On repository with backend fixes"

REM Add the remote if not already added
git remote add origin https://github.com/A1-Future-AI-Team/ai-try-on.git 2>nul

REM Push to the diya branch
git push -u origin diya

echo Done! Entire repository pushed to diya branch.
pause 