# ERP Sales Dashboard

ERP Sales Dashboard - это веб-приложение для визуализации и анализа данных о продажах из различных источников. Приложение объединяет данные из нескольких баз данных и предоставляет интерактивную панель управления с графиками и таблицами.

## Структура проекта

```
.
├── .github/                    # Конфигурации GitHub Actions
│   └── workflows/
│       └── deploy.yml          # Workflow для автоматического деплоя
├── db-init-scripts/           # Скрипты инициализации базы данных
│   └── init.sql               # SQL-скрипт для создания структуры БД
├── frontend/                  # Фронтенд приложения
│   ├── index.html             # Главная HTML-страница
│   ├── style.css              # Стили для фронтенда
│   └── app.js                 # JavaScript-логика фронтенда
├── schema/                    # Cube.js схемы
│   └── Sales.js               # Схема для данных о продажах
├── cube.js                    # Конфигурационный файл Cube.js
├── Dockerfile                 # Docker-файл для Cube.js сервиса
├── docker-compose.yml         # Docker Compose конфигурация для всех сервисов
└── README.md                  # Документация проекта (этот файл)
```

## Технологии

- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Backend**: Cube.js
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## Локальный запуск

Для запуска приложения локально необходимо:

1. Установить Docker и Docker Compose
2. Клонировать репозиторий:
   ```bash
   git clone https://github.com/DmitryARG/erp-sales-dashboard.git
   cd erp-sales-dashboard
   ```
3. Запустить приложение с помощью Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
4. Приложение будет доступно по адресу:
   - Frontend: http://localhost:8080
   - Cube.js API: http://localhost:4000

## Деплой на VPS

Для автоматического деплоя при пуше в ветку `main` используется GitHub Actions. Настройка:

1. Добавить SSH-ключ в GitHub Secrets с именем `SSH_PRIVATE_KEY`
2. Убедиться, что на VPS установлены Docker и Docker Compose
3. При пуше в ветку `main` GitHub Actions выполнит:
   - Подключение к VPS по SSH
   - Обновление репозитория
   - Остановку старой версии приложения
   - Сборку и запуск новой версии

## Конфигурация

Приложение использует следующие переменные окружения (установлены в docker-compose.yml):

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` - для подключения к PostgreSQL
- `CUBEJS_DB_TYPE`, `CUBEJS_DB_HOST`, `CUBEJS_DB_PORT`, `CUBEJS_DB_USER`, `CUBEJS_DB_PASS`, `CUBEJS_DB_NAME` - для подключения Cube.js к БД
- `CUBEJS_API_SECRET` - секретный ключ для API Cube.js