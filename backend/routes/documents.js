const express = require('express');
// const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Upload general documents
// router.post('/upload', auth, upload, async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'No documents uploaded' 
//       });
//     }

//     // TODO: Save uploadedFiles info to database if needed
//     const uploadedFiles = req.files.map(file => ({
//       originalName: file.originalname,
//       filename: file.filename,
//       url: `/uploads/${file.filename}`,
//       size: file.size,
//       mimetype: file.mimetype,
//       uploadedAt: new Date(),
//       vendorId: req.vendorId
//     }));

//     // Example: If you have a Document model, you can save here
//     // await Document.insertMany(uploadedFiles);

//     res.json({
//       success: true,
//       data: uploadedFiles
//     });
//   } catch (error) {
//     console.error('Upload documents error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Server error' 
//     });
//   }
// });

// Get uploaded file
router.get('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Delete uploaded file
router.delete('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get upload directory info
// router.get('/info/uploads', auth, async (req, res) => {
//   try {
//     const uploadsDir = path.join(__dirname, '../uploads');
    
//     if (!fs.existsSync(uploadsDir)) {
//       return res.json({
//         success: true,
//         data: {
//           exists: false,
//           totalFiles: 0,
//           totalSize: 0
//         }
//       });
//     }

//     const files = fs.readdirSync(uploadsDir);
//     let totalSize = 0;

//     files.forEach(file => {
//       const filePath = path.join(uploadsDir, file);
//       const stats = fs.statSync(filePath);
//       totalSize += stats.size;
//     });

//     res.json({
//       success: true,
//       data: {
//         exists: true,
//         totalFiles: files.length,
//         totalSize,
//         totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
//       }
//     });
//   } catch (error) {
//     console.error('Get uploads info error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Server error' 
//     });
//   }
// });

// Clean up orphaned files (optional maintenance endpoint)
router.post('/cleanup', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        message: 'Uploads directory does not exist'
      });
    }

    const files = fs.readdirSync(uploadsDir);
    let deletedCount = 0;
    let deletedSize = 0;

    // This is a basic cleanup - in production you might want to check database references
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      // Delete files older than 30 days (example cleanup rule)
      const fileAge = Date.now() - stats.mtime.getTime();
      const daysOld = fileAge / (1000 * 60 * 60 * 24);
      
      if (daysOld > 30) {
        fs.unlinkSync(filePath);
        deletedCount++;
        deletedSize += stats.size;
      }
    }

    res.json({
      success: true,
      data: {
        deletedCount,
        deletedSize,
        deletedSizeMB: (deletedSize / (1024 * 1024)).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router; 