import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GROQ_API_KEY',
  'IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'IMAGEKIT_URL_ENDPOINT',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  process.exit(1);
}
console.log('All environment variables are set');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB();

app.use(express.json());
const corsOptions = {
  origin: ['https://resume-builder-2icz.onrender.com', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => res.send('Server is live...'));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
