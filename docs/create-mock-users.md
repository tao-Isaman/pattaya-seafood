# วิธีการสร้างผู้ใช้จำลองใน Supabase

## วิธีที่ 1: สร้างผ่าน Supabase Dashboard

1. เข้าสู่ Supabase Dashboard และเลือกโปรเจค
2. ไปที่ "Authentication" > "Users"
3. คลิกปุ่ม "Add User"
4. กรอกข้อมูลผู้ใช้:
   - Email: admin@pattayaseafood.com
   - Password: password123
5. คลิก "Create User"
6. หลังจากสร้างผู้ใช้แล้ว ให้ไปที่ "Table Editor"
7. เลือกตาราง "profiles"
8. ค้นหาผู้ใช้ที่เพิ่งสร้าง (โดยใช้ UUID ที่ได้จากหน้า Users)
9. คลิกที่แถวของผู้ใช้นั้นและแก้ไขคอลัมน์ "role" เป็น "admin"
10. คลิก "Save"

ทำซ้ำขั้นตอนเดียวกันสำหรับผู้ใช้ staff@pattayaseafood.com แต่ตั้งค่า role เป็น "staff"

## วิธีที่ 2: สร้างผ่าน SQL Editor

1. เข้าสู่ Supabase Dashboard และเลือกโปรเจค
2. ไปที่ "SQL Editor"
3. สร้าง Query ใหม่และใส่ SQL ต่อไปนี้:

\`\`\`sql
-- สร้างผู้ใช้ admin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  role
)
VALUES (
  gen_random_uuid(),
  'admin@pattayaseafood.com',
  crypt('password123', gen_salt('bf')),
  now(),
  'authenticated'
)
RETURNING id;
\`\`\`

4. รันคำสั่ง SQL และจดบันทึก UUID ที่ได้
5. สร้าง Query ใหม่เพื่ออัพเดท role:

\`\`\`sql
-- อัพเดท role เป็น admin
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'UUID_ที่ได้จากขั้นตอนก่อนหน้า';
\`\`\`

6. ทำซ้ำขั้นตอนเดียวกันสำหรับผู้ใช้ staff@pattayaseafood.com แต่ตั้งค่า role เป็น "staff"

## วิธีที่ 3: สร้างผ่าน API

คุณสามารถใช้ Supabase Admin API เพื่อสร้างผู้ใช้ได้ ดูตัวอย่างได้ในไฟล์ `scripts/create-mock-users.ts`

หมายเหตุ: วิธีนี้ต้องใช้ Service Role Key ซึ่งมีสิทธิ์สูงสุด ควรใช้อย่างระมัดระวังและไม่ควรเปิดเผยใน client-side code

# tring deploy