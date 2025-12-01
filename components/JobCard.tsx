import React from 'react';
import { Job } from '../types';
import { MapPin, Building2, Clock, Briefcase, Lock, Tag } from 'lucide-react';

interface JobCardProps {
  job: Job;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onViewDetails?: (job: Job) => void;
  onUnlockSalary?: (job: Job) => void; // Trigger Rewarded Ad
  isSalaryUnlocked?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  isAdmin, 
  onDelete, 
  onViewDetails,
  onUnlockSalary,
  isSalaryUnlocked = false 
}) => {
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5 flex flex-col gap-4 relative overflow-hidden">
      {/* Category Tag */}
      <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-bl-lg font-mono">
        {job.category}
      </div>

      <div className="flex justify-between items-start mt-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <div className="flex items-center text-gray-600 gap-2 mt-1">
            <Building2 size={16} />
            <span className="text-sm font-medium">{job.company}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
          job.type === 'Full-time' ? 'bg-green-100 text-green-700' :
          job.type === 'Part-time' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {job.type}
        </span>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          {isAdmin || isSalaryUnlocked ? (
             <span className="font-semibold text-gray-800">{job.salary}</span>
          ) : (
            <button 
              onClick={() => onUnlockSalary && onUnlockSalary(job)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              <Lock size={14} />
              <span>Watch Ad to Unlock Salary</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">
        {job.description}
      </p>

      <div className="flex gap-3 mt-auto pt-2">
        {isAdmin ? (
          <button 
            onClick={() => onDelete && onDelete(job.id)}
            className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Delete Job
          </button>
        ) : (
          <button 
            onClick={() => onViewDetails && onViewDetails(job)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};