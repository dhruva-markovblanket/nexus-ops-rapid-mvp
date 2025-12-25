import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, X, CheckCircle } from 'lucide-react';
import { Batch } from '../types';

interface MarksUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (batchId: string, subject: string, data: any) => void;
  batches: Batch[];
}

const MarksUploadModal: React.FC<MarksUploadModalProps> = ({ isOpen, onClose, onUpload, batches }) => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('MID_TERM');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    if (!selectedBatch || !subject) return;

    setIsUploading(true);
    // Simulate network delay for upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('success');
      
      // Simulate data being parsed
      onUpload(selectedBatch, subject, { examType });

      // Close after a brief success message
      setTimeout(() => {
        onClose();
        setUploadStatus('idle');
        setSelectedBatch('');
        setSubject('');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-green-600 text-white">
          <h2 className="text-lg font-bold flex items-center">
             <FileSpreadsheet className="w-5 h-5 mr-2" />
             Upload Academic Marks
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start">
                <AlertCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                    Upload Excel (.xlsx) or CSV files containing student IDs and marks. The system will automatically link them to the selected batch.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
                    <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option value="">-- Select Batch --</option>
                        {batches.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.course})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="e.g. Data Structures"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                    <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                    >
                        <option value="MID_TERM">Mid Term</option>
                        <option value="FINAL">Final Exam</option>
                    </select>
                </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">Click to browse or drag file here</p>
                <p className="text-xs text-gray-400 mt-1">Supports .xlsx, .csv (Max 5MB)</p>
            </div>

            <button 
                onClick={handleSimulateUpload}
                disabled={!selectedBatch || !subject || isUploading || uploadStatus === 'success'}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center ${
                    uploadStatus === 'success' ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isUploading ? (
                    'Processing...'
                ) : uploadStatus === 'success' ? (
                    <>
                        <CheckCircle className="w-5 h-5 mr-2" /> Upload Complete
                    </>
                ) : (
                    'Upload & Process Marks'
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default MarksUploadModal;