const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const uploadDir = 'uploads';

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/files', express.static(uploadDir));

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    res.status(200).send('File uploaded successfully!');
});

// Endpoint to list all uploaded files
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            res.status(500).send('Unable to list files.');
            return;
        }
        const fileData = files.map(filename => ({
            _id: filename,
            filename: filename
        }));
        res.status(200).json(fileData);
    });
});

// Endpoint to delete a file
app.delete('/files/:id', (req, res) => {
    const filePath = path.join(uploadDir, req.params.id);
    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).send('File deletion failed.');
            return;
        }
        res.status(200).send('File deleted successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});