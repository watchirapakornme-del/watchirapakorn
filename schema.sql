-- 1. ตารางหลักสำหรับเก็บข้อมูลล็อกอิน
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('kol', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ตารางโปรไฟล์ KOL
CREATE TABLE IF NOT EXISTS kol_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    prefix VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    line_id VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_relation VARCHAR(100),
    emergency_contact_phone VARCHAR(50)
);

-- 3. ตารางที่อยู่ KOL
CREATE TABLE IF NOT EXISTS kol_addresses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    house_no VARCHAR(100),
    village VARCHAR(100),
    road VARCHAR(100),
    sub_district VARCHAR(100),
    district VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20)
);

-- 4. ตารางบัญชีธนาคาร KOL
CREATE TABLE IF NOT EXISTS kol_bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    account_name VARCHAR(100)
);

-- 5. ตารางความเชี่ยวชาญ KOL
CREATE TABLE IF NOT EXISTS kol_expertise (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100)
);

-- 6. ตาราง Social Media Platforms ของ KOL
CREATE TABLE IF NOT EXISTS kol_platforms (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    platform_name VARCHAR(100),
    handle_or_link TEXT,
    follower_count INT DEFAULT 0
);

-- 7. ตารางโปรไฟล์พนักงาน (Staff)
CREATE TABLE IF NOT EXISTS staff_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    prefix VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    line_id VARCHAR(100),
    department VARCHAR(100),
    position VARCHAR(100)
);