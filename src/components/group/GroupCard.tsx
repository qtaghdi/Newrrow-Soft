import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, Edit3, Eye, CheckCircle } from 'lucide-react';
import { Group } from '@/types/group';
import { groupMockAPI } from '@/data/groupMockData';

interface GroupCardProps {
  group: Group;
  isShortTerm?: boolean;
}

const GroupCard = ({ group, isShortTerm = false }: GroupCardProps) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<{[key: string]: any[]}>({});
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMonthlyRetrospectiveList, setShowMonthlyRetrospectiveList] = useState(false);
  const [retrospectiveText, setRetrospectiveText] = useState('');
  const [monthlyRetrospectiveText, setMonthlyRetrospectiveText] = useState('');
  const [userRole, setUserRole] = useState('');
  const [monthlyGoals, setMonthlyGoals] = useState('');
  const [monthlyAchievements, setMonthlyAchievements] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [userRetrospectives, setUserRetrospectives] = useState<any[]>([]);
  const [userMonthlyRetrospectives, setUserMonthlyRetrospectives] = useState<any[]>([]);
  const [allRetrospectives, setAllRetrospectives] = useState<any[]>([]);
  const [allMonthlyRetrospectives, setAllMonthlyRetrospectives] = useState<any[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRetrospectiveModal, setShowRetrospectiveModal] = useState(false);
  const [showMonthlyRetrospectiveModal, setShowMonthlyRetrospectiveModal] = useState(false);
  const [showRetrospectiveList, setShowRetrospectiveList] = useState(false);

  // 완료 상태 정확히 판단
  const isActuallyCompleted = group.duration === 'short' 
    ? (group.isCompleted === true) // 단기: 명시적으로 완료된 경우만
    : (group.totalPoints >= group.targetPoints); // 장기: 목표 달성 시

  // 단기 그룹의 성공/실패 판단 (완료된 경우에만)
  const isShortTermSuccess = group.duration === 'short' && isActuallyCompleted && 
    group.endDate && new Date() <= new Date(group.endDate);
  
  const isShortTermFailed = group.duration === 'short' && isActuallyCompleted && 
    group.endDate && new Date() > new Date(group.endDate);

  // 회고 작성 가능 여부 판단
  const canWriteRetrospective = () => {
    if (group.duration === 'long') {
      // 장기 그룹: 항상 월별 회고 작성 가능 + 목표 달성 시 추가 회고
      return true;
    } else {
      // 단기 그룹: 기한 내 성공/실패와 관계없이 회고 작성 가능
      return group.endDate ? new Date() >= new Date(group.endDate) : false;
    }
  };

  // 단기 그룹의 성공/실패 상태 판단
  const getShortTermStatus = () => {
    if (group.duration !== 'short' || !group.endDate) return null;
    
    const isExpired = new Date() >= new Date(group.endDate);
    if (!isExpired) return 'ongoing'; // 진행 중
    
    const isSuccessful = group.totalPoints >= group.targetPoints;
    return isSuccessful ? 'success' : 'failed';
  };

  const currentUserId = 'gramdemaster'; // 현재 사용자 ID
  const currentUserName = '그램드마스터'; // 현재 사용자 이름

  // 컴포넌트 마운트 시 댓글 데이터 로드
  React.useEffect(() => {
    const loadRetrospectives = async () => {
      try {
        const retrospectives = await groupMockAPI.getRetrospectives(group.id);
      } catch (error) {
        console.error('회고 데이터 로드 실패:', error);
      }
    };
    
    const loadComments = () => {
      const storageKey = `comments_${group.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsedComments = JSON.parse(stored);
          setComments(parsedComments);
          console.log('댓글 데이터 로드:', parsedComments);
        } catch (error) {
          console.error('댓글 데이터 파싱 실패:', error);
        }
      }
    };
    
    loadComments();
  }, [group.id]);

  // 댓글 저장
  const saveComments = (newComments: {[key: string]: any[]}) => {
    const storageKey = `comments_${group.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newComments));
    console.log('댓글 저장 완료:', newComments);
  };

  // 댓글 추가
  const handleAddComment = (retrospectiveId: string) => {
    const content = newComment[retrospectiveId]?.trim();
    if (!content) return;

    console.log('댓글 추가 시작:', retrospectiveId, content);

    const comment = {
      id: Date.now().toString(),
      retrospectiveId,
      authorId: currentUserId,
      authorName: currentUserName,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedComments = {
      ...comments,
      [retrospectiveId]: [...(comments[retrospectiveId] || []), comment]
    };

    setComments(updatedComments);
    saveComments(updatedComments);
    
    // 입력창 초기화
    setNewComment(prev => ({
      ...prev,
      [retrospectiveId]: ''
    }));

    console.log('댓글 추가 완료:', comment);
  };

  // 댓글 수정
  const handleUpdateComment = (commentId: string, newContent: string) => {
    console.log('댓글 수정 시작:', commentId, newContent);

    const updatedComments = { ...comments };
    
    // 모든 회고에서 해당 댓글 찾기
    for (const retrospectiveId in updatedComments) {
      const commentIndex = updatedComments[retrospectiveId].findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        updatedComments[retrospectiveId][commentIndex] = {
          ...updatedComments[retrospectiveId][commentIndex],
          content: newContent,
          updatedAt: new Date().toISOString()
        };
        break;
      }
    }

    setComments(updatedComments);
    saveComments(updatedComments);
    setEditingComment(null);
    setEditContent('');

    console.log('댓글 수정 완료');
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    console.log('댓글 삭제 시작:', commentId);

    const updatedComments = { ...comments };
    
    // 모든 회고에서 해당 댓글 찾아서 삭제
    for (const retrospectiveId in updatedComments) {
      const commentIndex = updatedComments[retrospectiveId].findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        updatedComments[retrospectiveId].splice(commentIndex, 1);
        break;
      }
    }

    setComments(updatedComments);
    saveComments(updatedComments);

    console.log('댓글 삭제 완료');
  };

  // 색상 옵션 정의
  const colorOptions = [
    { name: 'blue', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100', avatar: 'from-blue-400 to-blue-600', date: 'text-blue-600' },
    { name: 'green', bg: 'from-green-50 to-emerald-50', border: 'border-green-100', avatar: 'from-green-400 to-green-600', date: 'text-green-600' },
    { name: 'purple', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100', avatar: 'from-purple-400 to-purple-600', date: 'text-purple-600' },
    { name: 'orange', bg: 'from-orange-50 to-red-50', border: 'border-orange-100', avatar: 'from-orange-400 to-orange-600', date: 'text-orange-600' },
    { name: 'teal', bg: 'from-teal-50 to-cyan-50', border: 'border-teal-100', avatar: 'from-teal-400 to-teal-600', date: 'text-teal-600' },
    { name: 'pink', bg: 'from-pink-50 to-rose-50', border: 'border-pink-100', avatar: 'from-pink-400 to-pink-600', date: 'text-pink-600' }
  ];

  const getSelectedColorStyles = () => {
    return colorOptions.find(color => color.name === selectedColor) || colorOptions[0];
  };

  // 사용자가 작성한 회고가 있는지 확인
  const hasUserRetrospective = allRetrospectives.some(retro => retro.authorId === currentUserId);
  const hasUserMonthlyRetrospective = allMonthlyRetrospectives.some(retro => retro.authorId === currentUserId);

  // 팀 회고 데이터 (예시)
  const teamRetrospectives = group.isCompleted ? [
    {
      id: 'team_retro_1',
      groupId: group.id,
      authorId: 'kim_junho',
      author: '김준호',
      role: '팀 리더',
      date: '2025.01.03',
      month: undefined,
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100',
      avatarColor: 'from-blue-400 to-blue-600',
      dateColor: 'text-blue-600',
      content: `이번 모바일 앱 개발 프로젝트를 통해 React Native의 깊이 있는 부분까지 경험할 수 있었습니다. 
        특히 상태 관리와 네비게이션 구조를 설계하면서 많은 것을 배웠어요. 팀원들과의 협업 과정에서 
        코드 리뷰의 중요성을 다시 한번 깨달았고, 서로 다른 관점에서 문제를 바라보는 것이 얼마나 
        중요한지 알게 되었습니다. 다음 프로젝트에서는 테스트 코드 작성에 더 신경 쓰고 싶습니다.`,
      goals: undefined,
      achievements: undefined,
      isUserWritten: false,
      type: 'project' as const,
      comments: []
    },
    {
      id: 'team_retro_2',
      groupId: group.id,
      authorId: 'moon_taewan',
      author: '문태완',
      role: '백엔드 개발자',
      date: '2025.01.03',
      month: undefined,
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-100',
      avatarColor: 'from-green-400 to-green-600',
      dateColor: 'text-green-600',
      content: `백엔드 API 개발을 담당하면서 RESTful API 설계 원칙을 실제로 적용해볼 수 있어서 좋았습니다. 
        데이터베이스 스키마 설계부터 API 문서화까지 전체적인 백엔드 개발 프로세스를 경험했어요. 
        프론트엔드 팀과의 소통에서 API 명세서의 중요성을 깨달았고, 에러 핸들링과 보안 측면에서도 
        많이 배웠습니다. 앞으로는 성능 최적화와 캐싱 전략에 대해서도 더 공부해보고 싶어요.`,
      goals: undefined,
      achievements: undefined,
      isUserWritten: false,
      type: 'project' as const,
      comments: []
    },
    {
      id: 'team_retro_3',
      groupId: group.id,
      authorId: 'kim_minsu',
      author: '김민수',
      role: '프론트엔드 개발자',
      date: '2025.01.04',
      month: undefined,
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-100',
      avatarColor: 'from-purple-400 to-purple-600',
      dateColor: 'text-purple-600',
      content: `UI/UX 디자인과 프론트엔드 구현을 맡으면서 사용자 경험의 중요성을 체감했습니다. 
        디자인 시스템을 구축하고 일관된 컴포넌트를 만드는 과정이 처음에는 어려웠지만, 
        결과적으로 개발 효율성이 크게 향상되었어요. 사용자 피드백을 받아 개선하는 과정에서 
        애자일 개발 방법론의 장점을 실감했습니다. 다음에는 접근성과 성능 최적화에도 더 신경 쓰고 싶어요.`,
      goals: undefined,
      achievements: undefined,
      isUserWritten: false,
      type: 'project' as const,
      comments: []
    }
  ] : [];

  // 전체 회고 목록 (팀 회고 + 사용자 회고)
  const availableRetrospectives = [...teamRetrospectives, ...userRetrospectives, ...allRetrospectives].map(retro => ({
    ...retro,
    comments: retro.comments || []
  }));

  // 장기 그룹용 달별 회고 데이터
  const monthlyTeamRetrospectives: any[] = group.duration === 'long' ? [
    {
      id: 'monthly_retro_1',
      groupId: group.id,
      authorId: 'kim_junho',
      author: '김준호',
      role: '팀 리더',
      month: '2025년 1월',
      date: '2025.01.31',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100',
      avatarColor: 'from-blue-400 to-blue-600',
      dateColor: 'text-blue-600',
      goals: '이번 달 목표는 React 심화 학습과 팀 프로젝트 기획이었습니다.',
      achievements: 'React Hook 완전 정복, 상태 관리 라이브러리 비교 분석 완료, 팀 프로젝트 주제 선정 및 역할 분담 완료',
      content: `1월 한 달 동안 React 생태계에 대해 깊이 있게 학습할 수 있었습니다. 
        특히 useEffect의 의존성 배열 관리와 커스텀 훅 작성에 대해 많은 것을 배웠어요. 
        팀 프로젝트 기획 과정에서 각자의 강점을 파악하고 역할을 분담하는 것이 생각보다 어려웠지만, 
        충분한 토론을 통해 좋은 결과를 얻을 수 있었습니다. 다음 달에는 실제 개발에 집중하고 싶습니다.`,
      isUserWritten: false,
      type: 'monthly' as const,
      comments: []
    },
    {
      id: 'monthly_retro_2',
      groupId: group.id,
      authorId: 'moon_taewan',
      author: '문태완',
      role: '백엔드 개발자',
      month: '2025년 1월',
      date: '2025.01.30',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-100',
      avatarColor: 'from-green-400 to-green-600',
      dateColor: 'text-green-600',
      goals: '이번 달은 Node.js와 Express 프레임워크 마스터가 목표였습니다.',
      achievements: 'RESTful API 설계 원칙 학습, JWT 인증 시스템 구현, 데이터베이스 모델링 완료',
      content: `백엔드 개발의 기초를 탄탄히 다질 수 있었던 한 달이었습니다. 
        API 설계부터 데이터베이스 연동까지 전체적인 흐름을 이해하게 되었어요. 
        특히 보안 측면에서 JWT 토큰 관리와 비밀번호 암호화에 대해 배운 것이 가장 유익했습니다. 
        다음 달에는 성능 최적화와 테스트 코드 작성에 집중하고 싶습니다.`,
      isUserWritten: false,
      type: 'monthly' as const,
      comments: []
    }
  ] : [];

  // 전체 달별 회고 목록
  const availableMonthlyRetrospectives = [...monthlyTeamRetrospectives, ...userMonthlyRetrospectives, ...allMonthlyRetrospectives].map(retro => ({
    ...retro,
    comments: retro.comments || []
  }));

  const getProgressPercentage = () => {
    return Math.min((group.totalPoints / group.targetPoints) * 100, 100);
  };

  const handleRetrospectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const colorStyles = getSelectedColorStyles();
    
    // 새 회고 생성
    const newRetrospective: any = {
      id: Date.now().toString(),
      groupId: group.id,
      authorId: currentUserId,
      author: '그램드마스터', // 현재 사용자 이름
      role: userRole,
      date: new Date().toLocaleDateString('ko-KR'),
      month: undefined,
      bgColor: colorStyles.bg,
      borderColor: colorStyles.border,
      avatarColor: colorStyles.avatar,
      dateColor: colorStyles.date,
      content: retrospectiveText,
      goals: undefined,
      achievements: undefined,
      isUserWritten: true,
      type: 'project' as const,
      comments: []
    };
    
    // 로컬에 저장
    groupMockAPI.createRetrospective(newRetrospective).then(() => {
      console.log('회고 저장 완료');
      // 회고 목록 새로고침
      setAllRetrospectives(prev => [newRetrospective, ...prev]);
    });
    
    alert('프로젝트 회고가 저장되었습니다!');
    setShowRetrospectiveModal(false);
    setRetrospectiveText('');
  };

  const handleMonthlyRetrospectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const colorStyles = getSelectedColorStyles();
    const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    
    // 새 달별 회고 생성
    const newMonthlyRetrospective: any = {
      id: Date.now().toString(),
      groupId: group.id,
      authorId: currentUserId,
      author: '그램드마스터',
      role: userRole,
      month: currentMonth,
      date: new Date().toLocaleDateString('ko-KR'),
      bgColor: colorStyles.bg,
      borderColor: colorStyles.border,
      avatarColor: colorStyles.avatar,
      dateColor: colorStyles.date,
      goals: monthlyGoals,
      achievements: monthlyAchievements,
      content: monthlyRetrospectiveText,
      isUserWritten: true,
      type: 'monthly' as const,
      comments: []
    };
    
    // 로컬에 저장
    groupMockAPI.createRetrospective(newMonthlyRetrospective).then(() => {
      console.log('달별 회고 저장 완료');
      // 달별 회고 목록 새로고침
      setAllMonthlyRetrospectives(prev => [newMonthlyRetrospective, ...prev]);
    });
    
    alert('달별 회고가 저장되었습니다!');
    setShowMonthlyRetrospectiveModal(false);
    setMonthlyRetrospectiveText('');
    setMonthlyGoals('');
    setMonthlyAchievements('');
  };

  // 댓글 관련 핸들러
  const handleAddCommentAsync = async (retrospectiveId: string, content: string) => {
    try {
      console.log('댓글 추가 시도:', retrospectiveId, content);
      const newComment = await groupMockAPI.addComment(retrospectiveId, {
        retrospectiveId,
        authorId: currentUserId,
        content
      });
      
      console.log('댓글 추가 완료:', newComment);
      
      // 로컬 상태 즉시 업데이트
      setUserRetrospectives(prev => prev.map(retro => {
        if (retro.id === retrospectiveId) {
          return {
            ...retro,
            comments: [...(retro.comments || []), newComment]
          };
        }
        return retro;
      }));
      
      // 로컬 상태 업데이트
      setAllRetrospectives(prev => 
        prev.map(retro => 
          retro.id === retrospectiveId 
            ? { ...retro, comments: [...(retro.comments || []), newComment] }
            : retro
        )
      );
      
      setAllMonthlyRetrospectives(prev => 
        prev.map(retro => 
          retro.id === retrospectiveId 
            ? { ...retro, comments: [...(retro.comments || []), newComment] }
            : retro
        )
      );
      
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };

  const handleUpdateCommentAsync = async (commentId: string, content: string) => {
    try {
      await groupMockAPI.updateComment(commentId, content);
      
      // 로컬 상태 업데이트
      const updateComments = (retros: any[]) => 
        retros.map(retro => ({
          ...retro,
          comments: (retro.comments || []).map((comment: any) => 
            comment.id === commentId 
              ? { ...comment, content, updatedAt: new Date().toISOString() }
              : comment
          )
        }));
      
      setAllRetrospectives(updateComments);
      setAllMonthlyRetrospectives(updateComments);
      
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  const handleDeleteCommentAsync = async (commentId: string) => {
    try {
      await groupMockAPI.deleteComment(commentId);
      
      // 로컬 상태 업데이트
      const updateComments = (retros: any[]) => 
        retros.map(retro => ({
          ...retro,
          comments: (retro.comments || []).filter((comment: any) => comment.id !== commentId)
        }));
      
      setAllRetrospectives(updateComments);
      setAllMonthlyRetrospectives(updateComments);
      
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const handleCardClick = () => {
    if (group.isCompleted) {
      setShowConfirmModal(true);
    } else {
      navigate(`/group/${group.id}`);
    }
  };

  // 프로젝트 상태 확인
  const isIncomplete = group.duration === 'short' && group.endDate && 
    new Date(group.endDate) < new Date() && !group.isCompleted;

  const handleViewProject = () => {
    setShowConfirmModal(false);
    navigate(`/group/${group.id}`);
  };

  const handleWriteRetrospective = () => {
    setShowConfirmModal(false);
    setShowRetrospectiveModal(true);
  };

  const borderColor = isShortTerm ? 'border-orange-200' : 'border-gray-200';
  const hoverColor = isShortTerm ? 'group-hover:text-orange-600' : 'group-hover:text-blue-600';

  const shortTermStatus = getShortTermStatus();

  // 성공적인 완료 여부 판단
  const isSuccessfulCompletion = group.duration === 'short' 
    ? (group.isCompleted && group.endDate && new Date() <= new Date(group.endDate))
    : group.isCompleted;

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
          group.isCompleted 
            ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-green-200/50' 
            : isIncomplete
              ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-orange-200/50'
              : borderColor
        }`}
      >
        {/* 카드 상단에 정보 배치 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar size={14} />
              <span>{isShortTerm ? '단기' : '장기'}</span>
            </div>
            {isShortTerm && group.endDate && (
              <div className={`px-2 py-1 rounded text-xs ${
                group.isCompleted 
                  ? 'bg-green-200 text-green-800 font-medium' 
                  : isIncomplete
                    ? 'bg-red-200 text-red-800 font-medium'
                    : 'bg-orange-100 text-orange-700'
              }`}>
                {group.isCompleted ? '완료됨' : 
                 isIncomplete ? '기한 만료' : 
                 `${new Date(group.endDate).toLocaleDateString()} 종료`}
              </div>
            )}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Target size={14} />
              <span>퀘스트 {group.quests.length}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${
            group.isCompleted
              ? 'bg-green-200 text-green-800 font-medium'
              : isIncomplete
                ? 'bg-orange-200 text-orange-800 font-medium'
                : group.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
          }`}>
            {group.isCompleted ? '프로젝트 완료' : 
             isIncomplete ? '프로젝트 미완료' : 
             group.isActive ? '활성' : '비활성'}
          </div>
        </div>

        {/* 기존 카드 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${group.isCompleted ? 'bg-green-100' : group.bgColor} rounded-lg flex items-center justify-center text-2xl`}>
              {group.icon}
            </div>
            <div>
              <h3 className={`font-semibold text-xl transition-colors ${
                group.isCompleted 
                  ? 'text-green-800 group-hover:text-green-900' 
                  : isIncomplete
                    ? 'text-orange-800 group-hover:text-orange-900'
                    : `text-gray-800 ${hoverColor}`
              }`}>
                {group.name}
              </h3>
              <p className="text-sm text-gray-500">{group.code}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">멤버</p>
            <p className="font-semibold text-gray-800">{group.memberCount}명</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {group.description}
        </p>

        {/* 목표 달성률 표시 */}
        {group.settings.showTargetProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>목표 달성률</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                  group.isCompleted 
                    ? 'bg-gradient-to-r from-green-400 to-green-600' 
                    : isIncomplete
                      ? 'bg-gradient-to-r from-orange-400 to-red-500'
                      : 'bg-gradient-to-r from-blue-400 to-blue-600'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>{group.totalPoints} 포인트</span>
              <span>{group.targetPoints} 포인트</span>
            </div>
          </div>
        )}

        {/* 단기 그룹 상태 표시 */}
        {group.duration === 'short' && shortTermStatus && shortTermStatus !== 'ongoing' && (
          <div className={`mb-4 p-3 rounded-lg border ${
            shortTermStatus === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                shortTermStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                shortTermStatus === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {shortTermStatus === 'success' ? '목표 달성 완료' : '기한 내 미완료'}
              </span>
            </div>
            <p className={`text-xs mt-1 ${
              shortTermStatus === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {shortTermStatus === 'success' 
                ? '축하합니다! 목표를 성공적으로 달성했습니다.' 
                : '아쉽지만 기한 내에 목표를 달성하지 못했습니다.'}
            </p>
          </div>
        )}

        {/* 완료 상태 표시 - 실제 완료된 경우에만 */}
        {group.isCompleted && (
          <div className={`mt-4 p-3 rounded-lg border ${
            group.duration === 'short' 
              ? (isSuccessfulCompletion ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className={
                group.duration === 'short' 
                  ? (isSuccessfulCompletion ? 'text-green-600' : 'text-red-600')
                  : 'text-green-600'
              } />
              <span className={`text-sm font-medium ${
                group.duration === 'short' 
                  ? (isSuccessfulCompletion ? 'text-green-800' : 'text-red-800')
                  : 'text-green-800'
              }`}>
                {group.duration === 'short' 
                  ? (isSuccessfulCompletion ? '목표 달성 완료' : '기한 내 미완료')
                  : '목표 달성 완료'
                }
              </span>
            </div>
          </div>
        )}

        {/* 댓글 기능 (모든 활성 그룹에서 표시) */}
        {group.isCompleted && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800 font-semibold">
                  🎉 프로젝트가 완료되었습니다!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  프로젝트 내용을 확인하거나 회고를 작성해보세요.
                </p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRetrospectiveList(true);
                  }}
                  className="p-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="회고 보기"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRetrospectiveModal(true);
                  }}
                  className="p-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  title={hasUserRetrospective ? "회고 수정" : "회고 작성"}
                >
                  <Edit3 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 완료된 프로젝트 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl transform transition-all">
            <div className="p-8">
              {/* 헤더 */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                  {group.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{group.name}</h3>
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  🎉 프로젝트 완료
                </div>
              </div>
              
              {/* 프로젝트 성과 요약 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  프로젝트 성과
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{group.quests.length}</div>
                    <div className="text-sm text-green-700">완료된 퀘스트</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{group.totalPoints}</div>
                    <div className="text-sm text-green-700">획득 포인트</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{group.memberCount}</div>
                    <div className="text-sm text-green-700">참여 멤버</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-green-700">목표 달성률</div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                축하합니다! 프로젝트가 성공적으로 완료되었습니다.<br/>
                <span className="text-sm text-gray-500">프로젝트 내용을 확인하거나 회고를 작성해보세요.</span>
              </p>
              
              {/* 액션 버튼들 */}
              <div className="flex flex-col space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={handleViewProject}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>👁️</span>
                    <span className="font-medium">프로젝트 보기</span>
                  </button>
                  <button
                    onClick={handleWriteRetrospective}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>✍️</span>
                    <span className="font-medium">회고 작성</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
                >
                  나중에 하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 회고 목록 모달 */}
      {showRetrospectiveList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">📚 프로젝트 회고 모음</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>{group.name}</strong> 프로젝트에 대한 팀원들의 회고입니다.
                  </p>
                </div>
                <button
                  onClick={() => setShowRetrospectiveList(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {availableRetrospectives.length > 0 ? (
                <div className="space-y-6">
                  {availableRetrospectives.map((retro) => (
                    <div key={retro.id} className={`bg-gradient-to-r ${retro.bgColor} rounded-xl p-5 border ${retro.borderColor} ${retro.isUserWritten ? 'ring-2 ring-blue-200' : ''}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${retro.avatarColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                          <span className="text-sm font-medium">{retro.author.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {retro.author} ({retro.role})
                            {retro.isUserWritten && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">내 회고</span>}
                          </p>
                          <p className={"text-xs " + retro.dateColor}>{retro.date} 작성</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed bg-white/50 p-3 rounded-lg">
                        {retro.content}
                      </p>
                      
                      {/* 댓글 섹션 */}
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        {/* 댓글 목록 */}
                        {comments[retro.id] && comments[retro.id].length > 0 && (
                          <div className="space-y-3 mb-4">
                            {comments[retro.id].map((comment) => (
                              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-gray-600">그</span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">{comment.authorName}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                        {comment.updatedAt !== comment.createdAt && ' (수정됨)'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* 자신의 댓글인 경우 수정/삭제 버튼 */}
                                  {comment.authorId === currentUserId && (
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => {
                                          setEditingComment(comment.id);
                                          setEditContent(comment.content);
                                        }}
                                        className="text-gray-400 hover:text-blue-600 p-1 text-xs"
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-gray-400 hover:text-red-600 p-1 text-xs"
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  )}
                                </div>
                                
                                {editingComment === comment.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                      rows={2}
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        onClick={() => {
                                          setEditingComment(null);
                                          setEditContent('');
                                        }}
                                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                                      >
                                        취소
                                      </button>
                                      <button
                                        onClick={() => handleUpdateComment(comment.id, editContent)}
                                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                      >
                                        저장
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 새 댓글 작성 (다른 사람의 회고에만 표시) */}
                        {!retro.isUserWritten && (
                          <div className="flex space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-xs font-medium text-gray-600">그</span>
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={newComment[retro.id] || ''}
                                onChange={(e) => setNewComment(prev => ({
                                  ...prev,
                                  [retro.id]: e.target.value
                                }))}
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={2}
                                placeholder="이 회고에 대한 피드백을 남겨보세요..."
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => handleAddComment(retro.id)}
                                  disabled={!newComment[retro.id]?.trim()}
                                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                                >
                                  댓글 달기
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 자신의 회고인 경우 안내 메시지 */}
                        {retro.isUserWritten && (
                          <div className="text-center py-3">
                            <p className="text-sm text-gray-500">자신의 회고에는 댓글을 달 수 없습니다.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">아직 작성된 회고가 없습니다.</div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setShowRetrospectiveList(false);
                  setShowRetrospectiveModal(true);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ✍️ 내 회고 작성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 달별 회고 목록 모달 */}
      {showMonthlyRetrospectiveList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">📅 달별 회고 모음</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>{group.name}</strong> 그룹의 월별 학습 회고입니다.
                  </p>
                </div>
                <button
                  onClick={() => setShowMonthlyRetrospectiveList(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {availableMonthlyRetrospectives.length > 0 ? (
                <div className="space-y-6">
                  {availableMonthlyRetrospectives.map((retro) => (
                    <div key={retro.id} className={`bg-gradient-to-r ${retro.bgColor} rounded-xl p-6 border ${retro.borderColor} ${retro.isUserWritten ? 'ring-2 ring-purple-200' : ''}`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${retro.avatarColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                          <span className="text-lg font-medium">{retro.author.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {retro.author} ({retro.role})
                            {retro.isUserWritten && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">내 회고</span>}
                          </p>
                          <p className={`text-sm ${retro.dateColor} font-medium`}>{retro.month}</p>
                          <p className="text-xs text-gray-500">{retro.date} 작성</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white/60 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <span className="mr-2">🎯</span>
                            이번 달 목표
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{retro.goals}</p>
                        </div>
                        
                        <div className="bg-white/60 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <span className="mr-2">🏆</span>
                            주요 성과
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{retro.achievements}</p>
                        </div>
                        
                        <div className="bg-white/60 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <span className="mr-2">💭</span>
                            회고 및 소감
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{retro.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">아직 작성된 달별 회고가 없습니다.</div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setShowMonthlyRetrospectiveList(false);
                  setShowMonthlyRetrospectiveModal(true);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📅 내 달별 회고 작성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 달별 회고 작성 모달 */}
      {showMonthlyRetrospectiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">📅 달별 회고 작성</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>{group.name}</strong> 그룹에서의 이번 달 활동을 돌아보세요.
                  </p>
                </div>
                <button
                  onClick={() => setShowMonthlyRetrospectiveModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleMonthlyRetrospectiveSubmit}>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-16 h-16 ${group.bgColor} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} 회고
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 mb-6">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                      <span className="mr-2">📊</span>
                      이번 달 활동 현황
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-600">완료된 퀘스트:</span>
                        <span className="font-bold ml-2 text-purple-800">{group.quests.filter(q => q.isCompleted).length}개</span>
                      </div>
                      <div>
                        <span className="text-purple-600">획득 포인트:</span>
                        <span className="font-bold ml-2 text-purple-800">{group.totalPoints} 포인트</span>
                      </div>
                      <div>
                        <span className="text-purple-600">목표 달성률:</span>
                        <span className="font-bold ml-2 text-purple-800">{Math.round((group.totalPoints / group.targetPoints) * 100)}%</span>
                      </div>
                      <div>
                        <span className="text-purple-600">활동 일수:</span>
                        <span className="font-bold ml-2 text-purple-800">{new Date().getDate()}일</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 역할 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 이 그룹에서 당신의 역할은 무엇인가요?
                    </label>
                    <input
                      type="text"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="예: 스터디 리더, 학습자, 멘토, 프로젝트 매니저 등"
                      required
                    />
                  </div>

                  {/* 색상 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎨 회고 카드 색상을 선택해주세요
                    </label>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color.avatar} border-2 transition-all duration-200 ${
                            selectedColor === color.name 
                              ? 'border-gray-800 scale-110 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 이번 달 목표 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎯 이번 달 목표는 무엇이었나요?
                    </label>
                    <textarea
                      value={monthlyGoals}
                      onChange={(e) => setMonthlyGoals(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                      rows={3}
                      placeholder="이번 달에 달성하고자 했던 목표나 계획을 작성해주세요.&#10;&#10;예시:&#10;- React Hook 완전 정복하기&#10;- 알고리즘 문제 50개 풀기&#10;- 팀 프로젝트 기획 완료하기"
                      required
                    />
                  </div>

                  {/* 주요 성과 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏆 이번 달 주요 성과는 무엇인가요?
                    </label>
                    <textarea
                      value={monthlyAchievements}
                      onChange={(e) => setMonthlyAchievements(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                      rows={3}
                      placeholder="이번 달에 달성한 구체적인 성과나 결과물을 작성해주세요.&#10;&#10;예시:&#10;- useState, useEffect 완전 이해&#10;- 백준 골드 티어 달성&#10;- 팀 프로젝트 주제 선정 및 역할 분담 완료"
                      required
                    />
                  </div>

                  {/* 회고 내용 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💭 이번 달 활동에 대한 회고를 작성해주세요
                    </label>
                    <textarea
                      value={monthlyRetrospectiveText}
                      onChange={(e) => setMonthlyRetrospectiveText(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                      rows={8}
                      placeholder="이번 달 활동을 돌아보며 느낀 점, 배운 점, 아쉬웠던 점, 다음 달 계획 등을 자유롭게 작성해보세요.&#10;&#10;예시:&#10;- 이번 달에 가장 기억에 남는 학습 경험은...&#10;- 그룹 활동을 통해 배운 점은...&#10;- 목표 대비 부족했던 부분은...&#10;- 다음 달에는 이런 점을 개선하고 싶다..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMonthlyRetrospectiveModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {hasUserMonthlyRetrospective ? "📅 달별 회고 수정 완료" : "📅 달별 회고 저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 프로젝트 회고 모달 */}
      {showRetrospectiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">✍️ 프로젝트 회고 작성</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>{group.name}</strong> 프로젝트를 완료하신 것을 축하합니다!
                  </p>
                </div>
                <button
                  onClick={() => setShowRetrospectiveModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleRetrospectiveSubmit}>
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.completedAt && `${new Date(group.completedAt).toLocaleDateString()}에 완료`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <span className="mr-2">📊</span>
                      프로젝트 성과
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-600">완료된 퀘스트:</span>
                        <span className="font-bold ml-2 text-green-800">{group.quests.length}개</span>
                      </div>
                      <div>
                        <span className="text-green-600">획득 포인트:</span>
                        <span className="font-bold ml-2 text-green-800">{group.totalPoints} 포인트</span>
                      </div>
                      <div>
                        <span className="text-green-600">참여 멤버:</span>
                        <span className="font-bold ml-2 text-green-800">{group.memberCount}명</span>
                      </div>
                      <div>
                        <span className="text-green-600">목표 달성률:</span>
                        <span className="font-bold ml-2 text-green-800">100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  
                  {/* 역할 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 이 프로젝트에서 당신의 역할은 무엇이었나요?
                    </label>
                    <input
                      type="text"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="예: 팀장, 아이디어 제안자, 발표자, 자료 조사, 디자이너, 코딩 담당 등"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      프로젝트에서 맡았던 역할이나 담당 업무를 자유롭게 입력해주세요
                    </p>
                  </div>

                  {/* 색상 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎨 회고 카드 색상을 선택해주세요
                    </label>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color.avatar} border-2 transition-all duration-200 ${
                            selectedColor === color.name 
                              ? 'border-gray-800 scale-110 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 회고 내용 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💭 프로젝트 회고 작성
                    </label>
                    <textarea
                      value={retrospectiveText}
                      onChange={(e) => setRetrospectiveText(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                      rows={8}
                      placeholder="프로젝트를 진행하면서 느낀 점, 배운 점, 아쉬웠던 점, 앞으로의 계획 등을 자유롭게 작성해보세요.&#10;&#10;예시:&#10;- 이번 프로젝트에서 가장 기억에 남는 순간은...&#10;- 팀원들과 협력하면서 배운 점은...&#10;- 새롭게 알게 된 것이나 성장한 부분은...&#10;- 다음 프로젝트에서는 이런 점을 더 잘하고 싶다..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRetrospectiveModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {hasUserRetrospective ? "💾 회고 수정 완료" : "💾 회고 저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCard;