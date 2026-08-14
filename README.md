ขั้นตอนการติดตังผ่านpowershell
1.ติดตั้งโปรเเกรม
ทำการพิมส์ cd Drive:\folder
สุดท้ายทำการวาง git clone https://github.com/watchirapakornme-del/watchirapakorn.git 
อย่าพึ่งปิดpowershell

2.เข้าไฟล์ไปตำเเเหน่งที่ตัดตั้งเเล้ว ลบ.env.example ให้เหลือเเค้คำว่า.env (คำเตือนไม่ว่าจะเหตุผลอะไรก็โปรดอย่านำไฟล์นี้ออกสู่สาธารณะ) 

3.ทำการติดตั้ง npm 
 โดยการพิมส์ npm install ลงpowershell ที่เลือกโฟล์เดอร์โปรเเกรมอยู่
 หลังจากพิมส์ npm instal ยืนยันเเล้ว 
 อยากใช้งานโปรเเกรม ให้พิมส์ node server.js เเละมันจะขึ้นว่า
 🚀 Server running on http://localhost:5000
✅ เชื่อมต่อฐานข้อมูล PostgreSQL สำเร็จ!
 เป็นการเปิด server ภายในเครื่องไม่ได้ออกสู่สาธารณะ เพื่อให้รู้ว่า data base ใช้งานได้จิงมัย

