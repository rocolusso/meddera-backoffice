# Beauty Clinic Meddera — CRM

CRM-система для учёта и бронирования пациентов клиники **S.R.L. Beauty Clinic Meddera**.

---

## Стек

| Слой | Технология |
|------|-----------|
| Фреймворк | Next.js 16 (App Router) |
| Язык | TypeScript (strict) |
| Стили | Tailwind CSS v4 |
| БД | PostgreSQL 17 |
| ORM | Prisma |
| Контейнеры | Docker Compose |

---

## Предварительные требования

- [Node.js](https://nodejs.org/) v18+ (проект разрабатывался на v24)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) или Docker Engine
- npm v9+

---

## Переменные окружения

Скопируй `.env.example` в `.env` и заполни значения:

```bash
cp .env.example .env
```

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `POSTGRES_USER` | Пользователь PostgreSQL | `meddera` |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL | `meddera` |
| `POSTGRES_DB` | Имя базы данных | `meddera` |
| `DATABASE_URL` | Строка подключения Prisma (для локального dev) | `postgresql://user:pass@localhost:5433/meddera` |

> **Важно:** `DATABASE_URL` в `.env` использует порт **5433** (хост `5433` → контейнер `5432`).
> Порт `5432` на хосте остаётся свободным — конфликты с другими сервисами исключены.
> Сервис `app` внутри Docker использует `db:5432` через внутреннюю сеть — не меняется.

---

## 🚀 Быстрый старт (локально, без Docker для приложения)

```bash
# 1. Установить зависимости
npm install

# 2. Запустить только PostgreSQL в Docker (публикует порт 5432 на хост)
docker-compose up db -d

# 3. Применить миграции (первый раз)
npm run db:migrate
# Введи имя миграции, например: init

# 4. Засеять начальные данные (Alina Bianca)
npm run db:seed

# 5. Запустить приложение
npm run dev
```

Открыть: http://localhost:3000

---

## 🐳 Запуск через Docker Compose (оба сервиса)

> Перед первым запуском через Docker обязательно примени миграции локально (шаг 3 выше),
> чтобы таблицы существовали до старта контейнера `app`.

```bash
# Собрать образ и запустить оба сервиса
docker-compose up --build

# Запустить в фоне
docker-compose up --build -d

# Остановить
docker-compose down

# Остановить и удалить данные БД (внимание: данные потеряются!)
docker-compose down -v
```

Открыть: http://localhost:3000

---

## 🗄 Работа с базой данных

### Применить миграции (dev — создаёт новую миграцию)

```bash
npm run db:migrate
# Prisma спросит имя миграции, например: add_phone_index
```

### Применить существующие миграции (prod / CI)

```bash
npm run db:deploy
```

### Сбросить БД и пересоздать с нуля

```bash
# ВНИМАНИЕ: все данные будут удалены!
npm run db:reset
```

### Засеять начальные данные

```bash
npm run db:seed
# Импортирует Alina Bianca (idempotent — повторный запуск не создаёт дубликат)
```

### Открыть Prisma Studio (визуальный редактор БД)

```bash
npm run db:studio
# → http://localhost:5555
```

### Регенерировать Prisma Client вручную

```bash
npm run db:generate
# Обычно вызывается автоматически при migrate dev
```

---

## ➕ Добавление новой миграции (workflow)

```
1. Изменить prisma/schema.prisma
2. npm run db:migrate       → создаст SQL в prisma/migrations/
3. npm run db:generate      → регенерирует Prisma Client
4. Обновить src/lib/patients.ts, если изменились поля типа Patient
5. npm run build            → проверить TypeScript
```

---

## Структура проекта

```
blank/
  docker-compose.yaml          # Docker: db + app
  Dockerfile                   # Образ Next.js (standalone)
  .env                         # Локальные credentials (не коммитить)
  .env.example                 # Шаблон переменных
  prisma/
    schema.prisma              # Модель данных
    seed.ts                    # Импорт начальных данных
    migrations/                # SQL-миграции (создаются автоматически)
  volumes/
    db-data/                   # Данные PostgreSQL (не коммитить)
  src/
    app/                       # Next.js App Router (страницы)
    components/                # UI-компоненты
    lib/
      patients.ts              # Слой доступа к данным (Prisma)
      prisma.ts                # Singleton PrismaClient
      mock-patients.ts         # Seed-данные (12 пациентов)
      clinic-config.ts         # Константы клиники
      actions/
        patient-actions.ts     # Server Actions (create / update)
      utils/
        dates.ts               # Форматирование дат
        initials.ts            # Инициалы пациента
```
