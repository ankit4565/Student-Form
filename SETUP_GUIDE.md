# Setup Guide - JPDB to MongoDB Migration

## Prerequisites

- **Node.js**: [Download](https://nodejs.org/) (v14 or higher)
- **MongoDB**: Either local or MongoDB Atlas (cloud)
- **Terminal/Command Line**

---

## Step 1: MongoDB Setup

### Option A: Local MongoDB (Easier for development)

**macOS:**

```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongo --version
```

**Windows/Linux:**

- Download from: https://www.mongodb.com/try/download/community
- Install and follow setup wizard
- MongoDB will run on `localhost:27017` by default

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (free tier available)
4. Create database user with password
5. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Update `.env` file with this connection string

---

## Step 2: Install Node Dependencies

```bash
cd /Users/ankitbowade/Student-Form

# Install all dependencies
npm install

# You should see:
# ✓ express
# ✓ mongodb
# ✓ cors
# ✓ dotenv
# ✓ nodemon
```

---

## Step 3: Configure Environment

Edit `.env` file in project root:

**For Local MongoDB:**

```
MONGODBURI=mongodb://localhost:27017
DBNAME=Std-DB
PORT=3000
```

**For MongoDB Atlas:**

```
MONGODBURI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DBNAME=Std-DB
PORT=3000
```

---

## Step 4: Run the Application

### Terminal 1 - Start Backend Server

```bash
cd /Users/ankitbowade/Student-Form
npm run dev

# Expected output:
# 📚 Student Form API Server
# 🚀 Running on: http://localhost:3000
# 📦 Database: Std-DB
# ✓ Connected to MongoDB
```

### Terminal 2 - Start Frontend Server

```bash
cd /Users/ankitbowade/Student-Form
python3 -m http.server 8000

# Expected output:
# Serving HTTP on 0.0.0.0 port 8000
```

Or use Node.js:

```bash
npx http-server
```

### Terminal 3 - Open Browser

Visit: **http://localhost:8000**

---

## Step 5: Test the Application

1. **Enter Roll Number**: Type a new roll number (e.g., "101")
   - If not found, you should see "Save" button enabled
2. **Fill Form**:
   - Name: Enter student name
   - Class: Enter class (e.g., "10A")
   - DOB: Select date
   - Address: Enter address
   - Enrollment Date: Select date

3. **Click Save**: Data should be saved to MongoDB
   - Should see: "Data saved successfully!"

4. **Search Existing**: Enter the same roll number again
   - Form should populate with saved data
   - "Update" button should be enabled

5. **Update Data**: Modify any field and click "Update"
   - Should see: "Data updated successfully!"

---

## File Structure

```
Student-Form/
├── index.html           # Frontend UI
├── script.js            # MongoDB API integration (updated)
├── server.js            # Express backend (new)
├── package.json         # Node dependencies (new)
├── .env                 # Configuration (new)
├── MIGRATION_PLAN.md    # This plan
└── README.md            # Original README
```

---

## API Endpoints Reference

```
GET  /api/student/:rollno      → Fetch student by roll number
POST /api/student              → Create new student
PUT  /api/student/:id          → Update existing student
DELETE /api/student/:id        → Delete student
GET  /api/health               → API health check
```

### Example API Calls

**Search Student:**

```bash
curl http://localhost:3000/api/student/101
```

**Create Student:**

```bash
curl -X POST http://localhost:3000/api/student \
  -H "Content-Type: application/json" \
  -d '{
    "rollno": "101",
    "name": "John Doe",
    "class": "10A",
    "dob": "2008-05-15",
    "enrolldate": "2023-06-01",
    "address": "123 Main Street"
  }'
```

---

## Troubleshooting

### "Cannot POST /api/student"

- ✓ Make sure backend server is running on port 3000
- ✓ Check Terminal 1 for `npm run dev` output

### "ECONNREFUSED: Connection refused"

- ✓ Backend server is not running
- ✓ Start with `npm run dev` in Terminal 1

### "MongoNetworkError: connect ECONNREFUSED"

- ✓ MongoDB is not running
- ✓ Start MongoDB: `brew services start mongodb-community@7.0`
- ✓ Or check MongoDB Atlas connection string in `.env`

### Data not saving

- ✓ Open browser DevTools (F12) → Console tab
- ✓ Check for error messages
- ✓ Verify MongoDB is running: `mongostat`

### "Port 3000 already in use"

- ✓ Change PORT in `.env` file
- ✓ Or kill process: `lsof -i :3000` then `kill -9 <PID>`

---

## MongoDB Atlas Setup (Detailed)

1. **Sign Up**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**:
   - Select free tier (M0)
   - Choose region closest to you
   - Click "Create Cluster"
3. **Set Database Access**:
   - Username: your_username
   - Password: your_password
   - Click "Add User"
4. **Network Access**:
   - Allow access from "0.0.0.0/0" (for development)
5. **Get Connection String**:
   - Click "Connect" → "Connect to Application"
   - Copy connection string
   - **Replace** `<username>` and `<password>` with your credentials
   - Add to `.env`: `MONGODBURI=mongodb+srv://...`

---

## Production Notes

For production deployment:

- Store `.env` secrets securely (use environment variables)
- Add input validation middleware
- Enable MongoDB authentication
- Use HTTPS instead of HTTP
- Add rate limiting
- Implement user authentication
- Add error logging

---

## Next Steps

After migration works successfully:

1. Add more features (pagination, search, export to CSV)
2. Add user authentication
3. Add form validation improvements
4. Deploy to cloud (Heroku, Azure, AWS)
5. Add testing with Jest/Mocha

---

**Questions?** Check browser DevTools Console (F12) for detailed error messages.
