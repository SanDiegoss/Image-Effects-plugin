effects plugin
==============
Плагин для применения различных эффектов к изображению.

СТРУКТУРА
------------

      effects-core/                 код плагина
          effects-core/cpp          C++ код
          effects-core/js           JavaScript код
          effects-core/test         все необходимое для теста
          effects-core/deploy       файлы сборки
      
      effects-build/       скрипты для сборки

УСТАНОВКА
---------
Для компиляции C++ кода в WebAssembly используется компилятор [emscripten](https://emscripten.org/index.html).

      # скачиваем emsdk:
      git clone https://github.com/emscripten-core/emsdk.git

      # переходим в директорию:
      cd emsdk
      
      # Получаем последнюю версию emsdk (не нужно, если клонировали только что)
      git pull

      # Скачиваем и устанавливаем инструменты emsdk.
      ./emsdk install latest (emsdk в Windows)

      # Делаем последнюю версию emsk активной для текущего пользователя
      ./emsdk activate latest (emsdk в Windows)

      # Настраиваем переменные среды окружения
      source ./emsdk_env.sh (emsdk_env.bat в Windows)

НАЧАЛО
------
