import React, { useState } from 'react';
import { X, Settings, Users, Target, Calendar, Trash2, UserMinus, LogOut } from 'lucide-react';
import { Group, GroupMember } from '@/types/group';

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onUpdateGroup: (updates: Partial<Group>) => void;
  onRemoveMember: (memberId: string) => void;
  onDeleteGroup: () => void;
  onLeaveGroup: () => void;
}

const GroupSettingsModal = ({
                              isOpen,
                              onClose,
                              group,
                              onUpdateGroup,
                              onRemoveMember,
                              onDeleteGroup,
                              onLeaveGroup
                            }: GroupSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'members' | 'advanced'>('basic');
  const [groupForm, setGroupForm] = useState({
    name: group.name,
    description: group.description,
    targetPoints: group.targetPoints,
    maxMembers: group.maxMembers || 20,
    endDate: group.endDate || '',
    icon: group.icon
  });

  const groupIcons = ['🎯', '📚', '💻', '🏫', '⚡', '🚀', '🎨', '🔬', '🎵', '🏆'];

  const iconMeanings: Record<string, string> = {
    '🎯': '목표',
    '📚': '학습',
    '💻': '개발',
    '🏫': '학교',
    '⚡': '에너지',
    '🚀': '성장',
    '🎨': '창작',
    '🔬': '연구',
    '🎵': '음악',
    '🏆': '성취'
  };

  if (!isOpen) return null;

  const handleSave = () => {
    console.log('=== GroupSettingsModal handleSave 시작 ===');
    console.log('현재 groupForm:', groupForm);

    const updates = {
      name: groupForm.name,
      description: groupForm.description,
      targetPoints: groupForm.targetPoints,
      maxMembers: groupForm.maxMembers,
      endDate: groupForm.endDate || undefined,
      icon: groupForm.icon
    };

    console.log('저장할 updates 객체:', updates);
    onUpdateGroup(updates);
    console.log('onUpdateGroup 호출 완료');
    onClose();
    console.log('=== GroupSettingsModal handleSave 완료 ===');
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('정말로 이 멤버를 그룹에서 제거하시겠습니까?')) {
      onRemoveMember(memberId);
    }
  };

  const handleDeleteGroup = () => {
    if (window.confirm('정말로 이 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('=== handleDeleteGroup 시작 ===');
      console.log('삭제할 그룹:', group.name, 'ID:', group.id);
      onDeleteGroup();
      console.log('onDeleteGroup 호출 완료');
      onClose();
      console.log('=== handleDeleteGroup 완료 ===');
    }
  };

  const handleLeaveGroup = () => {
    if (window.confirm('정말로 이 그룹에서 탈퇴하시겠습니까? 탈퇴 후에는 그룹 코드로 다시 참여해야 합니다.')) {
      console.log('=== handleLeaveGroup 시작 ===');
      console.log('탈퇴할 그룹:', group.name, 'ID:', group.id);
      onLeaveGroup();
      console.log('onLeaveGroup 호출 완료');
      onClose();
      console.log('=== handleLeaveGroup 완료 ===');
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Settings className="text-gray-600" size={24} />
                <span>그룹 설정</span>
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              <button
                  onClick={() => setActiveTab('basic')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'basic'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                기본 정보
              </button>
              <button
                  onClick={() => setActiveTab('members')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'members'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                멤버 관리
              </button>
              <button
                  onClick={() => setActiveTab('advanced')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'advanced'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                고급 설정
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">그룹명</label>
                    <input
                        type="text"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                    <textarea
                        value={groupForm.description}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">목표 포인트</label>
                      <input
                          type="number"
                          value={groupForm.targetPoints}
                          onChange={(e) => setGroupForm(prev => ({ ...prev, targetPoints: parseInt(e.target.value) || 0 }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="100"
                          step="100"
                      />
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
                      />
                    </div>
                  </div>

                  {group.duration === 'short' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                        <input
                            type="date"
                            value={groupForm.endDate}
                            onChange={(e) => setGroupForm(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                  )}

                  <div className="grid grid-cols-1 gap-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">그룹 아이콘</label>
                      <div className="grid grid-cols-5 gap-1 sm:flex sm:flex-wrap sm:gap-2">
                        {groupIcons.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => setGroupForm(prev => ({ ...prev, icon }))}
                                className={`w-12 h-16 sm:w-16 sm:h-16 rounded-lg border-2 flex flex-col items-center justify-center text-lg sm:text-sm transition-all ${
                                    groupForm.icon === icon
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <span className="text-lg sm:text-base">{icon}</span>
                              <span className="text-xs text-gray-600 mt-1 block sm:hidden">{iconMeanings[icon]}</span>
                            </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {activeTab === 'members' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
                      <Users size={20} />
                      <span>그룹 멤버 ({group.members.length}/{groupForm.maxMembers})</span>
                    </h3>
                    <div className="text-sm text-gray-500">
                      그룹 코드: <span className="font-mono font-medium">{group.code}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {group.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{member.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.class} • {member.points}pt</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {group.leader.id === member.id && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          그룹장
                        </span>
                            )}

                            {/* 그룹장이 그램드마스터이고, 현재 멤버가 그룹장이 아니며, 현재 멤버가 그램드마스터가 아닌 경우에만 제거 버튼 표시 */}
                            {group.leader.id === 'gramdemaster' &&
                                group.leader.id !== member.id &&
                                member.id !== 'gramdemaster' && (
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="멤버 제거"
                                    >
                                      <UserMinus size={16} />
                                    </button>
                                )}
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">새 멤버 초대하기</h4>
                    <p className="text-sm text-blue-600 mb-3">
                      다른 사용자들이 이 그룹에 참여할 수 있도록 그룹 코드를 공유하세요.
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="px-3 py-2 bg-white border border-blue-200 rounded font-mono text-lg">
                        {group.code}
                      </code>
                      <button
                          onClick={() => navigator.clipboard.writeText(group.code)}
                          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        복사
                      </button>
                    </div>
                  </div>
                </div>
            )}

            {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">주의사항</h4>
                    <p className="text-sm text-yellow-700">
                      고급 설정을 변경하면 그룹의 동작 방식이 크게 달라질 수 있습니다. 신중하게 설정해주세요.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                          type="checkbox"
                          checked={group.settings.showTargetProgress}
                          onChange={(e) => onUpdateGroup({
                            settings: { ...group.settings, showTargetProgress: e.target.checked }
                          })}
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

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-red-800 mb-4 flex items-center space-x-2">
                      <Trash2 size={20} />
                      <span>위험 구역</span>
                    </h4>

                    {/* 그룹 탈퇴 */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-orange-700 mb-4">
                        그룹에서 탈퇴하면 더 이상 그룹 활동에 참여할 수 없습니다. 다시 참여하려면 그룹 코드가 필요합니다.
                      </p>
                      <button
                          onClick={handleLeaveGroup}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>그룹 탈퇴</span>
                      </button>
                    </div>

                    {/* 그룹 삭제 (그룹장만) */}
                    {group.leader.id === 'gramdemaster' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-700 mb-4">
                            그룹을 삭제하면 모든 퀘스트와 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                          </p>
                          <button
                              onClick={handleDeleteGroup}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                          >
                            <Trash2 size={16} />
                            <span>그룹 삭제</span>
                          </button>
                        </div>
                    )}
                  </div>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            {activeTab === 'basic' && (
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  저장
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default GroupSettingsModal;