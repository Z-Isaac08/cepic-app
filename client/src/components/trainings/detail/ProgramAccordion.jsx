import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, CheckCircle, PlayCircle, FileText } from 'lucide-react';

const ProgramAccordion = ({ training }) => {
  const [openSections, setOpenSections] = useState([0]); // First section open by default

  const toggleSection = (index) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Parse program from training data
  const program = training.program || [];
  
  // If program is a string (JSON), parse it
  const parsedProgram = typeof program === 'string' 
    ? JSON.parse(program) 
    : program;

  if (!parsedProgram || parsedProgram.length === 0) {
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
        <p className="text-gray-600 mt-2">
          {parsedProgram.length} module{parsedProgram.length > 1 ? 's' : ''} • 
          {parsedProgram.reduce((acc, module) => acc + (module.lessons?.length || 0), 0)} leçons
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {parsedProgram.map((module, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0">
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1 text-left">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-800 font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {module.title}
                  </h3>
                  {module.duration && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{module.duration}</span>
                      {module.lessons && (
                        <span className="ml-3">
                          • {module.lessons.length} leçon{module.lessons.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ rotate: openSections.includes(index) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openSections.includes(index) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 bg-gray-50">
                    {module.description && (
                      <p className="text-gray-700 mb-4 pl-14">
                        {module.description}
                      </p>
                    )}
                    
                    {module.lessons && module.lessons.length > 0 && (
                      <ul className="space-y-2 pl-14">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              {lesson.type === 'video' ? (
                                <PlayCircle className="w-4 h-4 text-primary-600" />
                              ) : lesson.type === 'quiz' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-900">{lesson.title}</span>
                                {lesson.duration && (
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                )}
                              </div>
                              {lesson.isFree && (
                                <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Aperçu gratuit
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {module.objectives && module.objectives.length > 0 && (
                      <div className="mt-4 pl-14">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Objectifs du module :
                        </h4>
                        <ul className="space-y-1">
                          {module.objectives.map((objective, objIndex) => (
                            <li key={objIndex} className="flex items-start text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramAccordion;
