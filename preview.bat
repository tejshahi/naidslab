@echo off
REM ------------------------------------------------------------
REM  HIDI Lab website - local preview
REM  Double-click this file to test the site before pushing.
REM  Close this window (or press Ctrl+C) to stop the preview.
REM ------------------------------------------------------------
cd /d "%~dp0"
set PORT=8000

where python >nul 2>nul
if %errorlevel%==0 (
  set PY=python
  goto run
)
where py >nul 2>nul
if %errorlevel%==0 (
  set PY=py
  goto run
)

echo.
echo  Python was not found on this computer.
echo  Install it free from https://www.python.org/downloads/
echo  (tick "Add python.exe to PATH" during installation), then run this file again.
echo.
pause
exit /b

:run
echo.
echo  HIDI Lab preview running at:  http://localhost:%PORT%
echo  Your browser will open in a moment.
echo  Leave this window open while testing. Close it to stop.
echo.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:%PORT%"
%PY% -m http.server %PORT%