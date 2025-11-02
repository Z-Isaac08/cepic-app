import { motion } from 'framer-motion';
import { Star, Award, Users, BookOpen, Mail, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router';

const InstructorCard = ({ training }) => {
  const instructor = training.creator || training.instructor;

  if (!instructor) {
    return null;
  }

  // Mock data for instructor stats (you can add these to your backend later)
  const stats = {
    students: instructor.totalStudents || 0,
    courses: instructor.totalCourses || 0,
    rating: instructor.averageRating || 0,
    reviews: instructor.totalReviews || 0
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Votre formateur</h3>
        
        <div className="flex items-start space-x-4 mb-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {instructor.avatar ? (
              <img
                src={instructor.avatar}
                alt={`${instructor.firstName} ${instructor.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-xl font-bold">
                {instructor.firstName?.[0]}{instructor.lastName?.[0]}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900">
              {instructor.firstName} {instructor.lastName}
            </h4>
            {instructor.title && (
              <p className="text-sm text-gray-600">{instructor.title}</p>
            )}
            {stats.rating > 0 && (
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-semibold text-gray-900">
                  {stats.rating.toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  ({stats.reviews} avis)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {instructor.bio && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-4">
            {instructor.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-primary-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {stats.students.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Étudiants</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-primary-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {stats.courses}
            </div>
            <div className="text-xs text-gray-600">Formations</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="w-4 h-4 text-primary-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {stats.rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Note</div>
          </div>
        </div>

        {/* Expertise */}
        {instructor.expertise && instructor.expertise.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-gray-900 mb-2">Expertise</h5>
            <div className="flex flex-wrap gap-2">
              {instructor.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 text-primary-800 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(instructor.email || instructor.linkedin || instructor.twitter) && (
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            {instructor.email && (
              <a
                href={`mailto:${instructor.email}`}
                className="p-2 text-gray-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
            {instructor.linkedin && (
              <a
                href={instructor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {instructor.twitter && (
              <a
                href={instructor.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        )}

        {/* View Profile Link */}
        <Link
          to={`/instructors/${instructor.id}`}
          className="block mt-4 text-center py-2 text-sm font-medium text-primary-800 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
        >
          Voir le profil complet
        </Link>
      </div>
    </motion.div>
  );
};

export default InstructorCard;
