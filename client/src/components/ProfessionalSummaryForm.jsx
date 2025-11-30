import { Sparkles } from 'lucide-react';
import Reactб, { useState } from 'react';
import { enhanceProfessionalSummary } from '../services/aiService';

const ProfessionalSummaryForm = ({ data, onChange }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState(null);

  const handleAIEnhance = async () => {
    if (!data || data.trim().length < 10) {
      setError('Please write at least a few sentences first.');
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const enhanced = await enhanceProfessionalSummary(data);
      onChange(enhanced);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Professional Summary
          </h3>
          <p className='text-sm text-gray-500'>
            Add summary for your resume here
          </p>
        </div>
        <button
          onClick={handleAIEnhance}
          disabled={isEnhancing || !data || data.trim().length < 10}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Sparkles className={`size-4 ${isEnhancing ? 'animate-spin' : ''}`} />
          {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
          {error}
        </div>
      )}

      <div className='mt-6'>
        <textarea
          value={data || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setError(null);
          }}
          rows={7}
          className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none'
          placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
        />
        <p className='text-xs text-gray-500 max-w-[80%] mx-auto text-center'>
          Tip: Keep it concise (2-3 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
