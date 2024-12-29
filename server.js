const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Save data endpoint
app.post('/admin/save', async (req, res) => {
    try {
        await fs.writeFile('data.json', JSON.stringify(req.body, null, 2));
        res.json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Upload image endpoint
app.post('/admin/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
        url: '/' + req.file.path.replace(/\\/g, '/'),
        filename: req.file.filename 
    });
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
