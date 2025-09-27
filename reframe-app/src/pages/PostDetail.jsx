import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState(''); // 새 댓글 입력을 위한 state
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 데이터를 가져오는 함수를 분리하여 재사용하기 쉽게 만듭니다.
  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/community/posts/${postId}/`);
      setPost(response.data);
    } catch (error) {
      console.error('게시글을 불러오는 데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // 댓글 제출 처리 함수
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // 1. localStorage에서 토큰 가져오기
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert("댓글을 작성하려면 로그인이 필요합니다.");
    return;
  }
  // 2. 헤더 설정
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    // 3. post 요청에 데이터와 함께 config 전달
    await axios.post(`http://127.0.0.1:8000/api/community/posts/${postId}/comments/`, {
      content: newComment,
    }, config);
    
    fetchPost();
    setNewComment('');
  } catch (error) {
    console.error('댓글을 작성하는 데 실패했습니다.', error);
  }
};
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

  if (!post) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <PageTitle title={post.title} />
      <p>{post.content}</p>
      <small>작성일: {new Date(post.created_at).toLocaleDateString()}</small>
      <hr />

      {/* --- 수정/삭제 버튼 추가 --- */}
      {/* 현재 로그인한 유저(user)와 게시글 작성자(post.author)의 pk(ID)가 같을 때만 버튼을 보여줌 */}
      {user && user.pk === post.author && (
        <div>
          <Link to={`/community/${post.id}/edit`}>
            <button>수정</button>
          </Link>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
      {/* --- 여기까지 --- */}

      {/* 댓글 목록 */}
      <h3>댓글</h3>
      {post.comments && post.comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <small>작성일: {new Date(comment.created_at).toLocaleDateString()}</small>
        </div>
      ))}

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit">댓글 작성</button>
      </form>
    </div>
  );
}

export default PostDetail;