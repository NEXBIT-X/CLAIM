'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield
} from "lucide-react";
interface Member {
  id: string;
  name: string;
  email: string;
}

export default function Protect() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    PatentName: '',
    dateOfCommence: '',
    description: '',
    acknowledgment: false,
  });
  
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '', email: '' }
  ]);
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: '',
      email: ''
    };
    setMembers(prev => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const updateMember = (id: string, field: 'name' | 'email', value: string) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // You can add actual submission logic here
      alert('Patent protection request submitted successfully!');
      router.push('/dashboard');
    }, 2000);
  };

  const isFormValid = formData.PatentName && 
                     formData.dateOfCommence && 
                     formData.description && 
                     formData.acknowledgment &&
                     members.every(member => member.name && member.email);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="card backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 bg-card 0 p-8">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">Protect New Pattent </h1>
          <p className="text-xl md:text-2xl font-light">
            Secure your design Patents, algorithms, and innovative solutions with blockchain technology
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patent Name */}
          <div className="card backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <label htmlFor="PatentName" className="block text-lg font-semibold mb-3">
              Patent Name *
            </label>
            <input
              type="text"
              id="PatentName"
              name="PatentName"
              value={formData.PatentName}
              onChange={handleInputChange}
              className="w-full p-4 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="e.g., Advanced ML Algorithm Patent, UI/UX Design System, Data Structure Patent"
              required
            />
          </div>

          {/* Date of Commence */}
          <div className="card backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <label htmlFor="dateOfCommence" className="block text-lg font-semibold mb-3">
              Patent Creation Date *
            </label>
            <input
              type="date"
              id="dateOfCommence"
              name="dateOfCommence"
              value={formData.dateOfCommence}
              onChange={handleInputChange}
              className="w-full p-4 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Members */}
          <div className="card backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-lg font-semibold">
                Patent Contributors *
              </label>
              <button
                type="button"
                onClick={addMember}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-white text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Contributor
              </button>
            </div>
            
            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={member.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                      className="w-full p-3 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Contributor name"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                        className="w-full p-3 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="contributor@email.com"
                        required
                      />
                    </div>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="mt-7 bg-red-600 hover:bg-red-500 px-3 py-3 rounded-lg transition-all duration-300 text-white"
                        title="Remove member"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <label htmlFor="description" className="block text-lg font-semibold mb-3">
              Description of Patent *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full p-4 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none transition-colors resize-vertical"
              placeholder="Describe your Patent in detail: methodology, structure, algorithm logic, design principles, implementation approach, unique features, and innovative aspects that make this Patent valuable..."
              required
            />
          </div>

          {/* File Upload */}
          <div className="card backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <label className="block text-lg font-semibold mb-3">
              Upload Patent Documentation
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-lg mb-2">Upload Patent diagrams, code samples, or documentation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">PDF, DOC, TXT, Images up to 10MB each</p>
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">�</span>
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                    title='Remove file'
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acknowledgment */}
          <div className="card backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="acknowledgment"
                name="acknowledgment"
                checked={formData.acknowledgment}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="acknowledgment" className="text-sm leading-relaxed">
                <span className="font-semibold">Acknowledgment *</span>
                <br />
                I acknowledge that by submitting this form, I am creating a tamper-proof, 
                timestamped record on the blockchain. I understand that this is not a legal 
                patent but serves as proof of conception and ownership. I confirm that the 
                information provided is accurate and that I have the right to protect this Patent.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
                isFormValid && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 text-white shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Protect My Patent'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
