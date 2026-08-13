<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>หน้าหลัก</title>
</head>
<body>

    <h1>ยินดีต้อนรับเข้าสู่เว็บไซต์!</h1>

    <?php if (isset($_GET['status']) && $_GET['status'] === 'success'): ?>
        <script>
            alert("ลงทะเบียนสำเร็จเรียบร้อยแล้ว!");
        </script>
        <p style="color: green;">🎉 สมัครสมาชิกเรียบร้อยแล้ว สามารถเข้าสู่ระบบได้เลย</p>
    <?php endif; ?>

</body>
</html>