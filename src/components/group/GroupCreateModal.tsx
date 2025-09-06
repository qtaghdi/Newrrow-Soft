import React from 'react';
import { X, School, Zap, Settings, Sparkles } from 'lucide-react';
import { GroupCreateRequest } from '@/types/group';

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  groupForm: GroupCreateRequest;
  setGroupForm: React.Dispatch<React.SetStateAction<GroupCreateRequest>>;
  createLoading: boolean;
  groupIcons: string[];
}

const GroupCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
  groupForm,
  setGroupForm,
  createLoading,
  groupIcons
}: GroupCreateModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">새 그룹 만들기</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">기본 정보</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">그룹명</label>
                <input
                  type="text"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="그룹명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={groupForm.description}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="그룹에 대한 설명을 입력하세요"
                  required
                />
              </div>
            </div>

            {/* 그룹 유형 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">그룹 유형</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGroupForm(prev => ({ ...prev, duration: 'long', endDate: '' }))}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    groupForm.duration === 'long'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <School className="text-blue-600" size={24} />
                    <span className="font-medium text-gray-800">장기 그룹</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    지속적인 학습과 성장을 위한 그룹입니다. 종료일 없이 계속 활동할 수 있습니다.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setGroupForm(prev => ({ ...prev, duration: 'short' }))}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    groupForm.duration === 'short'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Zap className="text-orange-600" size={24} />
                    <span className="font-medium text-gray-800">단기 그룹</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    특정 목표나 프로젝트를 위한 그룹입니다. 종료일을 설정할 수 있습니다.
                  </p>
                </button>
              </div>

              {/* 종료일 (단기 그룹인 경우에만 표시) */}
              {groupForm.duration === 'short' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                  <input
                    type="date"
                    value={groupForm.endDate}
                    onChange={(e) => setGroupForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              )}
            </div>

            {/* 그룹 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
                <Settings size={20} />
                <span>그룹 설정</span>
              </h3>
              
              <div className="space-y-4">

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupForm.settings.showTargetProgress}
                    onChange={(e) => setGroupForm(prev => ({
                      ...prev,
                      settings: { ...prev.settings, showTargetProgress: e.target.checked }
                    }))}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-gray-800">목표 달성률 표시</span>
                    <p className="text-sm text-gray-600 mt-1">
                      그룹의 목표 포인트와 달성률을 진행률 바로 표시합니다.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 목표 포인트 (목표 달성률 표시가 체크된 경우에만 표시) */}
            {groupForm.settings.showTargetProgress && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">목표 포인트</label>
                <input
                  type="number"
                  value={groupForm.targetPoints}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, targetPoints: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="100"
                  step="100"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  그룹이 달성하고자 하는 총 포인트를 설정하세요.
                </p>
              </div>
            )}

            {/* 추가 설정 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">그룹 아이콘</label>
                <div className="grid grid-cols-5 gap-2">
                  {groupIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setGroupForm(prev => ({ ...prev, icon }))}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                        groupForm.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최대 멤버 수</label>
                <input
                  type="number"
                  value={groupForm.maxMembers}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 20 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="2"
                  max="100"
                  required
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={createLoading}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>생성 중...</span>
                  </>
                ) : (
                  <span>그룹 생성</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupCreateModal;