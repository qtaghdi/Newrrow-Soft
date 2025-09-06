import React from 'react';
import { Construction, Clock, Code, ExternalLink } from 'lucide-react';

interface DevelopmentPageProps {
  title: string;
  description?: string;
}

const DevelopmentPage = ({ title, description }: DevelopmentPageProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-3 py-6 sm:px-6">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction size={40} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">
            {description || '이 페이지는 현재 개발 중입니다.'}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Clock size={16} />
            <span className="text-sm">개발 진행 중</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Code size={16} />
            <span className="text-sm">곧 만나보실 수 있습니다</span>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <a 
              href="https://dgsm.newrrow.com/csr-platform/home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">뉴로우 공식 홈페이지로 이동하기</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentPage;