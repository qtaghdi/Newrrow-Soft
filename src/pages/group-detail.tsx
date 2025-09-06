import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Target, Plus, Copy, CheckCircle, Sparkles, X, Settings, Trash2
} from 'lucide-react';
import { Group, Quest, QuestCreateRequest } from '@/types/group';
import { groupMockAPI } from '@/data/groupMockData';
import QuestCard from '@/components/group/QuestCard';
import QuestFilters from '@/components/group/QuestFilters';
import AIQuestModal from '@/components/group/AIQuestModal';
import MemberRanking from '@/components/group/MemberRanking';
import ContributionChart from '@/components/group/ContributionChart';
import GroupSettingsModal from '@/components/group/GroupSettingsModal';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [questFilter, setQuestFilter] = useState<'all' | 'personal' | 'group' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [contributionPeriod, setContributionPeriod] = useState<'daily' | 'weekly' | 'total'>('weekly');
  
  const [showAIModal, setShowAIModal] = useState(false);
  const [generatedQuests, setGeneratedQuests] = useState<Quest[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [questForm, setQuestForm] = useState<QuestCreateRequest>({
    title: '',
    description: '',
    type: 'personal',
    points: 50,
    deadline: '',
    estimatedTime: ''
  });

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return;
      
      try {
        const [groupData, rankingData] = await Promise.all([
          groupMockAPI.getGroup(groupId),
          groupMockAPI.getRanking(groupId)
        ]);
        
        setGroup(groupData);
        setRanking(rankingData);
      } catch (error) {
        console.error('그룹 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  // AI가 예상 소요 시간을 자동으로 설정
  const estimateTime = (title: string, description: string, type: 'personal' | 'group') => {
    const content = (title + ' ' + description).toLowerCase();
    
    if (content.includes('회고') || content.includes('일기')) return '15분';
    if (content.includes('알고리즘') || content.includes('문제')) return '30분';
    if (content.includes('코드리뷰') || content.includes('리뷰')) return '45분';
    if (content.includes('학습') || content.includes('공부')) return '1시간';
    if (content.includes('프로젝트') || content.includes('기획')) return type === 'group' ? '3시간' : '2시간';
    if (content.includes('발표') || content.includes('준비')) return '2시간';
    if (content.includes('운동') || content.includes('헬스')) return '30분';
    if (content.includes('독서') || content.includes('책')) return '1시간';
    
    return type === 'personal' ? '30분' : '1시간';
  };

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;

    try {
      const estimatedTime = questForm.estimatedTime || estimateTime(questForm.title, questForm.description, questForm.type);
      
      await groupMockAPI.createQuest(group.id, {
        ...questForm,
        estimatedTime
      });
      
      // 그룹 데이터 새로고침
      const updatedGroup = await groupMockAPI.getGroup(group.id);
      setGroup(updatedGroup);
      
      // 폼 초기화 및 모달 닫기
      setQuestForm({
        title: '',
        description: '',
        type: 'personal',
        points: 50,
        deadline: '',
        estimatedTime: ''
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('퀘스트 생성 실패:', error);
      
      // 에러 메시지 표시
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('퀘스트 생성 중 오류가 발생했습니다.');
      }
    }
  };

  const handleToggleQuestCompletion = async (questId: string) => {
    try {
      console.log('=== 퀘스트 완료/취소 시작 ===');
      console.log('questId:', questId);
      console.log('완료 전 그룹 총 포인트:', group?.totalPoints);
      
      await groupMockAPI.toggleQuestCompletion(questId, 'gramdemaster'); // 그램드마스터 ID
      
      // 그룹 데이터 업데이트
      if (group) {
        const updatedGroup = await groupMockAPI.getGroup(group.id);
        console.log('완료 후 그룹 총 포인트:', updatedGroup.totalPoints);
        setGroup(updatedGroup);
        
        // 랭킹도 업데이트
        const updatedRanking = await groupMockAPI.getRanking(group.id);
        setRanking(updatedRanking);
        console.log('랭킹 업데이트 완료');
      }
      console.log('=== 퀘스트 완료/취소 완료 ===');
    } catch (error) {
      console.error('퀘스트 완료 처리 실패:', error);
    }
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest.id);
    setEditForm({
      title: quest.title,
      description: quest.description,
      points: quest.points,
      deadline: quest.deadline,
      type: quest.type,
      estimatedTime: quest.estimatedTime
    });
  };

  const handleSaveEdit = async (questId: string) => {
    try {
      await groupMockAPI.updateQuest(questId, editForm);
      
      // 그룹 데이터 업데이트
      if (group) {
        const updatedGroup = await groupMockAPI.getGroup(group.id);
        setGroup(updatedGroup);
      }
      
      setEditingQuest(null);
      setEditForm({});
    } catch (error) {
      console.error('퀘스트 수정 실패:', error);
    }
  };

  const handleDeleteQuest = async (questId: string) => {
    try {
      await groupMockAPI.deleteQuest(questId);
      
      // 그룹 데이터 업데이트
      if (group) {
        const updatedGroup = await groupMockAPI.getGroup(group.id);
        setGroup(updatedGroup);
      }
    } catch (error) {
      console.error('퀘스트 삭제 실패:', error);
    }
  };

  const handleCopyGroupCode = async () => {
    if (!group) return;
    
    try {
      await navigator.clipboard.writeText(group.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const handleGenerateAIQuests = async (aiQuestForm: any) => {
    setAiLoading(true);
    try {
      const quests = await groupMockAPI.generateAIQuests(group!.id, {
        type: aiQuestForm.type,
        theme: aiQuestForm.theme,
        count: aiQuestForm.count
      });
      
      const questsWithDifficulty = quests.map(quest => ({
        ...quest,
        difficulty: aiQuestForm.difficulty
      }));
      
      setGeneratedQuests(questsWithDifficulty);
    } catch (error) {
      console.error('AI 퀘스트 생성 실패:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAIQuests = async () => {
    if (!group) return;
    
    try {
      for (const quest of generatedQuests) {
        await groupMockAPI.createQuest(group.id, {
          title: quest.title,
          description: quest.description,
          type: quest.type,
          points: quest.points,
          estimatedTime: quest.estimatedTime
        });
      }
      
      // 그룹 데이터 새로고침
      const updatedGroup = await groupMockAPI.getGroup(group.id);
      setGroup(updatedGroup);
      
      // 모달 닫기 및 초기화
      setShowAIModal(false);
      setGeneratedQuests([]);
    } catch (error) {
      console.error('AI 퀘스트 저장 실패:', error);
    }
  };

  const handleUpdateGroup = async (updates: Partial<Group>) => {
    if (!group) return;
    
    console.log('=== handleUpdateGroup 시작 ===');
    console.log('받은 updates:', updates);
    console.log('현재 group.id:', group.id);
    
    try {
      await groupMockAPI.updateGroup(group.id, updates);
      console.log('groupMockAPI.updateGroup 완료');
      
      // 그룹 데이터 새로고침
      const updatedGroup = await groupMockAPI.getGroup(group.id);
      console.log('새로고침된 그룹 데이터:', updatedGroup);
      setGroup(updatedGroup);
      console.log('setGroup 완료');
    } catch (error) {
      console.error('그룹 업데이트 실패:', error);
    }
    console.log('=== handleUpdateGroup 완료 ===');
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!group) return;
    
    try {
      await groupMockAPI.removeMember(group.id, memberId);
      
      // 그룹 데이터 및 랭킹 새로고침
      const [updatedGroup, updatedRanking] = await Promise.all([
        groupMockAPI.getGroup(group.id),
        groupMockAPI.getRanking(group.id)
      ]);
      
      setGroup(updatedGroup);
      setRanking(updatedRanking);
    } catch (error) {
      console.error('멤버 제거 실패:', error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group) return;
    
    try {
      await groupMockAPI.deleteGroup(group.id);
      navigate('/group/my');
    } catch (error) {
      console.error('그룹 삭제 실패:', error);
    }
  };

  const getFilteredQuests = () => {
    if (!group) return [];
    
    let filtered = group.quests;
    
    if (questFilter === 'personal') {
      filtered = group.quests.filter(quest => quest.type === 'personal');
    } else if (questFilter === 'group') {
      filtered = group.quests.filter(quest => quest.type === 'group');
    } else if (questFilter === 'completed') {
      filtered = group.quests.filter(quest => quest.status === 'completed' || quest.isCompleted);
    } else if (questFilter === 'all') {
      // 완료된 퀘스트를 맨 아래로 이동
      const active = group.quests.filter(quest => quest.status !== 'completed' && !quest.isCompleted);
      const completed = group.quests.filter(quest => quest.status === 'completed' || quest.isCompleted);
      filtered = [...active, ...completed];
    }
    
    return filtered;
  };

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

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">그룹을 찾을 수 없습니다</h2>
        <button
          onClick={() => navigate('/group/my')}
          className="text-blue-600 hover:text-blue-700"
        >
          그룹 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <button
          onClick={() => navigate('/group/my')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span>그룹 목록으로</span>
        </button>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className={`w-20 h-20 ${group.bgColor} rounded-lg flex items-center justify-center text-4xl`}>
            {group.icon}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
            <p className="text-gray-600">{group.description}</p>
            <div className="flex items-center space-x-4 mt-4 text-base text-gray-500">
              <button
                onClick={handleCopyGroupCode}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle size={16} />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>그룹 코드: {group.code}</span>
                  </>
                )}
              </button>
              {group.isActive && (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Settings size={16} />
                  <span>프로젝트 설정</span>
                </button>
              )}
              <span>멤버 {group.members.length}명</span>
              <span>포인트 {group.totalPoints}/{group.targetPoints}</span>
            </div>
          </div>
        </div>

        {/* 목표 포인트 진행률 바 */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">목표 포인트 달성률</span>
            <span>{Math.round((group.totalPoints / group.targetPoints) * 100)}% 완료</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                group.duration === 'short' 
                  ? 'bg-orange-500' 
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((group.totalPoints / group.targetPoints) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>0 포인트</span>
            <span>{group.targetPoints} 포인트</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* 왼쪽: 퀘스트 */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className={`bg-white rounded-lg border px-6 py-5 flex flex-col h-full ${
            group.duration === 'short' ? 'border-gray-200' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Target className={group.duration === 'short' ? 'text-orange-500' : 'text-blue-500'} size={20} />
                <span>퀘스트</span>
              </h2>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-all flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>퀘스트 추가</span>
                </button>
                
                <button
                  onClick={() => setShowAIModal(true)}
                  className="border-2 border-border-gray-200 text-purple-700 px-4 py-2 rounded-lg hover:border-gray-200 hover:text-purple-800 hover:bg-purple-50 transition-all flex items-center space-x-2"
                >
                  <Sparkles size={16} />
                  <span>AI 퀘스트</span>
                </button>
              </div>
            </div>

            <QuestFilters 
              questFilter={questFilter}
              setQuestFilter={setQuestFilter}
              quests={group.quests}
            />

            {/* 퀘스트 목록 */}
            <div
              className="space-y-3 overflow-y-auto pr-2 text-base"
              style={{ maxHeight: '44rem' }} // 약 4개 카드 높이
            >
              {getFilteredQuests().map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onToggleCompletion={handleToggleQuestCompletion}
                  onEdit={handleEditQuest}
                  onSaveEdit={handleSaveEdit}
                  onDelete={handleDeleteQuest}
                  editingQuest={editingQuest}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  setEditingQuest={setEditingQuest}
                  totalMembers={group.members.length}
                />
              ))}
              
              {getFilteredQuests().length === 0 && (
                <div className="text-center py-8 text-gray-500 min-h-screen">
                  {questFilter === 'all' ? '퀘스트가 없습니다' : 
                   questFilter === 'personal' ? '개인 퀘스트가 없습니다' : 
                   questFilter === 'group' ? '단체 퀘스트가 없습니다' :
                   '완료된 퀘스트가 없습니다'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: 랭킹 및 기여도 */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <div className="flex flex-col h-full justify-between">
            <MemberRanking ranking={ranking} />
            <ContributionChart 
              ranking={ranking}
              contributionPeriod={contributionPeriod}
              setContributionPeriod={setContributionPeriod}
            />
          </div>
        </div>
      </div>

      {/* 퀘스트 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">새 퀘스트 만들기</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateQuest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">퀘스트 제목</label>
                <input
                  type="text"
                  value={questForm.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setQuestForm(prev => ({ 
                      ...prev, 
                      title: newTitle,
                      estimatedTime: estimateTime(newTitle, prev.description, prev.type)
                    }));
                  }}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    group.duration === 'short' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="퀘스트 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={questForm.description}
                  onChange={(e) => {
                    const newDescription = e.target.value;
                    setQuestForm(prev => ({ 
                      ...prev, 
                      description: newDescription,
                      estimatedTime: estimateTime(prev.title, newDescription, prev.type)
                    }));
                  }}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 h-24 resize-none ${
                    group.duration === 'short' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="퀘스트 설명을 입력하세요"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
                  <select
                    value={questForm.type}
                    onChange={(e) => {
                      const newType = e.target.value as 'personal' | 'group';
                      setQuestForm(prev => ({ 
                        ...prev, 
                        type: newType,
                        estimatedTime: estimateTime(prev.title, prev.description, newType)
                      }));
                    }}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      group.duration === 'short' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                    }`}
                  >
                    <option value="personal">개인</option>
                    <option value="group">단체</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">포인트</label>
                  <input
                    type="number"
                    value={questForm.points}
                    onChange={(e) => setQuestForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      group.duration === 'short' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                    }`}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">예상 소요 시간</label>
                <input
                  type="text"
                  value={questForm.estimatedTime}
                  onChange={(e) => setQuestForm(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    group.duration === 'short' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="AI가 자동으로 설정합니다"
                />
                <p className="text-xs text-gray-500 mt-1">
                  비워두면 AI가 제목과 설명을 분석하여 자동으로 설정합니다
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">마감일</label>
                <input
                  type="date"
                  value={questForm.deadline}
                  onChange={(e) => setQuestForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    group.duration === 'short' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  퀘스트 생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIQuestModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleGenerateAIQuests}
        onSave={handleSaveAIQuests}
        generatedQuests={generatedQuests}
        setGeneratedQuests={setGeneratedQuests}
        aiLoading={aiLoading}
      />

      {/* 그룹 설정 모달 */}
      {group && (
        <GroupSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          group={group}
          onUpdateGroup={handleUpdateGroup}
          onRemoveMember={handleRemoveMember}
          onDeleteGroup={handleDeleteGroup}
        />
      )}

      {/* 토스트 알림 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;