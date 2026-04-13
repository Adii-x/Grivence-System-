# GrievEase — Backend PRD
### Student Grievance Management System
**Version:** 1.0  
**Role:** Backend  
**Stack:** Node.js + Express + MongoDB Atlas + JWT + Bcrypt + Multer + ImageKit + Node-cron

---

## 1. PROJECT OVERVIEW

GrievEase backend is the complete brain of the system. It handles authentication, complaint management, business logic, file uploads, scheduled escalation and analytics. The frontend never does any heavy lifting — every critical operation is verified and processed on the backend.

**Base URL:** `http://localhost:5000/api`

**Database Name:** `Grievease`

---

## 2. TECH STACK

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4+ | Web framework |
| MongoDB Atlas | Cloud | Database |
| Mongoose | 7+ | ODM — schema + queries |
| JSON Web Token | 9+ | Authentication |
| Bcryptjs | 2+ | Password hashing |
| Multer | 1+ | File upload handler |
| @imagekit/nodejs | 7+ | Cloud file storage — private key only |
| Node-cron | 3+ | Scheduled escalation job |
| Express-validator | 7+ | Input validation |
| Helmet | 7+ | HTTP security headers |
| CORS | 2+ | Origin restriction |
| Express-rate-limit | 7+ | Login brute force protection |
| Dotenv | 16+ | Environment variables |

---

## 3. FOLDER STRUCTURE

```
backend/
├── server.js                     entry point — starts server
├── .env                          secrets and config (never commit)
├── .env.example                  empty template (commit this)
├── .gitignore                    node_modules + .env
│
├── config/
│   └── db.js                     MongoDB Atlas connection
│
├── middleware/
│   ├── authMiddleware.js          verify JWT token on every request
│   ├── roleMiddleware.js          check student/staff/admin role
│   ├── errorMiddleware.js         global error handler — no crashes
│   └── uploadMiddleware.js        multer memory storage config
│
├── models/
│   ├── User.js                    students, staff and admin schema
│   ├── Complaint.js               complaints schema with full lifecycle
│   └── Comment.js                 comments on complaints schema
│
├── controllers/
│   ├── authController.js          register, login logic
│   ├── complaintController.js     student complaint operations
│   ├── staffController.js         staff update/comment operations
│   └── adminController.js         admin assign + analytics
│
├── routes/
│   ├── authRoutes.js              /api/auth/*
│   ├── complaintRoutes.js         /api/complaints/*
│   ├── staffRoutes.js             /api/staff/*
│   └── adminRoutes.js             /api/admin/*
│
├── utils/
│   ├── keywordEngine.js           priority auto-upgrade logic
│   ├── departmentMapper.js        category → department mapping
│   ├── deadlineCalculator.js      priority → deadline days
│   ├── imagekit.js                imagekit SDK configuration
│   └── generateToken.js           JWT token creation helper
│
└── jobs/
    └── escalationJob.js           nightly cron — marks overdue as escalated
```

---

## 4. ENVIRONMENT VARIABLES

### .env file
```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://grievease-admin:password@cluster.mongodb.net/Grievease

JWT_SECRET=minimum_64_character_random_string_generate_with_crypto
JWT_EXPIRE=7d

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### .env.example (commit this to git)
```
PORT=
NODE_ENV=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRE=
IMAGEKIT_PRIVATE_KEY=
```

---

## 5. DATABASE — MONGODB ATLAS

**Database name:** `Grievease`

**Collections:** `users`, `complaints`, `comments`

---

### 5.1 User Model

```
Collection: users

Fields:
  _id              ObjectId — auto generated
  name             String — required, trimmed, max 50 chars
  email            String — required, unique, lowercase, trimmed
  password         String — required, hashed with bcrypt, never returned
  role             String — enum: student / staff / admin
  studentId        String — required only if role = student
  department       String — required for all roles
  year             String — enum: First/Second/Third/Fourth — student only
  assignedDept     String — required only if role = staff
  isActive         Boolean — default true
  loginAttempts    Number — default 0 (brute force tracking)
  lockUntil        Date — null unless account locked
  createdAt        Date — auto
  updatedAt        Date — auto
