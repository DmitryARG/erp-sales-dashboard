FROM node:16

# Создание директории для приложения
WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование конфигурационных файлов
COPY cube.js .

# Создание директории для схем
RUN mkdir -p schema
COPY schema/ schema/

# Запуск Cube.js сервера
CMD ["npm", "run", "dev"]