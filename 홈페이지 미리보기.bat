@echo off
chcp 65001 > nul
cd /d "%~dp0"
start "" http://localhost:8080/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1" -Port 8080