```

**Indexes:**
- `email` — unique index for fast login lookup
- `role` — index for filtering by role

---

### 5.2 Complaint Model

```
Collection: complaints

Fields:
  _id                    ObjectId — auto generated
  studentId              ObjectId — ref: User — required
  studentName            String — denormalized for fast display
  title                  String — required, min 10, max 100
  description            String — required, min 20, max 500
  category               String — enum: Hostel/Academic/Library/
                                  Mess/Infrastructure/Safety/Fees
  studentPriority        String — enum: Low/Medium — student input
  finalPriority          String — enum: Low/Medium/High/Urgent — system set
  status                 String — enum: Pending/In Progress/Resolved/Escalated
                                  default: Pending
  assignedDept           String — auto set by department mapper
  assignedStaff          ObjectId — ref: User — null until staff acts
  deadline               Date — auto calculated by priority
  resolvedAt             Date — null until resolved
  attachment             String — ImageKit URL or null
  isEscalated            Boolean — default false
  rating                 Number — null, 1-5 after resolution
  createdAt              Date — auto
  updatedAt              Date — auto
```

**Indexes:**
- `studentId` — for fetching student's own complaints fast
- `assignedDept` — for staff dashboard query
- `status` — for analytics and escalation job
- `deadline` — for escalation job query
- `isEscalated` — for admin alerts

---

### 5.3 Comment Model

```
Collection: comments

Fields:
  _id           ObjectId — auto generated
  complaintId   ObjectId — ref: Complaint — required
  authorId      ObjectId — ref: User — required
  authorName    String — denormalized
  authorRole    String — enum: staff/admin
  message       String — required, min 1, max 1000
  createdAt     Date — auto
```

**Indexes:**
- `complaintId` — for fetching all comments of a complaint fast

---

## 6. ALL API ENDPOINTS

### Auth Routes — /api/auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Student registration |
| POST | /api/auth/login | Public | All roles login |

---

### Complaint Routes — /api/complaints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/complaints | Student | Submit new complaint |
| GET | /api/complaints/mine | Student | Get own complaints |
| GET | /api/complaints/:id | Student | Get single complaint detail |

---

### Staff Routes — /api/staff

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/staff/complaints | Staff | Get dept complaints |
| GET | /api/staff/complaints/:id | Staff | Get complaint detail |
| PUT | /api/staff/complaints/:id/status | Staff | Update status |
| PUT | /api/staff/complaints/:id/deadline | Staff | Set deadline |
| POST | /api/staff/complaints/:id/comment | Staff | Add comment |

---

### Admin Routes — /api/admin

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/admin/complaints | Admin | Get all complaints |
| GET | /api/admin/complaints/:id | Admin | Get any complaint detail |
| PUT | /api/admin/complaints/:id/assign | Admin | Assign to department |
| PUT | /api/admin/complaints/:id/priority | Admin | Override priority |
| GET | /api/admin/analytics | Admin | Dashboard chart data |
| GET | /api/admin/departments | Admin | Department performance |

---

## 7. MIDDLEWARE CHAIN

Every request passes through this chain before hitting the controller:

```
Incoming Request
      ↓
Helmet.js — security headers added
      ↓
CORS — is origin allowed?
      ↓
Body Parser — parse JSON, limit 10kb
      ↓
authMiddleware — is JWT valid? extract user
      ↓
roleMiddleware — does role match this route?
      ↓
express-validator — is input valid?
      ↓
Controller — actual business logic
      ↓
errorMiddleware — catch any unhandled error
      ↓
Response sent to frontend
```

---

### 7.1 authMiddleware.js

```
1. Check Authorization header exists
2. Extract Bearer token
3. Verify JWT using JWT_SECRET
4. If expired → 401 Token expired
5. If invalid → 401 Not authorized
6. Find user in database by ID from token
7. If user not found → 401 User not found
8. Attach user object to req.user
9. Call next()
```

---

### 7.2 roleMiddleware.js

```
Takes required role as parameter
Checks req.user.role === required role
If not match → 403 Access Denied
If match → call next()
```

Used like:
```
router.get('/admin/complaints', auth, role('admin'), getAll)
router.get('/staff/complaints', auth, role('staff'), getDept)
router.post('/complaints', auth, role('student'), submit)
```

---

### 7.3 errorMiddleware.js

```
Catches all unhandled errors
Never lets server crash
Returns clean JSON:
{
  success: false,
  message: human readable message,
  statusCode: correct HTTP code
}

Special handling for:
- Mongoose ValidationError → 400
- Mongoose CastError (bad ID) → 404
- JWT errors → 401
- Duplicate key (email exists) → 400
- Everything else → 500
```

---

## 8. CONTROLLERS — DETAILED LOGIC

---

### 8.1 authController.js

**Register:**
```
1. Validate input — express-validator
2. Check if email already exists in DB
3. If exists → 400 Email already registered
4. Hash password with bcrypt salt 12
5. Create user document in MongoDB
6. Generate JWT token
7. Return token + user object (password excluded)
```

**Login:**
```
1. Validate email + password not empty
2. Find user by email
3. If not found → 401 Invalid credentials
4. Check if account is locked (loginAttempts >= 5)
5. If locked → 401 Account locked, try after X minutes
6. Compare password with bcrypt
7. If wrong:
   - Increment loginAttempts
   - If attempts >= 5, set lockUntil = now + 15 minutes
   - Return 401 Invalid credentials
8. If correct:
   - Reset loginAttempts to 0
   - Reset lockUntil to null
   - Generate JWT token
   - Return token + user (password excluded)
```

---

### 8.2 complaintController.js

**Submit Complaint:**
```
1. Validate all input fields
2. Run keyword engine on title + description
3. Get finalPriority from keyword engine result
4. Run department mapper on category → assignedDept
5. Run deadline calculator on finalPriority → deadline date
6. If file attached:
   - Multer receives in memory
   - Send to ImageKit SDK
   - Get back permanent URL
7. Create complaint document in MongoDB:
   - studentId from req.user._id
   - studentName from req.user.name
   - title, description, category
   - studentPriority from request body
   - finalPriority from keyword engine
   - assignedDept from mapper
   - deadline from calculator
   - attachment = ImageKit URL or null
   - status = Pending
8. Return created complaint
```

**Get Own Complaints:**
```
1. Get studentId from req.user._id
2. Query complaints where studentId matches
3. Apply filters if provided (status, category)
4. Sort by createdAt descending
5. Paginate — 10 per page
6. Return list
```

**Get Single Complaint:**
```
1. Find complaint by ID
2. Verify complaint.studentId === req.user._id
3. If not match → 403 Not your complaint
4. Fetch comments where complaintId matches
5. Return complaint + comments combined
```

---

### 8.3 staffController.js

**Get Department Complaints:**
```
1. Get assignedDept from req.user.assignedDept
2. Query complaints where assignedDept matches
3. Apply filters if provided (status, priority, date)
4. Sort: Urgent first, then by deadline ascending
5. Paginate — 20 per page
6. Return list
```

**Update Status:**
```
1. Find complaint by ID
2. Verify complaint.assignedDept === req.user.assignedDept
3. If not match → 403 Not your department
4. Validate new status is valid enum value
5. Update status in MongoDB
6. If status = Resolved:
   - Set resolvedAt = current timestamp
7. Update updatedAt
8. Return updated complaint
```

**Set Deadline:**
```
1. Find complaint by ID
2. Verify department ownership
3. Validate deadline is a future date
4. Update deadline field
5. Return updated complaint
```

**Add Comment:**
```
1. Validate message not empty, max 1000 chars
2. Create comment document:
   - complaintId from URL param
   - authorId from req.user._id
   - authorName from req.user.name
   - authorRole = staff
   - message from body
3. Return created comment
```

---

### 8.4 adminController.js

**Get All Complaints:**
```
1. Build dynamic query from filters:
   - department filter
   - status filter
   - priority filter
   - date range filter
   - search by title or studentName
