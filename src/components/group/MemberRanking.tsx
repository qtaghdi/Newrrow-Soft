import React from 'react';
import { Trophy, Crown, Medal, User } from 'lucide-react';
import { GroupRanking } from '@/types/group';

interface MemberRankingProps {
  ranking: GroupRanking[];
}

const MemberRanking = ({ ranking }: MemberRankingProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <Trophy className="text-yellow-500" size={20} />
        <span>멤버 랭킹</span>
      </h2>
      
      <div className="space-y-3 max-h-50 overflow-y-auto">
        {ranking.map((item, index) => (
          <div key={item.member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8">
              {index === 0 ? (
                <Crown className="text-yellow-500" size={20} />
              ) : index === 1 ? (
                <Medal className="text-gray-400" size={20} />
              ) : index === 2 ? (
                <Medal className="text-orange-400" size={20} />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {index + 1}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.member.name}</p>
              <p className="text-xs text-gray-500">{item.member.class}</p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-blue-600">{item.member.points}pt</p>
              <p className="text-xs text-gray-500">완료 {item.member.completedQuests}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberRanking;