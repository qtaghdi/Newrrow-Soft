import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Quest } from '@/types/group';

interface AIQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (form: AIQuestForm) => void;
  onSave: () => void;
  generatedQuests: Quest[];
  setGeneratedQuests: (quests: Quest[]) => void;
  aiLoading: boolean;
}

interface AIQuestForm {
  type: 'personal' | 'group';
  theme: string;
  count: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const AIQuestModal = ({
  isOpen,
  onClose,
  onGenerate,
  onSave,
  generatedQuests,
  setGeneratedQuests,
  aiLoading
}: AIQuestModalProps) => {
  const [aiQuestForm, setAiQuestForm] = useState<AIQuestForm>({
    type: 'personal',
    theme: '',
    count: 3,
    difficulty: 'medium'
  });

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!aiQuestForm.theme.trim()) {
      alert('주제를 입력해주세요.');
      return;
    }
    onGenerate(aiQuestForm);
  };

  const handleClose = () => {
    onClose();
    setGeneratedQuests([]);
    setAiQuestForm({
      type: 'personal',
      theme: '',
      count: 3,
      difficulty: 'medium'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Sparkles className="text-purple-500" size={24} />
              <span>AI 퀘스트 생성</span>
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 설정 패널 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">퀘스트 설정</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">퀘스트 유형</label>
                <select
                  value={aiQuestForm.type}
                  onChange={(e) => setAiQuestForm(prev => ({ ...prev, type: e.target.value as 'personal' | 'group' }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="personal">개인</option>
                  <option value="group">단체</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">주제</label>
                <input
                  type="text"
                  value={aiQuestForm.theme}
                  onChange={(e) => setAiQuestForm(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="예: 프로그래밍, 학습, 운동, 독서 등"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                <select
                  value={aiQuestForm.difficulty}
                  onChange={(e) => setAiQuestForm(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy">쉬움</option>
                  <option value="medium">보통</option>
                  <option value="hard">어려움</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">생성할 퀘스트 수</label>
                <input
                  type="number"
                  value={aiQuestForm.count}
                  onChange={(e) => setAiQuestForm(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="10"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={aiLoading || !aiQuestForm.theme.trim()}
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>퀘스트 생성</span>
                  </>
                )}
              </button>
            </div>

            {/* 생성된 퀘스트 미리보기 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">생성된 퀘스트</h3>
                {generatedQuests.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={onSave}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setGeneratedQuests([])}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {generatedQuests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>주제를 입력하고 퀘스트를 생성해보세요</p>
                  </div>
                ) : (
                  generatedQuests.map((quest, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{quest.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            quest.type === 'personal' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {quest.type === 'personal' ? '개인' : '단체'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            quest.difficulty === 'easy' ? 'bg-blue-100 text-blue-700' :
                            quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {quest.difficulty === 'easy' ? '쉬움' : 
                             quest.difficulty === 'medium' ? '보통' : '어려움'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{quest.estimatedTime}</span>
                        <span className="font-medium text-purple-600">{quest.points}pt</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuestModal;