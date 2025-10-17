FROM node:16

# Установка зависимостей для Cube.js
RUN npm install -g @cubejs-backend/server

# Создание директории для приложения
WORKDIR /app

# Копирование конфигурационных файлов
COPY cube.js .

# Создание директории для схем
RUN mkdir -p schema
COPY schema/ schema/

# Запуск Cube.js сервера
CMD ["npx", "@cubejs-backend/server"]