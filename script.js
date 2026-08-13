// กำหนดภาษาเริ่มต้นถ้ายังไม่เคยเลือก
const DEFAULT_LANG = 'th';

// ฟังก์ชันดึงภาษาปัจจุบัน
// ลำดับความสำคัญ: 1) ?lang= ใน URL (กันปัญหา localStorage ไม่แชร์ข้ามหน้า
// เวลาเปิดไฟล์แบบ file:// หรือคนละ origin)  2) localStorage  3) ค่า default
function getCurrentLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'th') {
        // sync กลับเข้า localStorage ด้วย เผื่อ localStorage ใช้งานได้ปกติ
        try { localStorage.setItem('app_lang', urlLang); } catch (e) {}
        return urlLang;
    }

    try {
        return localStorage.getItem('app_lang') || DEFAULT_LANG;
    } catch (e) {
        return DEFAULT_LANG;
    }
}

// ฟังก์ชันเปลี่ยนภาษาและบันทึกลง LocalStorage
function setLanguage(lang) {
    try { localStorage.setItem('app_lang', lang); } catch (e) {}

    // อัปเดต URL ปัจจุบันให้มี ?lang= ด้วย (ไม่ reload หน้า)
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);

    applyLanguage(lang);
}

// อัปเดตลิงก์ทุกอันที่ชี้ไปหน้า .html อื่นในเว็บนี้ ให้แนบ ?lang= ปัจจุบันไปด้วย
// เพื่อให้ภาษายังคงอยู่ตอนกดลิงก์ข้ามหน้า แม้ localStorage จะใช้งานไม่ได้
function syncLinksLang(lang) {
    document.querySelectorAll('a[href$=".html"], a[href*=".html?"], a[href*=".html#"]').forEach(a => {
        try {
            const href = a.getAttribute('href');
            const url = new URL(href, window.location.href);
            url.searchParams.set('lang', lang);
            a.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
        } catch (e) {}
    });
}

// ฟังก์ชันปรับเปลี่ยนข้อความและสถานะปุ่มในหน้าเว็บ
function applyLanguage(lang) {
    if (!lang) lang = getCurrentLang();

    // 1. อัปเดตสถานะปุ่ม Switcher (EN / ไทย)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. อัปเดตข้อความทั่วไป (data-en, data-th)
    document.querySelectorAll('[data-en][data-th]').forEach(elem => {
        const text = elem.getAttribute(`data-${lang}`);
        if (text !== null) {
            elem.innerHTML = text;
        }
    });

    // 3. อัปเดต Placeholder ของ Input (data-en-ph, data-th-ph)
    document.querySelectorAll('[data-en-ph][data-th-ph]').forEach(input => {
        const phText = input.getAttribute(`data-${lang}-ph`);
        if (phText !== null) {
            input.placeholder = phText;
        }
    });

    // 4. อัปเดตลิงก์ข้ามหน้าให้พกภาษาไปด้วย
    syncLinksLang(lang);

    // 5. ถ้ามีฟังก์ชันอัปเดต UI เฉพาะหน้า (เช่น register-kol) ให้เรียกทำงานด้วย
    if (typeof updateStepUI === 'function') {
        updateStepUI(lang);
    }
}

// ทำงานอัตโนมัติเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = getCurrentLang();
    applyLanguage(savedLang);
});