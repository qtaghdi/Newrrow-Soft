import React from 'react';
import { School, Zap, ChevronDown } from 'lucide-react';
import { Group } from '@/types/group';
import GroupCard from './GroupCard';

interface GroupSectionProps {
  title: string;
  groups: Group[];
  isShortTerm?: boolean;
  icon?: React.ReactNode;
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

const GroupSection = ({ 
  title, 
  groups, 
  isShortTerm = false, 
  icon, 
  sortOrder, 
  setSortOrder, 
  showDropdown, 
  setShowDropdown 
}: GroupSectionProps) => {
  if (groups.length === 0) return null;

  const defaultIcon = <School className="text-blue-600" size={20} />;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          {icon || defaultIcon}
          <span>{title}</span>
          <span className="text-sm text-gray-500">({groups.length}개)</span>
        </h2>
        
        {/* 정렬 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <span className="text-gray-700">
              {sortOrder === 'newest' ? '최신순' : '오래된순'}
            </span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setSortOrder('newest');
                  setShowDropdown(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  sortOrder === 'newest' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => {
                  setSortOrder('oldest');
                  setShowDropdown(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  sortOrder === 'oldest' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                오래된순
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {groups.map((group) => (
          <GroupCard 
            key={group.id} 
            group={group} 
            isShortTerm={isShortTerm}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupSection;