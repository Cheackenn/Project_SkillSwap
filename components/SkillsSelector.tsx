'use client';

import { useState, useRef, useEffect } from 'react';

const PREDEFINED_SKILLS = [
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Graphic Design',
  'Digital Marketing',
  'Content Writing',
  'Video Editing',
  'Photography',
  'Music Production',
  'Language Teaching',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Cooking',
  'Fitness Training',
  'Yoga',
];

interface SkillsSelectorProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

export default function SkillsSelector({ 
  selectedSkills, 
  onChange, 
  placeholder = 'Select or add skills' 
}: SkillsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomInput(false);
        setCustomSkill('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(s => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      onChange([...selectedSkills, trimmed]);
      setCustomSkill('');
      setShowCustomInput(false);
    }
  };

  const removeSkill = (skill: string) => {
    onChange(selectedSkills.filter(s => s !== skill));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Skills Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] px-4 py-2 rounded-lg bg-[#2d3f47] text-white border border-[#3a4f5a] focus:outline-none focus:border-[#5fa4c3] cursor-pointer"
      >
        {selectedSkills.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 bg-[#5fa4c3] text-white text-sm px-2 py-1 rounded-full"
              >
                {skill}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(skill);
                  }}
                  className="hover:bg-[#4a8fb5] rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#2d3f47] border border-[#3a4f5a] rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {/* Predefined Skills */}
          <div className="p-2">
            {PREDEFINED_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-[#1a2c36] transition-colors flex items-center justify-between ${
                  selectedSkills.includes(skill) ? 'bg-[#1a2c36]' : ''
                }`}
              >
                <span className="text-white text-sm">{skill}</span>
                {selectedSkills.includes(skill) && (
                  <svg className="w-4 h-4 text-[#5fa4c3]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Custom Skill Input */}
          <div className="border-t border-[#3a4f5a] p-2">
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-left px-3 py-2 rounded hover:bg-[#1a2c36] transition-colors text-[#5fa4c3] text-sm font-medium"
              >
                + Add custom skill
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  placeholder="Enter skill name"
                  className="flex-1 px-3 py-2 rounded bg-[#1a2c36] text-white text-sm border border-[#3a4f5a] focus:outline-none focus:border-[#5fa4c3]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-3 py-2 bg-[#5fa4c3] text-white rounded hover:bg-[#4a8fb5] transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