2. Execute query with pagination — 20 per page
3. Return results + total count
```

**Assign Complaint:**
```
1. Find complaint by ID
2. Validate new department is valid
3. Update assignedDept
4. Reset assignedStaff to null
5. Update updatedAt
6. Return updated complaint
```

**Override Priority:**
```
1. Find complaint by ID
2. Validate new priority is valid enum
3. Update finalPriority
4. Recalculate deadline based on new priority
5. Update deadline + updatedAt
6. Return updated complaint
```

**Get Analytics:**
```
Run 5 MongoDB aggregation queries in parallel:

Query 1: Count all complaints
Query 2: Count grouped by status
Query 3: Count grouped by assignedDept
Query 4: Count grouped by week (last 8 weeks)
Query 5: Average (resolvedAt - createdAt) 
         grouped by department

Return all 5 results in single response object
```

**Get Department Performance:**
```
Run aggregation grouped by assignedDept:
- Total received
- Total resolved
- Total pending
- Total escalated
- Average resolution time in days

Sort by most escalated first
Return department cards array
```

---

## 9. BUSINESS LOGIC UTILITIES

---

### 9.1 keywordEngine.js

```
Input: title (string) + description (string)
Output: finalPriority (string)

Logic:
  Combine title + description, lowercase

  Urgent keywords:
  fire, flood, electric shock, harassment,
  assault, injury, violence, emergency,
  threat, collapse, blackout, attack

  High keywords:
  broken, not working, leak, damage,
  no water, no electricity, locked out,
  pest, rats, sewage, no wifi, burst

  If any urgent keyword found → return Urgent
  Else if any high keyword found → return High
  Else → return studentSelectedPriority unchanged
```

---

### 9.2 departmentMapper.js

```
Input: category (string)
Output: assignedDept (string)

Map:
  Hostel         → hostel_dept
  Academic       → academic_dept
  Library        → library_dept
  Mess           → mess_dept
  Infrastructure → maintenance_dept
  Safety         → security_dept
  Fees           → finance_dept
```

---

### utils/imagekit.js

```js
import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imagekit;
```

Upload usage in controller:
```js
const response = await imagekit.files.upload({
  file: req.file.buffer,
  fileName: sanitizedFileName,
});
// response.url → permanent ImageKit URL → save in MongoDB
```

```
Input: finalPriority (string)
Output: deadline (Date)

Map:
  Urgent → today + 1 day
  High   → today + 3 days
  Medium → today + 7 days
  Low    → today + 14 days

Returns exact Date object
```

---

## 10. FILE UPLOAD — IMAGEKIT FLOW

**Package:** `@imagekit/nodejs` — only requires `IMAGEKIT_PRIVATE_KEY`

```
Student selects file in React
        ↓
React sends as FormData to backend
        ↓
Multer receives file in memory
(never touches server disk)
        ↓
Validate:
  - MIME type must be image/jpeg, image/png, application/pdf
  - Size must be under 5MB
  - If invalid → 400 error
        ↓
Backend sends buffer to @imagekit/nodejs SDK
using imagekit.files.upload()
        ↓
ImageKit stores on cloud + returns URL in response.url
        ↓
Backend saves URL string in MongoDB
complaint.attachment = response.url
        ↓
Frontend loads image directly from ImageKit URL
```

---

## 11. ESCALATION JOB

**File:** `jobs/escalationJob.js`

**Schedule:** Every night at midnight — `0 0 * * *`

```
Logic:
  Query MongoDB for complaints where:
    status is NOT Resolved
    AND deadline < current date

  For each found complaint:
    Set status = Escalated
    Set isEscalated = true
    Set updatedAt = now

  Log: "Escalation job ran — X complaints escalated"
```

This runs completely automatically. No manual trigger needed. Admin sees escalated complaints on dashboard the next morning.

---

## 12. SECURITY IMPLEMENTATION

### 12.1 Helmet.js
Added in server.js — sets all HTTP security headers automatically:
- Hides Express version
- Prevents clickjacking
- Blocks MIME sniffing
- Sets content security policy

### 12.2 CORS
```
Only allow requests from ALLOWED_ORIGIN in .env
All other origins blocked with 403
```

### 12.3 Rate Limiting — Login Only
```
Max 5 login attempts per IP per 15 minutes
After 5 fails → locked for 15 minutes
Applied to POST /api/auth/login only
```

### 12.4 Password Security
```
Bcrypt salt rounds: 12
Password never stored plain
Password never returned in any response
User queries always use .select('-password')
```

### 12.5 JWT Security
```
Secret: minimum 64 character random string
Expiry: 7 days
Contains: userId + role + department only
Never contains sensitive data
```

### 12.6 Input Validation
```
All inputs validated with express-validator
HTML tags stripped from all text inputs
MongoDB ObjectId params validated before query
Unexpected fields silently dropped by Mongoose strict mode
```

### 12.7 Ownership Checks
```
Student can only access their own complaints
  → complaint.studentId === req.user._id

