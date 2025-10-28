@echo off
echo ========================================
echo   🌱 Agroecologia Planner - Vue.js
echo ========================================
echo.
echo Escolha uma opcao:
echo.
echo 1. Demo Avancado (Recomendado)
echo 2. Demo Simples
echo 3. Desenvolvimento (npm run dev)
echo.
set /p choice="Digite sua escolha (1-3): "

if "%choice%"=="1" (
    echo.
    echo Abrindo Demo Avancado...
    start demo-advanced.html
) else if "%choice%"=="2" (
    echo.
    echo Abrindo Demo Simples...
    start test-simple.html
) else if "%choice%"=="3" (
    echo.
    echo Iniciando servidor de desenvolvimento...
    echo Certifique-se de ter executado 'npm install' primeiro
    echo.
    npm run dev
) else (
    echo.
    echo Opcao invalida. Abrindo Demo Avancado...
    start demo-advanced.html
)

echo.
echo ========================================
echo   Funcionalidades Implementadas:
echo ========================================
echo ✅ Canvas interativo com desenho
echo ✅ Biblioteca de plantas, terrenos e estruturas  
echo ✅ Sistema de zoom e grid
echo ✅ Historico (desfazer/refazer)
echo ✅ Exportacao PNG e JSON
echo ✅ Interface responsiva
echo ✅ Estatisticas do projeto
echo ✅ Configuracoes avancadas
echo.
echo Para desenvolvimento completo:
echo 1. npm install
echo 2. npm run dev
echo.
pause