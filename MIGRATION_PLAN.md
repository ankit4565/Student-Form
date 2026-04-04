# JPDB to MongoDB Migration Plan

## Overview

Migrate the Student Enrollment Form from JPDB API to MongoDB with Node.js/Express backend.

## Architecture

```
Frontend (HTML/JS)
    ↓ HTTP Requests
Backend (Express.js)
    ↓ Database Operations
MongoDB (Local or Atlas)
```

## Complete Setup Steps

### Phase 1: Backend Setup

#### 1.1 Initialize Node.js Project

```bash
cd /Users/ankitbowade/Student-Form
npm init -y
npm install express mongodb cors dotenv
npm install --save-dev nodemon
```

#### 1.2 Update package.json scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

#### 1.3 Create `.env` file

```
MONGODBURI=mongodb://localhost:27017
DBNAME=Std-DB
PORT=3000
```

#### 1.4 Create backend server file (`server.js`)

- Implements REST API endpoints for CRUD operations
- Connects to MongoDB
- Handles validation and error responses

### Phase 2: Frontend Updates

#### 2.1 Update `script.js`

- Replace JPDB API calls with MongoDB API calls
- Remove JPDB library dependencies
- Update all fetch requests to use new backend endpoints

#### 2.2 Update `index.html`

- Remove JPDB script tag
- Keep jQuery (already used)
- Add proper error handling

### Phase 3: Database Setup

#### Option A: Local MongoDB

- Download MongoDB Community Server
- Run MongoDB locally on port 27017

#### Option B: MongoDB Atlas (Cloud)

- Create free cluster at MongoDB Atlas
- Get connection string
- Update `.env` with connection URI

### Phase 4: Testing

- Start backend server (`npm run dev`)
- Open frontend on local server (`python3 -m http.server 8000`)
- Test all CRUD operations

## Files to Create/Modify

**New Files:**

- ✅ `server.js` - Express backend
- ✅ `package.json` - Node dependencies
- ✅ `.env` - Configuration

**Modified Files:**

- ✅ `script.js` - Frontend API integration
- ✅ `index.html` - Remove JPDB library

## API Endpoints

```
GET  /api/student/:rollno      - Fetch by roll number
POST /api/student              - Create new student
PUT  /api/student/:id          - Update existing student
DELETE /api/student/:id        - Delete student (optional)
```

## Database Schema

```javascript
{
  _id: ObjectId,
  rollno: String (unique),
  name: String,
  class: String,
  dob: Date,
  enrolldate: Date,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Running the Application

**Terminal 1 - Backend:**

```bash
npm run dev
# Output: Server running on port 3000
```

**Terminal 2 - Frontend Server:**

```bash
python3 -m http.server 8000
# Open: http://localhost:8000
```

## Next Steps

1. Create `server.js` with all endpoints
2. Update `script.js` with API calls
3. Setup MongoDB (local or Atlas)
4. Test the complete flow
