@echo off
chcp 65001 >nul
title HUAZHI AI - 可视化大屏启动器

echo.
echo  ========================================
echo    HUAZHI AI 工业智能可视化大屏
echo    一键启动脚本
echo  ========================================
echo.

REM ---- 检测 Node.js 是否已安装 ----
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [错误] 未检测到 Node.js 运行环境。
    echo.
    echo  请先安装 Node.js ^(建议 v18 或更高 LTS 版本^)：
    echo  下载地址: https://nodejs.org/zh-cn
    echo.
    echo  安装完成后，请重新运行本脚本。
    echo.
    pause
    exit /b 1
)

REM ---- 显示 Node.js 版本 ----
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  [信息] 检测到 Node.js %NODE_VER%

REM ---- 进入项目目录（脚本所在目录）----
cd /d "%~dp0"

REM ---- 检测依赖是否已安装 ----
if not exist "node_modules\" (
    echo  [信息] 首次运行，正在安装项目依赖...
    echo  [信息] 这可能需要几分钟，请耐心等待。
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo  [错误] 依赖安装失败，请检查网络连接后重试。
        echo.
        pause
        exit /b 1
    )
    echo.
    echo  [成功] 依赖安装完成。
    echo.
) else (
    echo  [信息] 项目依赖已就绪。
)

echo  [信息] 正在启动开发服务器...
echo  [信息] 启动后将自动打开浏览器。
echo.
echo  ----------------------------------------
echo    访问地址: http://localhost:5173
echo    按 Ctrl+C 可停止服务器
echo  ----------------------------------------
echo.
echo  [提示] 数据管理命令:
echo    npm run export-data  导出数据到 Excel
echo    npm run import-data  从 Excel 导入数据
echo.

REM ---- 延迟 2 秒后打开浏览器 ----
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

REM ---- 启动 Vite 开发服务器 ----
call npm run dev

echo.
echo  [信息] 服务器已停止。
pause
