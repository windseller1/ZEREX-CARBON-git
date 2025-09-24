@echo off
REM =============================================================================
REM ZEREX CARBON - Complete GitHub & Vercel Deployment Script (Windows Batch)
REM Compatible with Windows Command Prompt and PowerShell
REM =============================================================================

setlocal enabledelayedexpansion

REM Configuration
set GITHUB_REPO_URL=https://github.com/windseller1/ZEREX-CARBON-git.git
set COMMIT_MESSAGE=Initial upload to GitHub and Vercel
set BRANCH=main
set PROJECT_NAME=ZEREX-CARBON

echo.
echo ==============================================================================
echo ZEREX CARBON - GitHub ^& Vercel Deployment Script
echo ==============================================================================
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git first.
    pause
    exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites are installed.
echo.

REM Step 1: Initialize Git repository
echo ==============================================================================
echo Step 1: Initializing Git Repository
echo ==============================================================================

git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Initializing Git repository...
    git init
    echo [SUCCESS] Git repository initialized.
) else (
    echo [SUCCESS] Git repository already initialized.
)

REM Step 2: Configure Git user
echo [INFO] Configuring Git user...
git config user.name "ZEREX CARBON Developer" 2>nul
git config user.email "developer@zerex-carbon.com" 2>nul
echo [SUCCESS] Git user configured.
echo.

REM Step 3: Add remote repository
echo ==============================================================================
echo Step 2: Configuring Remote Repository
echo ==============================================================================

git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Adding remote repository...
    git remote add origin %GITHUB_REPO_URL%
    echo [SUCCESS] Remote repository added: %GITHUB_REPO_URL%
) else (
    echo [INFO] Updating remote repository...
    git remote set-url origin %GITHUB_REPO_URL%
    echo [SUCCESS] Remote repository configured: %GITHUB_REPO_URL%
)
echo.

REM Step 4: Check for existing commits
echo ==============================================================================
echo Step 3: Checking Repository Status
echo ==============================================================================

git log --oneline >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Repository already has commits.
    echo [INFO] Current commits:
    git log --oneline -5
    echo.
    set /p CONTINUE="Do you want to continue? This will add new commits. (y/N): "
    if /i not "!CONTINUE!"=="y" (
        echo [ERROR] Deployment cancelled by user.
        pause
        exit /b 1
    )
)
echo.

REM Step 5: Add all files
echo ==============================================================================
echo Step 4: Adding Files to Git
echo ==============================================================================

echo [INFO] Adding all files to Git...
git add .
echo [SUCCESS] Files added to staging area.
echo.

REM Step 6: Commit changes
echo ==============================================================================
echo Step 5: Committing Changes
echo ==============================================================================

echo [INFO] Committing changes with message: '%COMMIT_MESSAGE%'
git commit -m "%COMMIT_MESSAGE%" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Changes committed successfully.
) else (
    echo [WARNING] No changes to commit or commit failed.
)
echo.

REM Step 7: Push to GitHub
echo ==============================================================================
echo Step 6: Pushing to GitHub
echo ==============================================================================

echo [INFO] Pushing to GitHub repository...
git push -u origin %BRANCH%
if %errorlevel% neq 0 (
    echo [ERROR] Failed to push to GitHub. Please check your credentials and repository access.
    pause
    exit /b 1
)
echo [SUCCESS] Successfully pushed to GitHub!
echo.

REM Step 8: Detect project type
echo ==============================================================================
echo Step 7: Detecting Project Type
echo ==============================================================================

if exist "package.json" (
    if exist "apps\web" (
        set PROJECT_TYPE=nextjs
    ) else if exist "src\app" (
        set PROJECT_TYPE=nextjs
    ) else if exist "next.config.js" (
        set PROJECT_TYPE=nextjs
    ) else if exist "apps\api" (
        set PROJECT_TYPE=nodejs
    ) else if exist "server.js" (
        set PROJECT_TYPE=nodejs
    ) else if exist "app.js" (
        set PROJECT_TYPE=nodejs
    ) else if exist "vercel.json" (
        set PROJECT_TYPE=vercel
    ) else (
        set PROJECT_TYPE=nodejs
    )
) else if exist "requirements.txt" (
    set PROJECT_TYPE=python
) else if exist "Cargo.toml" (
    set PROJECT_TYPE=rust
) else (
    set PROJECT_TYPE=static
)

