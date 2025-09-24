#!/bin/bash

# =============================================================================
# ZEREX CARBON - Complete GitHub & Vercel Deployment Script
# Compatible with Windows (Git Bash), Linux, and macOS
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO_URL="https://github.com/windseller1/ZEREX-CARBON-git.git"
COMMIT_MESSAGE="Initial upload to GitHub and Vercel"
BRANCH="main"
PROJECT_NAME="ZEREX-CARBON"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}==============================================================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}==============================================================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WINDIR" ]]; then
        echo "windows"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "linux"
    fi
}

# Function to check if we're in a git repository
is_git_repo() {
    git rev-parse --git-dir >/dev/null 2>&1
}

# Function to check if remote exists
remote_exists() {
    git remote get-url origin >/dev/null 2>&1
}

# Function to check if there are uncommitted changes
has_uncommitted_changes() {
    ! git diff-index --quiet HEAD --
}

# Function to check if there are untracked files
has_untracked_files() {
    [ -n "$(git ls-files --others --exclude-standard)" ]
}

# Function to check if Vercel CLI is installed
check_vercel_cli() {
    if ! command_exists vercel; then
        print_warning "Vercel CLI not found. Installing..."
        if [[ "$(detect_os)" == "windows" ]]; then
            npm install -g vercel
        else
            sudo npm install -g vercel
        fi
    fi
}

# Function to detect project type
detect_project_type() {
    if [ -f "package.json" ]; then
        if [ -d "apps/web" ] || [ -d "src/app" ] || [ -f "next.config.js" ]; then
            echo "nextjs"
        elif [ -d "apps/api" ] || [ -f "server.js" ] || [ -f "app.js" ]; then
            echo "nodejs"
        elif [ -f "vercel.json" ]; then
            echo "vercel"
        else
            echo "nodejs"
        fi
    elif [ -f "requirements.txt" ]; then
        echo "python"
    elif [ -f "Cargo.toml" ]; then
        echo "rust"
    else
        echo "static"
    fi
}

# Function to prepare Vercel deployment
prepare_vercel_deployment() {
    local project_type=$1
    
    print_status "Preparing Vercel deployment for $project_type project..."
    
    case $project_type in
        "nextjs")
            if [ ! -f "vercel.json" ]; then
                print_status "Creating vercel.json for Next.js project..."
                cat > vercel.json << 'EOF'
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
EOF
            fi
            ;;
        "nodejs")
            if [ ! -f "vercel.json" ]; then
                print_status "Creating vercel.json for Node.js project..."
                cat > vercel.json << 'EOF'
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
EOF
            fi
            ;;
        "static")
            if [ ! -f "vercel.json" ]; then
                print_status "Creating vercel.json for static project..."
                cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ]
}
EOF
            fi
            ;;
    esac
}

# Main execution
main() {
    print_header "ZEREX CARBON - GitHub & Vercel Deployment Script"
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All prerequisites are installed."
    
    # Step 1: Initialize Git repository
    print_header "Step 1: Initializing Git Repository"
    
    if ! is_git_repo; then
        print_status "Initializing Git repository..."
        git init
        print_success "Git repository initialized."
    else
        print_success "Git repository already initialized."
    fi
    
    # Step 2: Configure Git user (if not already configured)
    print_status "Configuring Git user..."
    if [ -z "$(git config user.name)" ]; then
        git config user.name "ZEREX CARBON Developer"
        git config user.email "developer@zerex-carbon.com"
        print_success "Git user configured."
    else
        print_success "Git user already configured."
    fi
    
    # Step 3: Add remote repository
    print_header "Step 2: Configuring Remote Repository"
    
    if remote_exists; then
        current_remote=$(git remote get-url origin)
        if [ "$current_remote" != "$GITHUB_REPO_URL" ]; then
            print_warning "Different remote URL detected. Updating..."
            git remote set-url origin "$GITHUB_REPO_URL"
        fi
        print_success "Remote repository configured: $GITHUB_REPO_URL"
    else
        print_status "Adding remote repository..."
        git remote add origin "$GITHUB_REPO_URL"
        print_success "Remote repository added: $GITHUB_REPO_URL"
    fi
    
    # Step 4: Check for existing commits
    print_header "Step 3: Checking Repository Status"
    
    if [ -n "$(git log --oneline 2>/dev/null)" ]; then
        print_warning "Repository already has commits."
        print_status "Current commits:"
        git log --oneline -5
        echo ""
        read -p "Do you want to continue? This will add new commits. (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled by user."
            exit 1
        fi
    fi
    
    # Step 5: Add all files
    print_header "Step 4: Adding Files to Git"
    
    print_status "Adding all files to Git..."
    git add .
    
    if has_uncommitted_changes || has_untracked_files; then
        print_success "Files added to staging area."
    else
        print_warning "No changes to commit."
    fi
    
    # Step 6: Commit changes
    print_header "Step 5: Committing Changes"
    
    print_status "Committing changes with message: '$COMMIT_MESSAGE'"
    git commit -m "$COMMIT_MESSAGE" || {
        print_warning "No changes to commit or commit failed."
    }
    
    # Step 7: Push to GitHub
    print_header "Step 6: Pushing to GitHub"
    
    print_status "Pushing to GitHub repository..."
    git push -u origin "$BRANCH" || {
        print_error "Failed to push to GitHub. Please check your credentials and repository access."
        exit 1
    }
    
    print_success "Successfully pushed to GitHub!"
    
    # Step 8: Detect project type
    print_header "Step 7: Detecting Project Type"
    
    project_type=$(detect_project_type)
    print_success "Detected project type: $project_type"
    
    # Step 9: Prepare Vercel deployment
    print_header "Step 8: Preparing Vercel Deployment"
    
    prepare_vercel_deployment "$project_type"
    
    # Step 10: Check Vercel CLI
    print_header "Step 9: Checking Vercel CLI"
    
    check_vercel_cli
    
    # Step 11: Deploy to Vercel
    print_header "Step 10: Deploying to Vercel"
    
    print_status "Deploying to Vercel..."
    print_warning "Make sure you are logged in to Vercel CLI (run 'vercel login' if needed)"
    
    # Deploy to Vercel
    vercel_output=$(vercel --prod --yes 2>&1) || {
        print_error "Vercel deployment failed. Please check the error above."
        print_status "You can try running 'vercel login' first, then run this script again."
        exit 1
    }
    
    # Extract Vercel URL from output
    vercel_url=$(echo "$vercel_output" | grep -o 'https://[^[:space:]]*\.vercel\.app' | head -1)
    
    # Step 12: Final summary
    print_header "Deployment Complete!"
    
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo -e "${CYAN}📁 GitHub Repository:${NC} $GITHUB_REPO_URL"
    echo -e "${CYAN}🌐 Vercel Deployment:${NC} $vercel_url"
    echo ""
    echo -e "${GREEN}Next Steps:${NC}"
    echo "1. Visit your Vercel dashboard to configure environment variables"
    echo "2. Set up your database and other services"
    echo "3. Configure GitHub Secrets for CI/CD"
    echo "4. Test your deployment"
    echo ""
    echo -e "${PURPLE}Thank you for using ZEREX CARBON! 🚀${NC}"
}

# Run main function
main "$@"
