const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from backend/.env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Reads from .env (e.g. MONGO_URI or MONGODB_URI), or fallback to your URI string
const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb+srv://ridifybms_db_user:<YOUR_PASSWORD>@ridify.9fvjbdy.mongodb.net/test?retryWrites=true&w=majority';

async function runTest() {
    console.log('🔄 Connecting to MongoDB...');

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected successfully to MongoDB!\n');

        // 2. Define a dummy schema
        const DummySchema = new mongoose.Schema({
            name: { type: String, required: true },
            message: { type: String, default: 'Connection test' },
            createdAt: { type: Date, default: Date.now }
        });

        // 3. Create a model
        const DummyModel =
            mongoose.models.TestDummy || mongoose.model('TestDummy', DummySchema);

        // 4. Write/Create a sample document
        console.log('📝 Writing sample document to database...');
        const createdDoc = await DummyModel.create({
            name: 'TestItem_' + Date.now(),
            message: 'Hello MongoDB! Schema write is working!'
        });
        console.log('✅ Document created successfully:');
        console.log({ id: createdDoc._id, name: createdDoc.name });

        // 5. Read/Retrieve the sample document back
        console.log('\n🔍 Reading the document back from database...');
        const fetchedDoc = await DummyModel.findById(createdDoc._id);
        console.log('✅ Document retrieved:');
        console.log(fetchedDoc.toObject());

        // 6. Cleanup (delete the test record so it doesn't clutter your DB)
        console.log('\n🧹 Cleaning up test document...');
        await DummyModel.findByIdAndDelete(createdDoc._id);
        console.log('✅ Cleaned up successfully.');

        console.log('\n🎉 ALL TESTS PASSED! Connection, Write, Read, and Cleanup succeeded.');
    } catch (error) {
        console.error('\n❌ MongoDB Test Failed:', error.message);
        if (error.message.includes('bad auth')) {
            console.error('👉 Hint: Check your username and password.');
        } else if (error.message.includes('whitelist') || error.name === 'MongooseServerSelectionError') {
            console.error('👉 Hint: Ensure your current IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0 for anywhere).');
        }
    } finally {
        // 7. Always close the connection
        await mongoose.connection.close();
        console.log('🔌 Connection closed.');
    }
}

runTest();
