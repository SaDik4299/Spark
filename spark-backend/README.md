# ⚡ Spark Backend — PHP + MySQL

## Setup in 4 steps

### 1. Requirements
- PHP 7.4+
- MySQL 5.7+
- XAMPP / WAMP / MAMP (or any local PHP server)

### 2. Set up the database
```bash
mysql -u root -p < config/init.sql
```
This creates the `spark_db` database and all tables automatically.

### 3. Configure credentials
Edit `config/db.php` and fill in:
```php
define('DB_PASS',    'your_mysql_password');
define('GMAIL_USER', 'your_gmail@gmail.com');
define('GMAIL_PASS', 'your_gmail_app_password');
define('SITE_URL',   'http://localhost:8080');
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

### 4. Place files & run
- Copy the `spark-backend/` folder into your XAMPP `htdocs/` directory
- Start Apache + MySQL in XAMPP
- Backend runs at: `http://localhost/spark-backend/api/`

---

## API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/signup.php` | Create account | No |
| POST | `/api/auth/login.php` | Login | No |
| POST | `/api/auth/logout.php` | Logout | Yes |
| GET  | `/api/auth/me.php` | Current user | No |
| POST | `/api/profile/save.php` | Save profile | Yes |
| GET  | `/api/profile/get.php` | Get profile | Yes |
| POST | `/api/quiz/save.php` | Save quiz results | Yes |
| GET  | `/api/quiz/history.php` | Past quiz results | Yes |
| GET  | `/api/admin/dashboard.php` | Admin stats | Admin |
| GET  | `/api/admin/users.php` | List users | Admin |
| DELETE | `/api/admin/users.php` | Delete user | Admin |

---

## Connecting the frontend

In `app.js`, replace `localStorage` calls with API calls:

```js
// SIGNUP
const res = await fetch('http://localhost/spark-backend/api/auth/signup.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // ← important for sessions
  body: JSON.stringify({ name, email, password })
});
const data = await res.json();

// SAVE PROFILE
await fetch('http://localhost/spark-backend/api/profile/save.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(profileData)
});
```

---

## Default Admin Login
- **Email:** sadik.sk4299@gmail.com  
- **Password:** `Admin@1234`  
⚠️ Change this password immediately after first login.

## Folder Structure
```
spark-backend/
  ├── config/
  │   ├── db.php          ← DB credentials + config
  │   └── init.sql        ← Run once to create all tables
  ├── middleware/
  │   └── session.php     ← Auth guards, CORS, helpers
  ├── emails/
  │   └── welcome.php     ← Welcome email template
  ├── api/
  │   ├── auth/
  │   │   ├── signup.php
  │   │   ├── login.php
  │   │   ├── logout.php
  │   │   └── me.php
  │   ├── profile/
  │   │   ├── save.php
  │   │   └── get.php
  │   ├── quiz/
  │   │   ├── save.php
  │   │   └── history.php
  │   └── admin/
  │       ├── dashboard.php
  │       └── users.php
  └── .htaccess
```
