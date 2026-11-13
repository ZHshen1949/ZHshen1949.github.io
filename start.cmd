@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo  启动 Hexo 本地服务
echo  博客预览： http://localhost:4000/
echo  后台管理： http://localhost:4000/pro/
echo  （关闭弹出的服务窗口即停止服务）
echo ============================================
echo.

start "Hexo Server - 关闭此窗口即停止服务" cmd /k "npm.cmd run server"

echo 等待服务启动...
timeout /t 4 /nobreak >nul

start "" "http://localhost:4000/pro/"

echo 已打开浏览器。若页面空白，请等 2-3 秒后刷新。
timeout /t 3 /nobreak >nul
exit
