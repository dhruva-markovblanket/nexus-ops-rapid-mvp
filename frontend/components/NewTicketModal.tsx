import React, { useState } from 'react';
import { TicketPriority, Ticket } from '../types';
import { X, Sparkles, Loader2, Upload, AlertTriangle, Building2, Book, FileText } from 'lucide-react';
import { analyzeTicketDescription } from '../services/analysisService';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Ticket>) => void;
  userId: string;
  userName: string;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onSubmit, userId, userName }) => {
  const [issueType, setIssueType] = useState('Infrastructure');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<TicketPriority>(TicketPriority.LOW);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{priority: string, category: string, summary: string} | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!description) return;
    setIsAnalyzing(true);
    // Include issueType in the context for the AI
    const result = await analyzeTicketDescription(description, location || 'Not specified', issueType);
    setAnalysis({
        priority: result.priority,
        category: result.category,
        summary: result.summary
    });
    // Auto-update severity if AI suggests it
    setSeverity(result.priority as TicketPriority);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      location,
      priority: severity,
      category: issueType, // Using Issue Type as the primary category grouping
      createdBy: userId,
      createdByName: userName,
      aiAnalysis: analysis ? `${analysis.category} - ${analysis.summary}` : undefined,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300` // Mock image
    });
    // Reset
    setTitle('');
    setDescription('');
    setLocation('');
    setIssueType('Infrastructure');
    setSeverity(TicketPriority.LOW);
    setAnalysis(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Report an Issue</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Issue Type Selection */}
          <div className="grid grid-cols-3 gap-3">
             {[
                 { id: 'Infrastructure', label: 'Infra', icon: Building2 },
                 { id: 'Academic', label: 'Academic', icon: Book },
                 { id: 'Administrative', label: 'Admin', icon: FileText }
             ].map(type => {
                 const Icon = type.icon;
                 const isSelected = issueType === type.id;
                 return (
                     <button
                        key={type.id}
                        type="button"
                        onClick={() => setIssueType(type.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                            isSelected 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                     >
                         <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                         <span className="text-xs font-semibold">{type.label}</span>
                     </button>
                 )
             })}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
              placeholder={issueType === 'Academic' ? "e.g., Missing marks for Physics IA-1" : "e.g., Broken projector in Room 101"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                 <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as TicketPriority)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                 >
                     <option value={TicketPriority.LOW}>Low</option>
                     <option value={TicketPriority.MEDIUM}>Medium</option>
                     <option value={TicketPriority.HIGH}>High</option>
                 </select>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Location / Context</label>
                 <input 
                  type="text" 
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={issueType === 'Academic' ? "e.g., Semester 3, Section A" : "e.g., Library 2nd Floor"}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-none"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                <div className="w-full px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 mr-2" /> 
                    {issueType === 'Infrastructure' ? 'Upload Photo' : 'Upload Document'}
                </div>
          </div>

          {/* AI Analysis Section */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-indigo-900 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                    AI Assistant
                </span>
                <button 
                    type="button"
                    onClick={handleAnalyze}
                    disabled={!description || isAnalyzing}
                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
                >
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    {isAnalyzing ? 'Analyzing...' : 'Suggest Actions'}
                </button>
             </div>
             
             {analysis ? (
                 <div className="text-sm text-indigo-800 space-y-1">
                     <p><span className="font-medium">Analysis:</span> {analysis.category}</p>
                     <p><span className="font-medium">Recommended Severity:</span> {analysis.priority}</p>
                 </div>
             ) : (
                 <p className="text-xs text-indigo-600/70">
                     Describe your issue and let AI help categorize and prioritize it for faster resolution.
                 </p>
             )}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketModal;