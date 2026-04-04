#!/bin/bash

# Quick Start Script for Student Form with MongoDB

echo "📚 Student Form - MongoDB Setup"
echo "=================================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Check MongoDB connection
echo "🔍 Checking MongoDB connection..."
node -e "
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODBURI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
client.connect()
  .then(() => {
    console.log('✓ MongoDB is running and accessible');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Cannot connect to MongoDB');
    console.error('   Make sure MongoDB is running');
    console.error('   Or check .env file for correct connection string');
    process.exit(1);
  });
" --require dotenv/config 2>/dev/null || true

echo ""
echo "🚀 Ready to start!"
echo ""
echo "Run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  python3 -m http.server 8000"
echo ""
echo "Then open: http://localhost:8000"
echo ""
