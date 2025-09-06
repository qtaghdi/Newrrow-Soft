import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  CheckCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { Group, GroupCreateRequest } from '@/types/group';
import { groupMockAPI } from '@/data/groupMockData';
import GroupCreateModal from '@/components/group/GroupCreateModal';
import GroupSection from '@/components/group/GroupSection';

const GroupPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const [longTermSortOrder, setLongTermSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [shortTermSortOrder, setShortTermSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showLongTermDropdown, setShowLongTermDropdown] = useState(false);
  const [showShortTermDropdown, setShowShortTermDropdown] = useState(false);

  // 그룹 생성 폼 상태
  const [groupForm, setGroupForm] = useState<GroupCreateRequest>({
    name: '',
    description: '',
    duration: 'long',
    endDate: '',
    targetPoints: 3000,
    icon: '🎯',
    maxMembers: 20,
    settings: {
      showTargetProgress: true
    }
  });

  const groupIcons = ['🎯', '📚', '💻', '🏫', '⚡', '🚀', '🎨', '🔬', '🎵', '🏆'];

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await groupMockAPI.getGroups();
        setGroups(data);
      } catch (error) {
        console.error('그룹 데이터 로딩 실패:', error);
        setMessage({ type: 'error', text: '그룹 데이터를 불러오는데 실패했습니다.' });
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  // 그룹 정렬 함수
  const getSortedGroups = (groupsToSort: Group[], sortOrder: 'newest' | 'oldest') => {
    return [...groupsToSort].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      if (sortOrder === 'newest') {
        return dateB - dateA; // 최신순
      } else {
        return dateA - dateB; // 오래된순
      }
    });
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupForm.name.trim() || !groupForm.description.trim()) {
      setMessage({ type: 'error', text: '그룹명과 설명을 모두 입력해주세요.' });
      return;
    }

    if (groupForm.duration === 'short' && !groupForm.endDate) {
      setMessage({ type: 'error', text: '단기 그룹의 경우 종료일을 설정해주세요.' });
      return;
    }

    setCreateLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const newGroup = await groupMockAPI.createGroup(groupForm);
      setGroups(prev => [...prev, newGroup]);
      setMessage({ type: 'success', text: `${newGroup.name} 그룹이 성공적으로 생성되었습니다!` });
      
      // 폼 초기화
      setGroupForm({
        name: '',
        description: '',
        duration: 'long',
        endDate: '',
        targetPoints: 3000,
        icon: '🎯',
        maxMembers: 20,
        settings: {
          showTargetProgress: true
        }
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('그룹 생성 실패:', error);
      setMessage({ type: 'error', text: '그룹 생성 중 오류가 발생했습니다.' });
    } finally {
      setCreateLoading(false);
    }
  };

  // 그룹을 장기/단기로 분류
  const longTermGroups = getSortedGroups(groups.filter(group => group.duration === 'long'), longTermSortOrder);
  const shortTermGroups = getSortedGroups(groups.filter(group => group.duration === 'short'), shortTermSortOrder);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">그룹 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Users className="text-blue-600" size={28} />
            <span>내 그룹</span>
          </h1>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>새 그룹 만들기</span>
            </button>
          </div>
        </div>
        
      </div>

      {/* Message */}
      {message.type && (
        <div className={`mb-8 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 그룹 섹션들 - 좌우 배치로 전체 공간 활용 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 space-y-8 lg:space-y-0">
        <GroupSection
          title="장기 그룹"
          groups={longTermGroups}
          isShortTerm={false}
          sortOrder={longTermSortOrder}
          setSortOrder={setLongTermSortOrder}
          showDropdown={showLongTermDropdown}
          setShowDropdown={setShowLongTermDropdown}
        />
        
        <GroupSection
          title="단기 그룹"
          groups={shortTermGroups}
          isShortTerm={true}
          sortOrder={shortTermSortOrder}
          setSortOrder={setShortTermSortOrder}
          showDropdown={showShortTermDropdown}
          setShowDropdown={setShowShortTermDropdown}
        />
      </div>

      {/* 그룹이 없는 경우 */}
      {groups.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">아직 참여한 그룹이 없습니다</h3>
          <p className="text-gray-500 mb-4">새로운 그룹을 만들거나 기존 그룹에 참여해보세요.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            첫 번째 그룹 만들기
          </button>
        </div>
      )}

      {/* 그룹 생성 모달 */}
      <GroupCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
        groupForm={groupForm}
        setGroupForm={setGroupForm}
        createLoading={createLoading}
        groupIcons={groupIcons}
      />
    </div>
  );
};

export default GroupPage;