import Resume from '../models/Resume.js';
import { callAIService } from '../configs/ai.js';

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || userContent.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide content to enhance (minimum 10 characters)',
      });
    }

    const systemMessage = `You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 2-3 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return ONLY the improved text, no explanations.`;

    const prompt = `Original summary:\n${userContent}\n\nImproved professional summary:`;

    const improvedText = await callAIService(prompt, systemMessage);

    return res.status(200).json({
      success: true,
      improvedText,
    });
  } catch (error) {
    console.error('Error in enhanceProfessionalSummary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to enhance summary. Please try again.',
      error: error.message,
    });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent, jobTitle, company } = req.body;

    if (!userContent && (!jobTitle || !company)) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide either content to enhance or job title and company',
      });
    }

    const systemMessage = `You are an expert in resume writing. Your task is to enhance the job description of a resume. Create a compelling job description with 2-3 bullet points. Use action verbs, include quantifiable results where possible. Make it ATS-friendly. Return ONLY the bullet points, no explanations.`;

    let prompt;
    if (userContent) {
      prompt = `Original description:\n${userContent}\n\nImproved job description (2-3 bullet points):`;
    } else {
      prompt = `Job Title: ${jobTitle}\nCompany: ${company}\n\nGenerate a professional job description with 2-3 bullet points highlighting responsibilities and achievements:`;
    }

    const improvedText = await callAIService(prompt, systemMessage);

    return res.status(200).json({
      success: true,
      improvedText,
    });
  } catch (error) {
    console.error('Error in enhanceJobDescription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to enhance job description. Please try again.',
      error: error.message,
    });
  }
};

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({
        success: false,
        message: 'Resume text and title are required',
      });
    }

    const systemMessage = `You are an expert AI that extracts structured data from resumes.Return ONLY valid JSON, no additional text.`;

    const prompt = `Extract data from this resume and return it in the following JSON format:

{
  "professional_summary": "string",
  "personal_info": {
    "full_name": "string",
    "profession": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "start_date": "string",
      "end_date": "string",
      "description": "string",
      "is_current": false
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduation_date": "string",
      "gpa": "string"
    }
  ],
  "project": [
    {
      "name": "string",
      "type": "string",
      "description": "string"
    }
  ]
}

Resume text:
${resumeText}

Return only the JSON:`;

    const extractedData = await callAIService(prompt, systemMessage, 2000);

    let parsedData;
    try {
      let cleanedData = extractedData
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      if (!cleanedData.endsWith('}')) {
        console.log('JSON appears truncated, attempting to fix...');

        const openBraces = (cleanedData.match(/{/g) || []).length;
        const closeBraces = (cleanedData.match(/}/g) || []).length;
        const missingBraces = openBraces - closeBraces;

        for (let i = 0; i < missingBraces; i++) {
          cleanedData += '}';
        }
        console.log('Added', missingBraces, 'closing braces');
      }
      console.log('Cleaned data:', cleanedData.substring(0, 200) + '...');
      parsedData = JSON.parse(cleanedData);
      console.log('Successfully parsed JSON');
    } catch (parseError) {
      console.error('Failed to parse AI response:', extractedData);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse resume data. Please try uploading again.',
        error: parseError.message,
      });
    }

    const newResume = await Resume.create({
      userId,
      title,
      professional_summary: parsedData.professional_summary || '',
      personal_info: parsedData.personal_info || {},
      skills: parsedData.skills || [],
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      project: parsedData.project || [],
      template: 'classic',
      accent_color: '#3B82F6',
      public: false,
    });

    console.log('Resume created with ID:', newResume._id);

    return res.status(201).json({
      success: true,
      resumeId: newResume._id,
      message: 'Resume uploaded and parsed successfully',
    });
  } catch (error) {
    console.error('Error in uploadResume:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload resume. Please try again.',
      error: error.message,
    });
  }
};
