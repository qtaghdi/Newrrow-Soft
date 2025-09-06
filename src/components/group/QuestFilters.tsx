import React from 'react';
import { Quest } from '@/types/group';

interface QuestFiltersProps {
  questFilter: 'all' | 'personal' | 'group' | 'completed';
  setQuestFilter: (filter: 'all' | 'personal' | 'group' | 'completed') => void;
  quests: Quest[];
}

const QuestFilters = ({ questFilter, setQuestFilter, quests }: QuestFiltersProps) => {
  const filterButtons = [
    {
      key: 'all',
      label: '전체',
      count: quests.length,
      color: 'blue'
    },
    {
      key: 'personal',
      label: '개인',
      count: quests.filter(q => q.type === 'personal').length,
      color: 'green'
    },
    {
      key: 'group',
      label: '단체',
      count: quests.filter(q => q.type === 'group').length,
      color: 'purple'
    },
    {
      key: 'completed',
      label: '완료됨',
      count: quests.filter(q => q.status === 'completed' || q.isCompleted).length,
      color: 'gray'
    }
  ] as const;

  return (
    <div className="flex space-x-2 mb-4">
      {filterButtons.map((button) => (
        <button
          key={button.key}
          onClick={() => setQuestFilter(button.key)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            questFilter === button.key
              ? button.color === 'blue' ? 'bg-blue-500 text-white' :
                button.color === 'green' ? 'bg-green-500 text-white' :
                button.color === 'purple' ? 'bg-purple-500 text-white' :
                'bg-gray-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {button.label} ({button.count})
        </button>
      ))}
    </div>
  );
};

export default QuestFilters;