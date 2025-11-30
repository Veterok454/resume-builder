import api from '../configs/api.js';

//Enhance Professional Summary through backend
export const enhanceProfessionalSummary = async (userContent) => {
  try {
    const response = await api.post('/api/ai/enhance-pro-sum', {
      userContent,
    });

    return response.data.improvedText;
  } catch (error) {
    console.error('Error enhancing summary:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to enhance summary'
    );
  }
};

// Enhance Job Description through backend
export const enhanceJobDescription = async (
  userContent,
  jobTitle = '',
  company = ''
) => {
  try {
    const response = await api.post('/api/ai/enhance-job-desc', {
      userContent,
      jobTitle,
      company,
    });

    return response.data.improvedText;
  } catch (error) {
    console.error('Error enhancing job description:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to enhance job description'
    );
  }
};

// Upload Resume through backend
export const uploadResume = async (resumeText, title) => {
  try {
    const response = await api.post('/api/ai/upload-resume', {
      resumeText,
      title,
    });

    return response.data.resumeId;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload resume');
  }
};
