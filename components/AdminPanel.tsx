import React, { useState, useEffect } from 'react';
import { Job, JOB_CATEGORIES } from '../types';
import { addJob, getJobs, deleteJob } from '../services/jobService';
import { generateJobDescription } from '../services/geminiService';
import { Sparkles, Plus, Loader2, Trash2, List } from 'lucide-react';

interface AdminPanelProps {
  onJobAdded: () => void;
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onJobAdded, onExit }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    skills: '',
    description: '',
    type: 'Full-time' as Job['type'],
    category: 'IT & Software'
  });

  useEffect(() => {
    setAllJobs(getJobs());
  }, [activeTab]);

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.company || !formData.skills) {
      alert("Please fill in Job Title, Company, and Skills to generate a description.");
      return;
    }
    setLoading(true);
    const desc = await generateJobDescription(formData.title, formData.company, formData.skills);
    setFormData(prev => ({ ...prev, description: desc }));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Date.now().toString(),
      title: formData.title,
      company: formData.company,
      location: formData.location,
      salary: formData.salary,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      postedAt: new Date().toISOString()
    };
    addJob(newJob);
    onJobAdded();
    setFormData({
      title: '',
      company: '',
      location: '',
      salary: '',
      skills: '',
      description: '',
      type: 'Full-time',
      category: 'IT & Software'
    });
    alert("Job posted successfully!");
    setActiveTab('manage'); // Switch to manage view to see the new job
  };

  const handleDelete = (id: string) => {
    if(confirm("Permanently delete this job?")) {
      const updated = deleteJob(id);
      setAllJobs(updated);
      onJobAdded(); // Sync with parent
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">Manage jobs and monetization</p>
        </div>
        <button onClick={onExit} className="text-gray-500 hover:text-gray-700 bg-white px-4 py-2 rounded-lg border">Exit Admin</button>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
        >
          <Plus size={18} /> Post Job
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'manage' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
        >
          <List size={18} /> Manage All Jobs
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-gray-800 font-semibold">Create New Job Post</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. React Developer"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Tech Corp"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {JOB_CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Dhaka, Remote"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 50k - 80k BDT"
                  value={formData.salary}
                  onChange={e => setFormData({...formData, salary: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Required Skills <span className="text-xs font-normal text-blue-600">(Used for AI Generation)</span>
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                placeholder="e.g. React, Node.js, TypeScript"
                value={formData.skills}
                onChange={e => setFormData({...formData, skills: e.target.value})}
              />
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={loading}
                className="text-sm bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                Generate Description with Gemini AI
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                required
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Job details will appear here..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-gray-800 font-semibold">All Posted Jobs</h3>
            <span className="text-sm text-gray-500">Total: {allJobs.length}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {allJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No jobs found. Create one!</div>
            ) : (
              allJobs.map(job => (
                <div key={job.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-800">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company} • {job.category}</p>
                    <p className="text-xs text-gray-400">Posted: {new Date(job.postedAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};