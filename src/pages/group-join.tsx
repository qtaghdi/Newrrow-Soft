import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Key, ArrowRight, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { groupMockAPI } from '@/data/groupMockData';
import { GroupJoinResponse } from '@/types/group';

const GroupJoin = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string; role?: string }>({ type: null, text: '' });

  // 입력 검증 함수
  const validateJoinCode = (code: string) => {
    // 6자리 체크
    if (code.length !== 6) {
      return { isValid: false, message: '참여 코드는 정확히 6자리여야 합니다.' };
    }
    
    // 영문과 숫자만 허용 (한글 및 특수문자 제외)
    const validPattern = /^[A-Za-z0-9]+$/;
    if (!validPattern.test(code)) {
      return { isValid: false, message: '참여 코드는 영문과 숫자만 입력 가능합니다.' };
    }
    
    return { isValid: true, message: '' };
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      setMessage({ type: 'error', text: '참여 코드를 입력해주세요.' });
      return;
    }

    // 입력 검증
    const validation = validateJoinCode(joinCode.trim());
    if (!validation.isValid) {
      setMessage({ type: 'error', text: validation.message });
      return;
    }

    setIsLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const result: GroupJoinResponse = await groupMockAPI.joinGroup(joinCode.toUpperCase());
      
      if (result.success) {
        // 성공 알림 표시
        alert(`${result.group?.name}에 성공적으로 참여했습니다!`);
        
        // 해당 그룹 페이지로 이동
        if (result.group?.id) {
          navigate(`/group/${result.group.id}`);
        }
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '그룹 참여 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-2">
            <Key size={28} className="text-blue-600" />
            <span>그룹 참여하기</span>
          </h1>
          <p className="text-gray-600">참여 코드를 입력하여 새로운 그룹에 참여해보세요.</p>
        </div>

        {/* Join Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <form onSubmit={handleJoinGroup} className="space-y-4">
            <div>
              <div className="relative">
                <Key size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="joinCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="예: ABC123"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-center text-lg font-mono tracking-wider transition-colors ${
                    message.type === 'error' 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                그룹 관리자로부터 받은 6자리 코드를 입력하세요
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !joinCode.trim()}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>참여 중...</span>
                </>
              ) : (
                <>
                  <span>그룹 참여하기</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Message */}
          {message.type && (
            <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
            <Users size={20} />
            <span>참여 코드는 어떻게 받나요?</span>
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 6자리 영문과 숫자 조합으로 구성됩니다</li>
            <li>• 대소문자는 구분하지 않습니다</li>
            <li>• 코드가 없다면 그룹 관리자에게 문의하세요</li>
          </ul>
        </div>

        {/* Example Codes (개발용) */}
        <div className="mt-6 bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <h3 className="font-medium text-yellow-800 mb-2">테스트용 참여 코드</h3>
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="text-yellow-600" size={16} />
              <span className="text-sm font-medium text-yellow-800">숨겨진 그룹</span>
            </div>
            <button
              onClick={() => setJoinCode('MID005')}
              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded text-sm font-mono hover:bg-indigo-200 transition-colors mr-2"
            >
              MID005
            </button>
            <span className="text-xs text-yellow-700">특별한 장기 그룹</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ABC123', 'DEF456', 'GHI789', 'JKL012'].map((code) => (
              <button
                key={code}
                onClick={() => setJoinCode(code)}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-mono hover:bg-yellow-200 transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            개발 테스트용 코드입니다. 영문과 숫자 6자리 조합만 유효합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupJoin;