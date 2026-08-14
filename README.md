ก่อนจะเข้าเนื้อหาขั้นตอน ทางผมทำไว้สองเเบบ เเบบเเรกinterface เเบบสอง data base
เเบบทื่1
โหลด 
https://git-scm.com/install/windows
เเล้วติดตั้ง

ขั้นตอนการติดตังผ่านpowershell

1.ติดตั้งโปรเเกรม

ทำการพิมส์ cd Drive:\folder

เเละทำการคัดลอก git clone https://github.com/watchirapakornme-del/watchirapakorn.git 



 วิธีทดสอบไฟล์ ไปยังไฟล์โปรเเกรมเเละหาไฟล์ชื่อindex.html อย่างเช่น F:\test\index.html เเละนำไปวางที่เว็ปไซต์

หากlogin หริอ register ขึ้น wants to access other apps and services on this device. ไม่ต้องตกใจ ให้Allow


รวมสิ่งที่จำเป็น 
ตั้งติดตั้ง3อย่าง
https://git-scm.com/install/windows
https://nodejs.org/en/download
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
ถ้าดูลักษณะโปรเเกรมให้ติดตั้งเเค่git เเล้วเปิด index.html ได้เลยครับ 

เเต่ถ้าต้องการทดสอบระบบใหญ่ต้องติดตั้งให้ครบนั้นทดสอบจิง
ต้องทำงาน เปิดsql
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('staff', 'kol', 'admin')),
    status        VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS staff_profiles (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    position   VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS kol_profiles (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30),
    line_id      VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS kol_addresses (
    id              SERIAL PRIMARY KEY,
    kol_profile_id  INTEGER NOT NULL REFERENCES kol_profiles(id) ON DELETE CASCADE,
    address         TEXT,
    postal_code     VARCHAR(10),
    sub_district    VARCHAR(100),
    district        VARCHAR(100),
    province        VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS kol_bank_accounts (
    id              SERIAL PRIMARY KEY,
    kol_profile_id  INTEGER NOT NULL REFERENCES kol_profiles(id) ON DELETE CASCADE,
    bank_name       VARCHAR(100),
    account_name    VARCHAR(150),
    account_number  VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS kol_expertise (
    id              SERIAL PRIMARY KEY,
    kol_profile_id  INTEGER NOT NULL REFERENCES kol_profiles(id) ON DELETE CASCADE,
    expertise_name  VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS kol_platforms (
    id              SERIAL PRIMARY KEY,
    kol_profile_id  INTEGER NOT NULL REFERENCES kol_profiles(id) ON DELETE CASCADE,
    platform_name   VARCHAR(100) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_user_id ON staff_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_kol_profiles_user_id ON kol_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_kol_addresses_kol_profile_id ON kol_addresses(kol_profile_id);
CREATE INDEX IF NOT EXISTS idx_kol_bank_accounts_kol_profile_id ON kol_bank_accounts(kol_profile_id);
CREATE INDEX IF NOT EXISTS idx_kol_expertise_kol_profile_id ON kol_expertise(kol_profile_id);
CREATE INDEX IF NOT EXISTS idx_kol_platforms_kol_profile_id ON kol_platforms(kol_profile_id);




by Watchirapakorn Meechai
