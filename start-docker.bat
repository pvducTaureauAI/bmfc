@echo off
echo ========================================
echo    Binh Minh FC - Docker Quick Start
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

REM Check if docker-compose is available
docker-compose version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not available!
    pause
    exit /b 1
)
echo [OK] Docker Compose is available
echo.

echo Building Docker images...
docker-compose build
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

echo Starting services...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start services!
    pause
    exit /b 1
)
echo [OK] Services started
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Application will be available at:
echo     http://localhost:3000
echo.
echo Default login credentials:
echo     Admin: admin / admin123
echo     Guest: guest / guest123
echo.
echo Useful commands:
echo     docker-compose logs -f    (view logs)
echo     docker-compose down       (stop services)
echo     docker-compose restart    (restart services)
echo.
echo Press any key to view logs...
pause >nul

docker-compose logs -f
