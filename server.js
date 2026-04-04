const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'Std-DB';
const COLLECTION_NAME = 'StdData';

let db;
let studentsCollection;

const connectDB = async () => {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        studentsCollection = db.collection(COLLECTION_NAME);
        
        // Create unique index on rollno
        await studentsCollection.createIndex({ rollno: 1 }, { unique: true });
        
        console.log('✓ Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Routes

// GET - Fetch student by roll number
app.get('/api/student/:rollno', async (req, res) => {
    try {
        const { rollno } = req.params;
        const student = await studentsCollection.findOne({ rollno });
        
        if (!student) {
            return res.status(404).json({ status: 404, message: 'Student not found' });
        }
        
        res.json({ 
            status: 200, 
            data: student 
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
});

// POST - Create new student
app.post('/api/student', async (req, res) => {
    try {
        const { rollno, name, class: stdClass, dob, enrolldate, address } = req.body;
        
        // Validation
        if (!rollno || !name || !stdClass || !dob || !enrolldate || !address) {
            return res.status(400).json({ status: 400, message: 'Missing required fields' });
        }
        
        // Check if student already exists
        const existing = await studentsCollection.findOne({ rollno });
        if (existing) {
            return res.status(409).json({ status: 409, message: 'Roll number already exists' });
        }
        
        const studentData = {
            rollno,
            name,
            class: stdClass,
            dob: new Date(dob),
            enrolldate: new Date(enrolldate),
            address,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await studentsCollection.insertOne(studentData);
        
        res.status(201).json({ 
            status: 200, 
            message: 'Student created successfully',
            rec_no: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
});

// PUT - Update existing student
app.put('/api/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rollno, name, class: stdClass, dob, enrolldate, address } = req.body;
        
        // Validation
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ status: 400, message: 'Invalid student ID' });
        }
        
        const updateData = {
            ...(rollno && { rollno }),
            ...(name && { name }),
            ...(stdClass && { class: stdClass }),
            ...(dob && { dob: new Date(dob) }),
            ...(enrolldate && { enrolldate: new Date(enrolldate) }),
            ...(address && { address }),
            updatedAt: new Date()
        };
        
        const result = await studentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ status: 404, message: 'Student not found' });
        }
        
        res.json({ 
            status: 200, 
            message: 'Student updated successfully'
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
});

// DELETE - Delete student (optional endpoint)
app.delete('/api/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ status: 400, message: 'Invalid student ID' });
        }
        
        const result = await studentsCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ status: 404, message: 'Student not found' });
        }
        
        res.json({ 
            status: 200, 
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n📚 Student Form API Server`);
        console.log(`🚀 Running on: http://localhost:${PORT}`);
        console.log(`📦 Database: ${DB_NAME}`);
        console.log(`\nEndpoints:`);
        console.log(`  GET    /api/student/:rollno`);
        console.log(`  POST   /api/student`);
        console.log(`  PUT    /api/student/:id`);
        console.log(`  DELETE /api/student/:id`);
        console.log(`  GET    /api/health\n`);
    });
});
