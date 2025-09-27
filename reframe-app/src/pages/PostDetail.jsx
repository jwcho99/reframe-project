import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 수정 기능을 위한 state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // 게시글 데이터를 불러오는 함수
  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/community/posts/${postId}/`);
      setPost(response.data);
    } catch (error) {
      console.error("게시글을 불러오는 데 실패했습니다.", error);
      navigate('/community'); // 게시글이 없으면 목록으로 이동
    }
  };

  // 컴포넌트가 처음 로드될 때 게시글 데이터를 불러옴
  useEffect(() => {
    fetchPost();
  }, [postId]);

  // 게시글 삭제 함수
  const handleDelete = async () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/community/posts/${postId}/`);
        alert("게시글이 삭제되었습니다.");
        navigate('/community');
      } catch (error) {
        console.error("게시글 삭제에 실패했습니다.", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  // 댓글 작성 함수
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/community/posts/${postId}/comments/`, {
        content: newComment,
      });
      fetchPost();
      setNewComment('');
    } catch (error) {
      console.error('댓글을 작성하는 데 실패했습니다.', error);
      alert('댓글을 작성하려면 로그인이 필요합니다.');
    }
  };

  // 댓글 삭제 함수
  const handleCommentDelete = async (commentId) => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/community/posts/${postId}/comments/${commentId}/`);
        alert("댓글이 삭제되었습니다.");
        fetchPost();
      } catch (error) {
        console.error("댓글 삭제에 실패했습니다.", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  // --- 댓글 수정 관련 함수들 ---
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleUpdateSubmit = async (commentId) => {
    try {
      await axiosInstance.patch(`/community/posts/${postId}/comments/${commentId}/`, {
        content: editingCommentContent,
      });
      alert("댓글이 수정되었습니다.");
      setEditingCommentId(null);
      fetchPost();
    } catch (error) {
      console.error("댓글 수정에 실패했습니다.", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };
  // --- 여기까지 ---


  if (!post) {
    return <div>로딩 중...</div>;
  }

  return (
    <Box>
      <PageTitle title={post.title} />
      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>{post.content}</Typography>
      <Typography variant="caption" display="block">
        작성자: {post.author_username || '알 수 없음'} | 작성일: {new Date(post.created_at).toLocaleDateString()}
      </Typography>
      
      {user && user.pk === post.author && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button component={Link} to={`/community/${post.id}/edit`} variant="contained" sx={{ mr: 1 }}>수정</Button>
          <Button onClick={handleDelete} variant="outlined" color="error">삭제</Button>
        </Box>
      )}

      <hr style={{ margin: '20px 0' }} />

      <Typography variant="h5" gutterBottom>댓글</Typography>
      
      {/* 댓글 목록 */}
      <Box sx={{ mb: 4 }}>
        {post.comments && post.comments.map(comment => (
          <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
            {editingCommentId === comment.id ? (
              // 수정 모드
              <Box>
                <TextField
                  fullWidth
                  multiline
                  value={editingCommentContent}
                  onChange={(e) => setEditingCommentContent(e.target.value)}
                />
                <Box sx={{ mt: 1 }}>
                  <Button onClick={() => handleUpdateSubmit(comment.id)} variant="contained" size="small" sx={{ mr: 1 }}>수정 완료</Button>
                  <Button onClick={handleCancelEdit} variant="outlined" size="small">취소</Button>
                </Box>
              </Box>
            ) : (
              // 일반 모드
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{comment.author_username || '익명'}:</strong> {comment.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" display="block">
                    작성일: {new Date(comment.created_at).toLocaleDateString()}
                  </Typography>
                  {user && user.pk === comment.author && (
                    <Box>
                      <Button size="small" onClick={() => handleEditClick(comment)}>수정</Button>
                      <Button size="small" color="error" onClick={() => handleCommentDelete(comment.id)}>삭제</Button>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
      
      {/* 댓글 작성 폼 */}
      <form onSubmit={handleCommentSubmit}>
        <TextField
          fullWidth
          label="댓글을 입력하세요"
          multiline
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button type="submit" variant="contained">댓글 작성</Button>
      </form>
    </Box>
  );
}

export default PostDetail;