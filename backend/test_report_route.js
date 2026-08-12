import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.post('/api/reports/generate/:complaintId', (req, res) => {
      console.log('Test route called with complaintId:', req.params.complaintId);
      console.log('Request body:', req.body);

      res.status(200).json({
            success: true,
            message: 'Report route working',
            complaintId: req.params.complaintId,
            resolutionNotes: req.body.resolutionNotes
      });
});

// 404 handler
app.use('*', (req, res) => {
      res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`
      });
});

const PORT = 5003;
app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      console.log(`Test endpoint: POST http://localhost:${PORT}/api/reports/generate/123`);
});