echo [SUCCESS] Detected project type: !PROJECT_TYPE!
echo.

REM Step 9: Prepare Vercel deployment
echo ==============================================================================
echo Step 8: Preparing Vercel Deployment
echo ==============================================================================

echo [INFO] Preparing Vercel deployment for !PROJECT_TYPE! project...

if not exist "vercel.json" (
    echo [INFO] Creating vercel.json for !PROJECT_TYPE! project...
    
    if "!PROJECT_TYPE!"=="nextjs" (
        (
        echo {
        echo   "version": 2,
        echo   "builds": [
        echo     {
        echo       "src": "apps/web/package.json",
        echo       "use": "@vercel/next",
        echo       "config": {
        echo         "distDir": ".next"
        echo       }
        echo     },
        echo     {
        echo       "src": "apps/api/src/server.ts",
        echo       "use": "@vercel/node",
        echo       "config": {
        echo         "includeFiles": ["apps/api/dist/**"]
        echo       }
        echo     }
        echo   ],
        echo   "routes": [
        echo     {
        echo       "src": "/api/(.*)",
        echo       "dest": "/apps/api/src/server.ts"
        echo     },
        echo     {
        echo       "src": "/(.*)",
        echo       "dest": "/apps/web/$1"
        echo     }
        echo   ]
        echo }
        ) > vercel.json
    ) else if "!PROJECT_TYPE!"=="nodejs" (
        (
        echo {
        echo   "version": 2,
        echo   "builds": [
        echo     {
        echo       "src": "*.js",
        echo       "use": "@vercel/node"
        echo     }
        echo   ],
        echo   "routes": [
        echo     {
        echo       "src": "/(.*)",
        echo       "dest": "/$1"
        echo     }
        echo   ]
        echo }
        ) > vercel.json
    ) else if "!PROJECT_TYPE!"=="static" (
        (
        echo {
        echo   "version": 2,
        echo   "builds": [
        echo     {
        echo       "src": "**/*",
        echo       "use": "@vercel/static"
        echo     }
        echo   ]
        echo }
        ) > vercel.json
    )
    echo [SUCCESS] vercel.json created.
) else (
    echo [SUCCESS] vercel.json already exists.
)
echo.

REM Step 10: Check Vercel CLI
echo ==============================================================================
echo Step 9: Checking Vercel CLI
echo ==============================================================================

where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Vercel CLI. Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
    echo [SUCCESS] Vercel CLI installed successfully.
) else (
    echo [SUCCESS] Vercel CLI is already installed.
)
echo.

REM Step 11: Deploy to Vercel
echo ==============================================================================
echo Step 10: Deploying to Vercel
echo ==============================================================================

echo [INFO] Deploying to Vercel...
echo [WARNING] Make sure you are logged in to Vercel CLI (run 'vercel login' if needed)
echo.

vercel --prod --yes
if %errorlevel% neq 0 (
    echo [ERROR] Vercel deployment failed. Please check the error above.
    echo [INFO] You can try running 'vercel login' first, then run this script again.
    pause
    exit /b 1
)

echo [SUCCESS] Vercel deployment completed successfully!
echo.

REM Step 12: Final summary
echo ==============================================================================
echo Deployment Complete!
echo ==============================================================================

echo [SUCCESS] 🎉 Deployment completed successfully!
echo.
echo 📁 GitHub Repository: %GITHUB_REPO_URL%
echo 🌐 Vercel Deployment: Check the output above for your Vercel URL
echo.
echo Next Steps:
echo 1. Visit your Vercel dashboard to configure environment variables
echo 2. Set up your database and other services
echo 3. Configure GitHub Secrets for CI/CD
echo 4. Test your deployment
echo.
echo Thank you for using ZEREX CARBON! 🚀
echo.

pause
