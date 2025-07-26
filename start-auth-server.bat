@echo off
echo Starting FMS Authentication Server...
echo.
echo Server will be available at: http://localhost:3001
echo.
echo Available endpoints:
echo   POST /auth/login
echo   POST /auth/register  
echo   POST /auth/verify
echo.
echo Sample accounts:
echo   Admin: admin@example.com / 123456
echo   User:  user@example.com / 123456
echo.
echo Press Ctrl+C to stop the server
echo.
node server.cjs
