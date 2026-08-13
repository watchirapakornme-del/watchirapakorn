<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!empty($username) && !empty($email) && !empty($password)) {
        // บันทึกข้อมูลลงฐานข้อมูล...
        $save_success = true;

        if ($save_success) {
            header("Location: index.php?status=success");
            exit();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>ลงทะเบียน</title>
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .card { border: 1px solid #ccc; padding: 20px; border-radius: 8px; width: 300px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; }
        .form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>

<div class="card">
    <h2>สมัครสมาชิก</h2>
    <form action="register.php" method="POST">
        <div class="form-group">
            <label>ชื่อผู้ใช้</label>
            <input type="text" name="username" required>
        </div>
        <div class="form-group">
            <label>อีเมล</label>
            <input type="email" name="email" required>
        </div>
        <div class="form-group">
            <label>รหัสผ่าน</label>
            <input type="password" name="password" required>
        </div>
        <button type="submit">ยืนยันการลงทะเบียน</button>
    </form>
</div>

</body>
</html>