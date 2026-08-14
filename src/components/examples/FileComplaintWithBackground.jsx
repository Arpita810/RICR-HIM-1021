import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DepartmentBackground from '../DepartmentBackground';

/**
 * Example: File Complaint Page with Department Background
 * 
 * Shows how to integrate DepartmentBackground component with a complaint form.
 * Background changes dynamically based on selected department.
 */

export default function FileComplaintWithBackground() {
  const { t } = useTranslation();
  const [selectedDept, setSelectedDept] = useState('roads_transport');

  const departments = [
    { value: 'roads_transport', label: '🚗 Roads & Transport' },
    { value: 'electricity', label: '⚡ Electricity' },
    { value: 'water_supply', label: '💧 Water Supply' },
    { value: 'sanitation', label: '🗑️ Sanitation' },
    { value: 'drainage', label: '🌊 Drainage' },
    { value: 'public_property', label: '🏗️ Public Property' },
    { value: 'streetlight', label: '💡 Streetlight' },
    { value: 'illegal_dumping', label: '🚫 Illegal Dumping' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Section with Form Overlay */}
      <DepartmentBackground
        department={selectedDept}
        height="h-96"
        blur="md"
        darkening="45"
      >
        {/* Form Content Overlay */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-xl w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
              
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  {t('complaintForm.title') || 'File a Complaint'}
                </h1>
                <p className="text-gray-600">
                  {t('complaintForm.subtitle') || 'Help us improve your city'}
                </p>
              </div>

              {/* Department Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('form.category') || 'Category'}
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
                >
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('form.title') || 'Complaint Title'}
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('form.description') || 'Details'}
                </label>
                <textarea
                  rows="4"
                  placeholder="Provide detailed information about the issue..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg transition transform hover:scale-[1.02]">
                {t('form.submit') || 'Submit Complaint'}
              </button>
            </div>
          </div>
        </div>
      </DepartmentBackground>

      {/* Info Section Below Background */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-bold text-lg mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Simple form to describe your issue with visual context
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-violet-500">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-bold text-lg mb-2">Location Based</h3>
            <p className="text-gray-600 text-sm">
              Department-specific backgrounds show relevant issues
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-emerald-500">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-bold text-lg mb-2">Fast Resolution</h3>
            <p className="text-gray-600 text-sm">
              AI-powered routing ensures your complaint reaches the right team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
