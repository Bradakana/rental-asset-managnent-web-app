# 🧪 Real-time Subscription Testing Guide

Автоматаар админ panel-д өгөгдөл орж ирэх систем тест хийх заавар.

## 🚀 Тест хийхийн өмнө

### 1. Backend болон Frontend server эхлүүлэх
```bash
# Backend (http://localhost:3001)
cd backend
npm run dev

# Frontend (http://localhost:3000) 
cd frontend  
npm run dev
```

### 2. Test данныенууд бэлэн байгаа эсэхийг шалгах
- Car Vendor: **vendor1@test.com** / password123
- Real Estate Vendor: **vendor2@test.com** / password123  
- Regular User: **user@test.com** / password123

## 🔧 Real-time тест хийх алхамууд

### Phase 1: Admin Dashboard Setup

1. **Admin болж нэвтрэх**
   - http://localhost:3000 рүү орох
   - **vendor1@test.com** / **password123** оруулж нэвтрэх
   - Dashboard хуудас руу очих (/dashboard)

2. **Browser Console нээх**
   - F12 дарж Developer Tools нээх
   - Console tab харах
   - Дараах мессежүүдийг хайх:
     ```
     ✅ Socket.io connected to server: [socket_id]
     🔌 Setting up real-time connection for vendor: [vendor_id]
     ✅ Real-time dashboard connected for vendor: [vendor_id]
     ```

3. **Admin Subscriptions хуудас руу очих**
   - /admin-subscriptions руу очих
   - Console дээр дараах мессеж харах:
     ```
     🔌 Setting up real-time subscriptions for vendor: [vendor_id]
     ✅ Real-time subscriptions connected for vendor: [vendor_id]
     ```

### Phase 2: User Subscription Test

4. **Шинэ браузер таб нээх**
   - Шинэ браузер таб/цонх нээх
   - http://localhost:3000 руу очих
   - **user@test.com** / **password123** болж нэвтрэх

5. **Car subscribe хийх**
   - /pages-user/cars руу очих
   - Ямар нэг машин сонгох
   - "Subscribe" товч дарах
   - Success мессеж гарах ёстой

6. **Real-time updates шалгах**
   - Admin браузер таб руу буцах
   - Dashboard хуудсанд дараах өөрчлөлтүүд харагдах ёстой:
     - Total Subscriptions тоо нэмэгдэх
     - Active Subscriptions тоо нэмэгдэх  
     - Шинэ notification гарах
   - Console дээр дараах мессеж харах:
     ```
     📊 Dashboard update received: {...}
     📊 Real-time dashboard update received: {...}
     ```

7. **Admin Subscriptions хуудас шалгах**
   - Admin Subscriptions хуудас руу очих
   - Subscriptions жагсаалтын эхэнд шинэ subscription гарч ирэх ёстой
   - Statistics картууд шинэчлэгдэх ёстой
   - Success snackbar харагдах ёстой

### Phase 3: Estate Subscription Test

8. **Estate subscribe хийх**
   - User браузер таб дээр /pages-user/estate руу очих
   - Ямар нэг үл хөдлөх хөрөнгө сонгох
   - "Subscribe" товч дарах

9. **Real Estate Vendor болж шалгах**
   - Шинэ браузер таб нээх
   - **vendor2@test.com** / **password123** болж нэвтрэх
   - Dashboard болон Admin Subscriptions хуудсуудад өөрчлөлт харах

## ✅ Амжилттай тест хийгдэх шаардлага

### Dashboard Updates:
- [ ] Statistics тоонууд real-time шинэчлэгдэх
- [ ] Notifications жагсаалтад шинэ зүйл нэмэгдэх
- [ ] Console дээр real-time мессежүүд харагдах

### Admin Subscriptions Updates:
- [ ] Subscriptions жагсаалтад шинэ subscription нэмэгдэх
- [ ] Statistics картууд шинэчлэгдэх
- [ ] Success snackbar notification харагдах

### Renters Auto-creation:
- [ ] Renters хуудсанд шинэ renter profile автоматаар нэмэгдэх
- [ ] "Auto-created from subscription" гэсэн тэмдэглэл байх

## 🔍 Debugging

### Console мессежүүд шалгах:
```javascript
// Socket connection
✅ Socket.io connected to server: [id]

// Vendor room join
🔌 Setting up real-time connection for vendor: [vendor_id]

// Subscription updates
📊 Dashboard update received: {...}
👥 Renter created: {...}

// Backend logs
✅ Subscription created successfully: [id] for vendorId: [vendor_id]
Real-time dashboard update sent for vendor [vendor_id]
Auto-created renter profile for [email] with vendor [vendor_id]
```

### Алдаа гарсан тохиолдолд:
1. Backend server console шалгах
2. Frontend browser console шалгах
3. Network tab дээр API calls шалгах
4. Socket.io connection статус шалгах

## 🎯 Хүлээгдэж буй үр дүн

User subscribe хийх үед:
1. **Шууд** админ dashboard дээр statistics шинэчлэгдэх
2. **Шууд** admin subscriptions хуудсанд шинэ subscription харагдах
3. **Шууд** renters хуудсанд шинэ renter profile үүсэх
4. **Real-time** notifications болон alerts харагдах

Бүх процесс автоматаар, refresh хийхгүйгээр ажиллах ёстой!
