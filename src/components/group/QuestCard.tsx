import React, { useState } from 'react';
import { Check, X, Edit3, Save, Calendar, Clock, Target, Trash2 } from 'lucide-react';
import { Quest } from '@/types/group';

interface QuestCardProps {
  quest: Quest;
  onToggleCompletion: (questId: string) => void;
  onEdit: (quest: Quest) => void;
  onSaveEdit: (questId: string, editForm: any) => void;
  onDelete: (questId: string) => void;
  editingQuest: string | null;
  editForm: any;
  setEditForm: (form: any) => void;
  setEditingQuest: (id: string | null) => void;
  totalMembers: number;
}

const QuestCard = ({
                     quest,
                     onToggleCompletion,
                     onEdit,
                     onSaveEdit,
                     onDelete,
                     editingQuest,
                     editForm,
                     setEditForm,
                     setEditingQuest,
                     totalMembers
                   }: QuestCardProps) => {
  const isEditing = editingQuest === quest.id;
  // 개별 사용자의 완료 상태 (그램드마스터 기준)
  const isUserCompleted = quest.completedBy?.includes('gramdemaster') || false;
  // 전체 퀘스트 완료 상태
  const isQuestCompleted = quest.isCompleted || quest.status === 'completed';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(quest.id);
    setShowDeleteConfirm(false);
  };

  if (isEditing) {
    return (
        <div className={`border border-gray-200 rounded-lg p-4 ${isQuestCompleted ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="퀘스트 제목"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                  placeholder="퀘스트 설명"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">포인트</label>
                <input
                    type="number"
                    value={editForm.points || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="포인트"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                    value={editForm.type || quest.type}
                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as 'personal' | 'group' }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="personal">개인전</option>
                  <option value="group">단체전</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예상 시간</label>
                <input
                    type="text"
                    value={editForm.estimatedTime || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, estimatedTime: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30분"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                  onClick={() => onSaveEdit(quest.id, editForm)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
              >
                <Save size={16} />
                <span>저장</span>
              </button>
              <button
                  onClick={() => {
                    setEditingQuest(null);
                    setEditForm({});
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center space-x-1"
              >
                <X size={16} />
                <span>취소</span>
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className={`border border-gray-200 rounded-lg p-4 ${isQuestCompleted ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <button
                onClick={() => onToggleCompletion(quest.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isUserCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                }`}
            >
              {isUserCompleted && <Check size={14} />}
            </button>
            <div>
              <h3 className={`font-medium ${isQuestCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {quest.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs ${
                  quest.type === 'personal'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
              }`}>
                {quest.type === 'personal' ? '개인' : '단체'}
              </span>
                {quest.estimatedTime && (
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{quest.estimatedTime}</span>
                </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-600">{quest.points}pt</span>
            <button
                onClick={() => onEdit(quest)}
                className="text-gray-400 hover:text-blue-600"
            >
              <Edit3 size={16} />
            </button>
            <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600"
                title="퀘스트 삭제"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p className={`text-sm mb-2 ${isQuestCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
          {quest.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {quest.deadline && (
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{new Date(quest.deadline).toLocaleDateString()}</span>
                </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {quest.type === 'group' && quest.completedBy && (
                <span className={`font-medium ${
                    quest.completedBy.length === totalMembers ? 'text-green-600' : 'text-purple-600'
                }`}>
              {quest.completedBy.length}/{totalMembers} 완료
            </span>
            )}
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">퀘스트 삭제</h3>
                    <p className="text-sm text-gray-600">정말로 이 퀘스트를 삭제하시겠습니까?</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="font-medium text-gray-800 text-sm">{quest.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{quest.description}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">
                    ⚠️ 이 작업은 되돌릴 수 없습니다. 퀘스트와 관련된 모든 데이터가 삭제됩니다.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default QuestCard;