import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ProgramAccordion = ({ training }) => {
  // Get program from training data
  const program = training.program || '';

  if (!program) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Programme détaillé à venir</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Programme de la formation</h2>
      </div>

      <div className="p-6">
        <div className="prose max-w-none">
          <ReactMarkdown>{program}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ProgramAccordion;
