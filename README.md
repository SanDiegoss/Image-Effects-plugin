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
      
      effects-build/                скрипты для сборки

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
      ./emsdk install latest (emsdk install latest в Windows)

      # Делаем последнюю версию emsk активной
      ./emsdk activate latest  (emsdk activate latest в Windows)

      # Настраиваем переменные среды окружения
      source ./emsdk_env.sh (emsdk_env.bat в Windows)

СБОРКА
------
Для сборки воспользуемся emcc:
      
      # использование:
      emcc [options] file..
      
Для данного репозитория используем следующую команду:

      emcc image.cpp effect.cpp exported_functions.cpp main.cpp -o ../deploy/effects.js -sMODULARIZE -sEXPORTED_FUNCTIONS='_malloc','_free','_main','_print','_add_brightness'

ЗАПУСК
------
Для запуска и теста плагина нам потребуется веб-сервер, например локальный http.server в python3:

      python3 -m http.server 8080
      
После запуска в браузере переходим на http://localhost:8080/. Готово!

