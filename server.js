require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ⚙️ 1. ตั้งค่าการเชื่อมต่อ PostgreSQL จากไฟล์ .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูล PostgreSQL ได้:', err.stack);
    }
    console.log('✅ เชื่อมต่อฐานข้อมูล PostgreSQL สำเร็จ!');
    release();
});

// 📌 2. API ลงทะเบียน Staff (แก้ไขการรองรับตำแหน่งเรียบร้อยแล้ว)
app.post('/api/register-staff', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { firstName, lastName, email, position, password } = req.body;

        if (!email || !password || !firstName || !lastName) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน' });
        }

        const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRes = await client.query(
            `INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, 'staff', 'approved') RETURNING id`,
            [email, hashedPassword]
        );

        await client.query(
            `INSERT INTO staff_profiles (user_id, first_name, last_name, position) VALUES ($1, $2, $3, $4)`,
            [userRes.rows[0].id, firstName, lastName, position]
        );

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: 'ลงทะเบียนพนักงานเรียบร้อยแล้ว' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in /api/register-staff:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียนพนักงาน', error: error.message });
    } finally {
        client.release();
    }
});

// 📌 3. API ลงทะเบียน KOL
app.post('/api/register-kol', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            firstName, lastName, phone, lineId,
            expertise, platforms,
            address, postalCode, subDistrict, district, province,
            bankName, accountName, accountNumber,
            email, password
        } = req.body;

        const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRes = await client.query(
            `INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, 'kol', 'pending') RETURNING id`,
            [email, hashedPassword]
        );
        const userId = userRes.rows[0].id;

        const kolRes = await client.query(
            `INSERT INTO kol_profiles (user_id, first_name, last_name, phone_number, line_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [userId, firstName, lastName, phone, lineId]
        );
        const kolProfileId = kolRes.rows[0].id;

        if (address || postalCode) {
            await client.query(
                `INSERT INTO kol_addresses (kol_profile_id, address, postal_code, sub_district, district, province) VALUES ($1, $2, $3, $4, $5, $6)`,
                [kolProfileId, address, postalCode, subDistrict, district, province]
            );
        }

        if (accountNumber) {
            await client.query(
                `INSERT INTO kol_bank_accounts (kol_profile_id, bank_name, account_name, account_number) VALUES ($1, $2, $3, $4)`,
                [kolProfileId, bankName, accountName, accountNumber]
            );
        }

        if (expertise && Array.isArray(expertise) && expertise.length > 0) {
            for (let exp of expertise) {
                await client.query(
                    `INSERT INTO kol_expertise (kol_profile_id, expertise_name) VALUES ($1, $2)`,
                    [kolProfileId, exp]
                );
            }
        }

        if (platforms && Array.isArray(platforms) && platforms.length > 0) {
            for (let plat of platforms) {
                await client.query(
                    `INSERT INTO kol_platforms (kol_profile_id, platform_name) VALUES ($1, $2)`,
                    [kolProfileId, plat]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: 'ลงทะเบียน KOL เรียบร้อยแล้ว' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in /api/register-kol:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน KOL', error: error.message });
    } finally {
        client.release();
    }
});

// 📌 4. API เข้าสู่ระบบ (Login)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'ไม่พบอีเมลนี้ในระบบ' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        res.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            user: { id: user.id, email: user.email, role: user.role, status: user.status }
        });
    } catch (error) {
        console.error('Error in /api/login:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
    }
});

// 🚀 เริ่มทำงาน Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));