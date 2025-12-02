@echo off
chcp 65001 >nul
echo ========================================
echo    STAS - Support Ticket Analysis System
echo    КПІ ім. Ігоря Сікорського
echo ========================================
echo.

REM Перевірка наявності Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ПОМИЛКА: Node.js не знайдено!
    echo Завантажте та встановіть Node.js з https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js знайдено
node --version
echo.

REM Перевірка наявності node_modules
if not exist "node_modules\" (
    echo 📦 Встановлення залежностей...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Помилка встановлення залежностей
        pause
        exit /b 1
    )
    echo ✅ Залежності встановлено
    echo.
)

REM Перевірка наявності файлів
if not exist "server.js" (
    echo ❌ ПОМИЛКА: Файл server.js не знайдено!
    pause
    exit /b 1
)

if not exist "src\App.jsx" (
    echo ❌ ПОМИЛКА: Файл src\App.jsx не знайдено!
    pause
    exit /b 1
)

echo 🚀 Запуск STAS...
echo.
echo 📊 Backend API буде доступний на: http://localhost:3001
echo 🌐 Frontend буде доступний на: http://localhost:3000
echo.
echo ⚠️  Для зупинки натисніть Ctrl+C
echo.

REM Запуск backend та frontend
start /B cmd /C "node server.js"
timeout /t 3 /nobreak >nul
start /B cmd /C "npm run dev"

echo.
echo ✅ Додаток запущено!
echo Відкрийте браузер: http://localhost:3000
echo.

REM Очікування натискання клавіші
pause