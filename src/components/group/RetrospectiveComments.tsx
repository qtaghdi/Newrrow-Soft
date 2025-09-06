import React, { useState } from 'react';
import { MessageCircle, Send, Edit3, Trash2, User } from 'lucide-react';
import { RetrospectiveComment } from '@/types/group';

interface RetrospectiveCommentsProps {
  retrospectiveId: string;
  comments: RetrospectiveComment[];
  canComment: boolean; // 자신의 회고가 아닌 경우에만 댓글 가능
  onAddComment: (content: string) => void;
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: string;
}

const RetrospectiveComments = ({
  retrospectiveId,
  comments,
  canComment,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  currentUserId
}: RetrospectiveCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== handleSubmitComment 시작 ===');
    console.log('newComment:', newComment);
    console.log('retrospectiveId:', retrospectiveId);
    
    if (!newComment.trim()) return;
    
    onAddComment(newComment.trim());
    setNewComment('');
    console.log('=== handleSubmitComment 완료 ===');
  };

  const handleEditComment = (comment: RetrospectiveComment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim() || !editingComment) return;
    
    onUpdateComment(editingComment, editContent.trim());
    setEditingComment(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      onDeleteComment(commentId);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      {/* 댓글 토글 버튼 */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors mb-3"
      >
        <MessageCircle size={16} />
        <span>댓글 {comments.length}개</span>
        {comments.length > 0 && (
          <span className="text-xs">
            {showComments ? '숨기기' : '보기'}
          </span>
        )}
      </button>

      {showComments && (
        <div className="space-y-3">
          {/* 기존 댓글 목록 */}
          {comments.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
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
                          onClick={() => handleEditComment(comment)}
                          className="text-gray-400 hover:text-blue-600 p-1"
                          title="댓글 수정"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="댓글 삭제"
                        >
                          <Trash2 size={12} />
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
                        placeholder="댓글을 수정하세요..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSaveEdit}
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
          {canComment && (
            <form onSubmit={handleSubmitComment} className="mt-3">
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-medium text-gray-600">그</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                    placeholder="이 회고에 대한 피드백을 남겨보세요..."
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                    >
                      <Send size={14} />
                      <span>댓글 달기</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* 자신의 회고인 경우 안내 메시지 */}
          {!canComment && (
            <div className="text-center py-3">
              <p className="text-sm text-gray-500">자신의 회고에는 댓글을 달 수 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RetrospectiveComments;