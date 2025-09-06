import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { GroupRanking } from '@/types/group';

interface ContributionChartProps {
  ranking: GroupRanking[];
  contributionPeriod: 'daily' | 'weekly' | 'total';
  setContributionPeriod: (period: 'daily' | 'weekly' | 'total') => void;
}

const ContributionChart = ({ ranking, contributionPeriod, setContributionPeriod }: ContributionChartProps) => {
  const getChartData = () => {
    return ranking.slice(0, 5).map(item => ({
      name: item.member.name,
      points: contributionPeriod === 'weekly' ? item.pointsThisWeek : 
              contributionPeriod === 'daily' ? Math.floor(item.pointsThisWeek / 7) :
              item.member.points,
      quests: contributionPeriod === 'weekly' ? item.questsCompletedThisWeek : 
              contributionPeriod === 'daily' ? Math.floor(item.questsCompletedThisWeek / 7) :
              item.member.completedQuests
    }));
  };

  const chartData = getChartData();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <BarChart3 className="text-purple-500" size={20} />
          <span>기여도</span>
        </h2>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setContributionPeriod('daily')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              contributionPeriod === 'daily'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            일별
          </button>
          <button
            onClick={() => setContributionPeriod('weekly')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              contributionPeriod === 'weekly'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            주별
          </button>
          <button
            onClick={() => setContributionPeriod('total')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              contributionPeriod === 'total'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            총합
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              height={40}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [
                value, 
                name === 'points' ? '포인트' : '완료 퀘스트'
              ]}
              labelFormatter={(label) => `${label} 님`}
            />
            <Bar dataKey="points" fill="#3B82F6" name="points" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 기여도 요약 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">
                {contributionPeriod === 'weekly' ? '이번 주' : 
                 contributionPeriod === 'daily' ? '오늘' : '전체'}
              </span>
            </div>
            <p className="text-xs text-blue-700">
              총 {chartData.reduce((sum, item) => sum + item.points, 0)}pt 획득
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
              <Target size={16} />
              <span className="text-sm font-medium">완료</span>
            </div>
            <p className="text-xs text-green-700">
              {chartData.reduce((sum, item) => sum + item.quests, 0)}개 퀘스트
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionChart;