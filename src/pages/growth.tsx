import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  MessageCircle, 
  ThumbsUp,
  Thermometer,
  ChevronRight,
  User,
  Calendar,
  Heart,
  FileText,
  Smile
} from 'lucide-react';
import { RetrospectiveCard } from '@/types';
import { mockAPI } from '@/data/mockData';

// 온도 바 컴포넌트
const TemperatureBar = ({ temperature }: { temperature: number }) => {
  const [animatedTemp, setAnimatedTemp] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setAnimatedTemp(temperature);
            }, 50);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => observer.disconnect();
  }, [temperature]);

  const getTemperatureColor = (temp: number) => {
    if (temp <= 25) return 'bg-blue-400';
    if (temp <= 50) return 'bg-green-400';
    if (temp <= 75) return 'bg-yellow-400';
    return 'bg-orange-400';
  };

  return (
    <div ref={barRef} className="flex items-center space-x-2">
      <Thermometer size={16} className="text-gray-400" />
      <span className="text-sm text-gray-600">회고 온도</span>
      <div className="w-20 bg-gray-200 rounded-full h-2 relative overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${getTemperatureColor(temperature)}`}
          style={{ 
            width: `${animatedTemp}%`,
            transition: 'width 1s ease-out'
          }}
        />
      </div>
      <span className={`text-sm font-medium ${
        temperature <= 25 ? 'text-blue-600' :
        temperature <= 50 ? 'text-green-600' :
        temperature <= 75 ? 'text-yellow-600' : 'text-orange-600'
      }`}>
        {temperature}°C
      </span>
    </div>
  );
};

const Growth = () => {
  const [retrospectives, setRetrospectives] = useState<RetrospectiveCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    const loadRetrospectives = async () => {
      try {
        const data = await mockAPI.getRetrospectives();
        setRetrospectives(data);
      } catch (error) {
        console.error('회고 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRetrospectives();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await mockAPI.markAsRead(id);
      setRetrospectives(prev => 
        prev.map(item => 
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await mockAPI.addLike(id);
      setRetrospectives(prev => 
        prev.map(item => 
          item.id === id ? { ...item, likes: item.likes + 1 } : item
        )
      );
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleToggleLike = async (id: string) => {
    const item = retrospectives.find(r => r.id === id);
    if (!item) return;

    try {
      if (item.isLiked) {
        await mockAPI.removeLike(id);
        setRetrospectives(prev => 
          prev.map(item => 
            item.id === id ? { ...item, likes: item.likes - 1, isLiked: false } : item
          )
        );
      } else {
        await mockAPI.addLike(id);
        setRetrospectives(prev => 
          prev.map(item => 
            item.id === id ? { ...item, likes: item.likes + 1, isLiked: true } : item
          )
        );
      }
    } catch (error) {
      console.error('성찰 목표 처리 실패:', error);
    }
  };

  const filteredRetrospectives = retrospectives.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnread = !showUnreadOnly || !item.isRead;
    return matchesSearch && matchesUnread;
  });

  const groupedByDate = filteredRetrospectives.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, RetrospectiveCard[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">회고 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center space-x-2">
            <span>회고피드</span>
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-xs text-white">📝</span>
            </div>
          </h1>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-6 lg:mb-8">
            <button className="bg-blue-500 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              공유받은 회고
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-2 lg:px-3 py-2 rounded-lg hover:bg-gray-100">
              <span className="text-sm">더 보기</span>
              <ChevronDown size={16} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
              <Plus size={16} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">안 읽은 회고만 보기</span>
            </label>
            <button 
              onClick={() => {
                retrospectives.forEach(item => {
                  if (!item.isRead) {
                    handleMarkAsRead(item.id);
                  }
                });
              }}
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              모두 읽음
            </button>
            <div className="flex-1 hidden sm:block"></div>
            <div className="relative w-full sm:w-auto">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="작성자, 학급, 내용 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Alert message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 lg:mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">📝</span>
            </div>
            <div>
              <p className="font-medium text-blue-800">아직 오늘의 회고를 작성하지 않았어요.</p>
              <p className="text-sm text-blue-600">클릭하면 오늘의 일일 회고를 바로 시작할 수 있어요.</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-blue-600" />
        </div>

        {/* Retrospective cards grouped by date */}
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date} className="mb-8 lg:mb-10">
            {/* Date header */}
            <div className="mb-6">
              <h2 className="text-base lg:text-lg font-medium text-gray-600">{date} (목)</h2>
            </div>

            {/* Cards for this date */}
            <div className="space-y-8">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white border rounded-lg p-4 lg:p-6 hover:shadow-sm transition-all cursor-pointer ${
                    item.isRead 
                      ? 'border-gray-200' 
                      : 'border-blue-200 bg-blue-50/30'
                  }`}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.author.name} 학생</p>
                        <p className="text-sm text-gray-500">{item.author.class}</p>
                      </div>
                    </div>
                    <TemperatureBar temperature={item.temperature} />
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} />
                        <span>코멘트 {item.comments}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(item.id);
                        }}
                        className={`flex items-center space-x-1 transition-colors hover:scale-105 ${
                          item.isLiked 
                            ? 'text-blue-600' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp size={16} />
                        <span>성찰 목표 {item.likes}</span>
                      </button>
                    </div>
                    <div className={`text-sm font-medium ${
                        item.isRead 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-600'
                      }`}
                    >
                      {item.isRead ? '읽음' : '읽지 않음'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty state messages */}
        {filteredRetrospectives.length === 0 && (
          <div className="text-center py-12">
            {showUnreadOnly ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">모든 회고를 읽었습니다!</h3>
                  <p className="text-gray-500">새로운 회고가 올라오면 알려드릴게요.</p>
                </div>
              </div>
            ) : searchTerm ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Search size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">검색 결과가 없습니다</h3>
                  <p className="text-gray-500">다른 키워드로 검색해보세요.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">회고가 없습니다</h3>
                  <p className="text-gray-500">첫 번째 회고를 작성해보세요.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-gray-800">박상민</p>
              <p className="text-sm text-gray-500">3-2</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-600">일일회고 작성일</span>
              </div>
              <span className="font-medium">1일</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-gray-400" />
                <span className="text-gray-600">작성한 코멘트</span>
              </div>
              <span className="font-medium">0개</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer size={16} className="text-gray-400" />
                <span className="text-gray-600">회고 온도</span>
              </div>
              <span className="font-medium">0°C</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-600">평균 3°C</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>0°C</span>
              <span>100°C</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:space-y-3 lg:block">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Smile size={16} className="text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">일일 회고</p>
                <p className="text-xs text-gray-500 hidden lg:block">하루를 되돌아보고 배운 점과 경험을 정리하기</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar size={16} className="text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">주간 회고</p>
                <p className="text-xs text-gray-500 hidden lg:block">일주일의 경험을 돌아보고 계획을 정리하기</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-pink-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">감사 카드 보관함</p>
                <p className="text-xs text-gray-500 hidden lg:block">일상 속 감사할 상대의 주고받기</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">피드백 보관함</p>
                <p className="text-xs text-gray-500 hidden lg:block">내 개인과 회고에 대한 피드백 받아보기</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Growth;