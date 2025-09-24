# =============================================================================
# ZEREX CARBON - Complete GitHub & Vercel Deployment Script (PowerShell)
# Compatible with Windows PowerShell and PowerShell Core
# =============================================================================

param(
    [string]$GitHubRepoUrl = "https://github.com/windseller1/ZEREX-CARBON-git.git",
    [string]$CommitMessage = "Initial upload to GitHub and Vercel",
    [string]$Branch = "main",
    [string]$ProjectName = "ZEREX-CARBON"
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Magenta = "Magenta"
    Cyan = "Cyan"
    White = "White"
}

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "==============================================================================" -ForegroundColor $Colors.Magenta
    Write-Host $Message -ForegroundColor $Colors.Magenta
    Write-Host "==============================================================================" -ForegroundColor $Colors.Magenta
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if we're in a git repository
function Test-GitRepository {
    try {
        git rev-parse --git-dir | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if remote exists
function Test-GitRemote {
    try {
        git remote get-url origin | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if there are uncommitted changes
function Test-UncommittedChanges {
    try {
        $changes = git diff-index --quiet HEAD --
        return $false
    }
    catch {
        return $true
    }
}

# Function to check if there are untracked files
function Test-UntrackedFiles {
    try {
        $untracked = git ls-files --others --exclude-standard
        return $untracked.Count -gt 0
    }
    catch {
        return $false
    }
}

# Function to check if Vercel CLI is installed
function Test-VercelCLI {
    if (-not (Test-Command "vercel")) {
        Write-Warning "Vercel CLI not found. Installing..."
        try {
            npm install -g vercel
            Write-Success "Vercel CLI installed successfully."
        }
        catch {
            Write-Error "Failed to install Vercel CLI. Please install manually: npm install -g vercel"
            throw
        }
    }
}

# Function to detect project type
function Get-ProjectType {
    if (Test-Path "package.json") {
        if ((Test-Path "apps/web") -or (Test-Path "src/app") -or (Test-Path "next.config.js")) {
            return "nextjs"
        }
        elseif ((Test-Path "apps/api") -or (Test-Path "server.js") -or (Test-Path "app.js")) {
            return "nodejs"
        }
        elseif (Test-Path "vercel.json") {
            return "vercel"
        }
        else {
            return "nodejs"
        }
    }
    elseif (Test-Path "requirements.txt") {
        return "python"
    }
    elseif (Test-Path "Cargo.toml") {
        return "rust"
    }
    else {
        return "static"
    }
}

# Function to prepare Vercel deployment
function Prepare-VercelDeployment {
    param([string]$ProjectType)
    
    Write-Status "Preparing Vercel deployment for $ProjectType project..."
    
    switch ($ProjectType) {
        "nextjs" {
            if (-not (Test-Path "vercel.json")) {
                Write-Status "Creating vercel.json for Next.js project..."
                $vercelConfig = @'
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    },
    {
      "src": "apps/api/src/server.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["apps/api/dist/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/apps/api/src/server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/apps/web/$1"
    }
  ]
}
'@
                $vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
            }
        }
        "nodejs" {
            if (-not (Test-Path "vercel.json")) {
                Write-Status "Creating vercel.json for Node.js project..."
                $vercelConfig = @'
{
  "version": 2,
  "builds": [
    {
      "src": "*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
'@
                $vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
            }
        }
        "static" {
            if (-not (Test-Path "vercel.json")) {
                Write-Status "Creating vercel.json for static project..."
                $vercelConfig = @'
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ]
}
'@
                $vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
            }
        }
    }
}

# Main execution
function Main {
    Write-Header "ZEREX CARBON - GitHub & Vercel Deployment Script"
    
    # Check prerequisites
    Write-Status "Checking prerequisites..."
    
    if (-not (Test-Command "git")) {
        Write-Error "Git is not installed. Please install Git first."
        exit 1
    }
    
    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed. Please install Node.js first."
        exit 1
    }
    
    if (-not (Test-Command "npm")) {
        Write-Error "npm is not installed. Please install npm first."
        exit 1
    }
    
    Write-Success "All prerequisites are installed."
    
    # Step 1: Initialize Git repository
    Write-Header "Step 1: Initializing Git Repository"
    
    if (-not (Test-GitRepository)) {
        Write-Status "Initializing Git repository..."
        git init
        Write-Success "Git repository initialized."
    }
    else {
        Write-Success "Git repository already initialized."
    }
    
    # Step 2: Configure Git user (if not already configured)
    Write-Status "Configuring Git user..."
    try {
        $userName = git config user.name
        if (-not $userName) {
            git config user.name "ZEREX CARBON Developer"
            git config user.email "developer@zerex-carbon.com"
            Write-Success "Git user configured."
        }
        else {
            Write-Success "Git user already configured."
        }
    }
    catch {
        Write-Warning "Could not configure Git user. Please configure manually."
    }
    
    # Step 3: Add remote repository
    Write-Header "Step 2: Configuring Remote Repository"
    
    if (Test-GitRemote) {
        $currentRemote = git remote get-url origin
        if ($currentRemote -ne $GitHubRepoUrl) {
            Write-Warning "Different remote URL detected. Updating..."
            git remote set-url origin $GitHubRepoUrl
        }
        Write-Success "Remote repository configured: $GitHubRepoUrl"
    }
    else {
        Write-Status "Adding remote repository..."
        git remote add origin $GitHubRepoUrl
        Write-Success "Remote repository added: $GitHubRepoUrl"
    }
    
    # Step 4: Check for existing commits
    Write-Header "Step 3: Checking Repository Status"
    
    try {
        $commits = git log --oneline 2>$null
        if ($commits) {
            Write-Warning "Repository already has commits."
            Write-Status "Current commits:"
            git log --oneline -5
            Write-Host ""
            $response = Read-Host "Do you want to continue? This will add new commits. (y/N)"
            if ($response -notmatch "^[Yy]$") {
                Write-Error "Deployment cancelled by user."
                exit 1
            }
        }
    }
    catch {
        Write-Status "No existing commits found."
    }
    
    # Step 5: Add all files
    Write-Header "Step 4: Adding Files to Git"
    
    Write-Status "Adding all files to Git..."
    git add .
    
    if ((Test-UncommittedChanges) -or (Test-UntrackedFiles)) {
        Write-Success "Files added to staging area."
    }
    else {
        Write-Warning "No changes to commit."
    }
    
    # Step 6: Commit changes
    Write-Header "Step 5: Committing Changes"
    
    Write-Status "Committing changes with message: '$CommitMessage'"
    try {
        git commit -m $CommitMessage
        Write-Success "Changes committed successfully."
    }
    catch {
        Write-Warning "No changes to commit or commit failed."
    }
    
    # Step 7: Push to GitHub
    Write-Header "Step 6: Pushing to GitHub"
    
    Write-Status "Pushing to GitHub repository..."
    try {
        git push -u origin $Branch
        Write-Success "Successfully pushed to GitHub!"
    }
    catch {
        Write-Error "Failed to push to GitHub. Please check your credentials and repository access."
        exit 1
    }
    
    # Step 8: Detect project type
    Write-Header "Step 7: Detecting Project Type"
    
    $projectType = Get-ProjectType
    Write-Success "Detected project type: $projectType"
    
    # Step 9: Prepare Vercel deployment
    Write-Header "Step 8: Preparing Vercel Deployment"
    
    Prepare-VercelDeployment $projectType
    
    # Step 10: Check Vercel CLI
    Write-Header "Step 9: Checking Vercel CLI"
    
    Test-VercelCLI
    
    # Step 11: Deploy to Vercel
    Write-Header "Step 10: Deploying to Vercel"
    
    Write-Status "Deploying to Vercel..."
    Write-Warning "Make sure you are logged in to Vercel CLI (run 'vercel login' if needed)"
    
    try {
        $vercelOutput = vercel --prod --yes 2>&1
        Write-Success "Vercel deployment completed successfully!"
        
        # Extract Vercel URL from output
        $vercelUrl = ($vercelOutput | Select-String -Pattern 'https://[^\s]*\.vercel\.app' | Select-Object -First 1).Matches[0].Value
    }
    catch {
        Write-Error "Vercel deployment failed. Please check the error above."
        Write-Status "You can try running 'vercel login' first, then run this script again."
        exit 1
    }
    
    # Step 12: Final summary
    Write-Header "Deployment Complete!"
    
    Write-Success "Deployment completed successfully!"
    Write-Host ""
    Write-Host "GitHub Repository: $GitHubRepoUrl" -ForegroundColor $Colors.Cyan
    Write-Host "Vercel Deployment: $vercelUrl" -ForegroundColor $Colors.Cyan
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor $Colors.Green
    Write-Host "1. Visit your Vercel dashboard to configure environment variables"
    Write-Host "2. Set up your database and other services"
    Write-Host "3. Configure GitHub Secrets for CI/CD"
    Write-Host "4. Test your deployment"
    Write-Host ""
    Write-Host "Thank you for using ZEREX CARBON!" -ForegroundColor $Colors.Magenta
}

# Run main function
Main
