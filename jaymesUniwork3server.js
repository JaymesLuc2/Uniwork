const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'jaymesUniwork3.html'));
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// GitHub credentials
const GITHUB_TOKEN = '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'; // Provided GitHub token
const REPO_OWNER = 'JaymesLuc2';
const REPO_NAME = 'Uniwork';

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    const { file } = req;
    const { assignmentNumber } = req.body;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, file.path);
    const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

    const fileName = `assignment-${assignmentNumber}-${file.originalname}`;

    try {
        const response = await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`,
            {
                message: `Add ${fileName} for assignment ${assignmentNumber}`,
                content: fileContent
            },
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        fs.unlinkSync(filePath); // Delete the file from the server after upload
        const fileUrl = response.data.content.html_url;
        res.send({ message: 'File uploaded successfully.', fileUrl });
    } catch (error) {
        console.error('Failed to upload file:', error.response.data);
        res.status(500).send(`Failed to upload file: ${error.response.data.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
