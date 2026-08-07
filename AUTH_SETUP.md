# AUTH_SETUP.md — Инструкция по настройке авторизации

---

## Раздел А — Для разработчика

### 1. AUTH_SECRET

Генерируется один раз для каждой среды (dev / prod):

```bash
openssl rand -base64 32
```

Скопируйте вывод в `.env`:

```
AUTH_SECRET=сгенерированная_строка
```

---

### 2. Google OAuth 2.0

1. Перейдите на [console.cloud.google.com](https://console.cloud.google.com)
2. Создайте проект (или выберите существующий)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
4. Тип приложения: **Web application**
5. Добавьте **Authorized redirect URIs**:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://ваш-домен.com/api/auth/callback/google`
6. Скопируйте **Client ID** и **Client Secret** в `.env`:

```
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
```

> Если нужен OAuth Consent Screen — заполните его (название приложения, email поддержки). Тестовых пользователей добавлять не нужно, достаточно сохранить whitelist в БД.

---

### 3. Telegram Bot

#### 3a. Создать бота

1. Напишите `@BotFather` в Telegram
2. Команда `/newbot` → задайте имя и username (username должен заканчиваться на `bot`)
3. Скопируйте токен в `.env`:

```
TELEGRAM_BOT_TOKEN=123456789:AAF...
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=meddera_crm_bot
```

#### 3b. Привязать домен к боту (обязательно для Login Widget)

Telegram Login Widget работает только с авторизованным доменом:

```
/setdomain  →  выберите бота  →  введите домен (без https://)
```

- Dev: введите домен через ngrok или аналог (локальный `localhost` не принимается Telegram)
- Prod: введите `ваш-домен.com`

#### 3c. Заголовки CSP (если настраиваете Content Security Policy)

В `next.config.ts` разрешите скрипт Telegram:

```typescript
headers: async () => [
  {
    source: "/(.*)",
    headers: [
      {
        key: "Content-Security-Policy",
        value: "script-src 'self' https://telegram.org; frame-src https://oauth.telegram.org;",
      },
    ],
  },
],
```

---

### 4. Переменные для seed (пользователи в БД)

Заполните в `.env` перед первым запуском `npm run db:seed`:

```env
SUPERADMIN_EMAIL=admin@meddera.md
SUPERADMIN_NAME=Имя Администратора
SUPERADMIN_TEMP_PASSWORD=временный_сложный_пароль

DOCTOR_1_EMAIL=doctor1@meddera.md
DOCTOR_1_NAME=Имя Врача 1
DOCTOR_1_TELEGRAM_ID=123456789
# ... DOCTOR_2 ... DOCTOR_5
```

После seed суперадмин получит `mustChangePassword=true` — смените пароль при первом входе.

---

### 5. Порядок первого запуска

```bash
# 1. Скопируйте env
cp .env.example .env
# ... заполните все переменные ...

# 2. Запустите БД
docker-compose up db -d

# 3. Примените миграции
npm run db:migrate

# 4. Создайте пользователей
npm run db:seed

# 5. Запустите приложение
npm run dev
```

---

### 6. DEV-роут `/create-user`

Доступен только если в `.env` установлено:

```
ENABLE_CREATE_USER=true
```

И `NODE_ENV !== "production"`. Перейдите по адресу:

```
http://localhost:3000/create-user
```

**Перед деплоем в production** удалите `ENABLE_CREATE_USER` из production `.env`.

---

---

## Раздел Б — Для администратора клиники

### Как узнать Telegram ID нового врача

Telegram ID — это **постоянный числовой номер** аккаунта. Он не меняется при смене username или имени.

**Способ 1 — через @userinfobot:**

1. Попросите врача написать сообщение боту [@userinfobot](https://t.me/userinfobot) в Telegram
2. Бот ответит: `Your user ID: 123456789`
3. Врач сообщает вам это число — именно его нужно внести в систему

**Способ 2 — через бота клиники:**

1. Врач пишет любое сообщение боту клиники (`@meddera_crm_bot` или иное имя)
2. Разработчик видит `message.from.id` в логах бота — это и есть Telegram ID

**Важно:**

- ID — это **число** (например `123456789`), а не username (`@ivanov_doctor`)
- Username может измениться — ID никогда
- Передайте ID разработчику для внесения в систему

---

### Что делать, если врач не может войти через Telegram

1. Убедитесь, что врач **нажимает «Войти через Telegram»** на странице входа (не ищет бота вручную)
2. Убедитесь, что Telegram у врача привязан к номеру телефона (аккаунт полноценный)
3. Передайте Telegram ID врача разработчику — возможно, ID ещё не добавлен в систему
4. Если врач сменил аккаунт Telegram — у него другой ID, нужно обновить запись в БД

---

### Что делать, если нужно добавить нового врача

1. Узнайте **Telegram ID** нового врача (способ выше)
2. Передайте разработчику:
   - ФИО врача
   - Email
   - Telegram ID (числовой)
3. Разработчик добавит врача в систему

В период разработки (локально) можно воспользоваться страницей `/create-user` — спросите разработчика.