Staff can only access their department
  → complaint.assignedDept === req.user.assignedDept

Checked in controller — not just on frontend
```

### 12.8 File Security
```
MIME type whitelist: jpg/png/pdf only
Max size: 5MB
File never saved to server disk
Filename sanitized before ImageKit upload
```

---

## 13. ERROR RESPONSE FORMAT

Every error across the entire backend returns this exact format:

```json
{
  "success": false,
  "message": "Human readable message here",
  "statusCode": 400
}
```

### HTTP Status Codes Used

| Code | When Used |
|------|-----------|
| 200 | Success — data returned |
| 201 | Success — new resource created |
| 400 | Bad input — validation failed |
| 401 | Not logged in or token invalid |
| 403 | Logged in but wrong role or not your data |
| 404 | Resource not found |
| 500 | Unexpected server error |

---

## 14. SERVER SETUP — server.js

```
1. Load dotenv
2. Connect to MongoDB Atlas
3. Apply Helmet middleware
4. Apply CORS middleware with allowed origin
5. Apply body parser — limit 10kb
6. Mount all routes
7. Apply global error middleware (last)
8. Start escalation cron job
9. Listen on PORT
```

---

## 15. PACKAGES TO INSTALL

```bash
npm init -y

npm install express mongoose dotenv bcryptjs jsonwebtoken
npm install multer express-validator helmet cors express-rate-limit
npm install node-cron @imagekit/nodejs

npm install --save-dev nodemon
```

### package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 16. COMPLETE REQUEST FLOW — SUBMIT COMPLAINT

End to end example of what happens when a student submits a complaint:

```
Student clicks Submit in React
        ↓
React sends POST /api/complaints
Headers: { Authorization: Bearer <token> }
Body: FormData { title, description, category, priority, file }
        ↓
Helmet adds security headers
        ↓
CORS checks origin — allowed
        ↓
Body parser parses FormData
        ↓
authMiddleware:
  Extracts token from header
  Verifies JWT signature
  Finds user in MongoDB
  Attaches user to req.user
        ↓
roleMiddleware:
  Checks req.user.role === 'student'
  Passes
        ↓
express-validator:
  Checks title min 10 chars
  Checks description min 20 chars
  Checks category is valid enum
  Checks priority is Low or Medium
  If fails → 400 with field errors
        ↓
complaintController:
  Runs keyword engine → upgrades priority if needed
  Runs department mapper → gets assignedDept
  Runs deadline calculator → gets deadline date
  Multer reads file into memory
  File validated (type + size)
  File sent to ImageKit → gets URL back
  Creates complaint document in MongoDB
  Returns 201 with complaint object
        ↓
React receives response
Shows success toast
Redirects to complaint history
```

---

## 17. CHANGES FROM ORIGINAL DISCUSSION

| Change | Reason |
|--------|--------|
| Rate limiting on login only | Not needed on other routes for college scale |
| `@imagekit/nodejs` used instead of `imagekit` | New official SDK — only needs private key, cleaner API |
| Removed IMAGEKIT_PUBLIC_KEY and URL_ENDPOINT from .env | Not required by new SDK |
| Database name `Grievease` with capital G | Matches your Atlas setup |
| loginAttempts tracked in User model | Brute force protection without extra package |
| Comments collection separate from complaints | Cleaner schema, faster queries |
| 5 analytics queries run in parallel | Faster admin dashboard load |
| studentName denormalized in Complaint | Avoids extra User lookup on every complaint list |

---

*GrievEase Backend PRD v1.0 — Ready for Cursor*
