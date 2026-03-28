-- ══════════════════════════════════════
-- SPARK DATABASE — Run this once to set up
-- mysql -u root -p spark_db < init.sql
-- ══════════════════════════════════════

CREATE DATABASE IF NOT EXISTS spark_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spark_db;

-- ── USERS ──
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('user','admin') DEFAULT 'user',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── PROFILES ──
CREATE TABLE IF NOT EXISTS profiles (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL UNIQUE,
    age         INT,
    city        VARCHAR(100),
    gender      VARCHAR(20),
    education   VARCHAR(100),
    field       VARCHAR(100),
    status      VARCHAR(100),
    interests   TEXT,
    priority    VARCHAR(100),
    extra       TEXT,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── QUIZ RESULTS ──
CREATE TABLE IF NOT EXISTS quiz_results (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL,
    personality_type    VARCHAR(100),
    personality_summary TEXT,
    careers             JSON,
    closing_note        TEXT,
    quiz_mode           ENUM('medium','long') DEFAULT 'medium',
    taken_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── SESSIONS ──
CREATE TABLE IF NOT EXISTS sessions (
    id          VARCHAR(128) NOT NULL PRIMARY KEY,
    user_id     INT,
    data        TEXT,
    expires_at  DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── DEFAULT ADMIN ──
-- Password: Admin@1234 (change after first login)
INSERT IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'sadik.sk4299@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
