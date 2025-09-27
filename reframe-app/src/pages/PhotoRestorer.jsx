import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import axiosInstance from '../api/axiosInstance'; // 우리가 만든 axiosInstance 사용

function PhotoRestorer() {
  const [selectedFile, setSelectedFile] = useState(null); // 선택한 파일 객체
  const [previewImage, setPreviewImage] = useState('');   // 미리보기 이미지 URL
  const [restoredImage, setRestoredImage] = useState(''); // 복원된 이미지 URL
  const [isLoading, setIsLoading] = useState(false);      // 로딩 상태

  // 파일 입력창에서 파일이 선택되었을 때 호출되는 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // 선택한 이미지 파일의 미리보기를 생성
      setPreviewImage(URL.createObjectURL(file));
      setRestoredImage(''); // 이전 결과 이미지는 초기화
    }
  };

  // '복원하기' 버튼을 눌렀을 때 호출되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('복원할 이미지를 선택해주세요.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    // FormData는 텍스트와 파일을 함께 보낼 수 있는 데이터 형식입니다.
    const formData = new FormData();
    formData.append('image', selectedFile); // 'image'라는 이름으로 파일 추가

    try {
      // Django의 사진 복원 API에 POST 요청
      const response = await axiosInstance.post('community/restore-photo/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수 헤더
        },
      });
      // 성공적으로 응답을 받으면, 복원된 이미지 URL을 state에 저장
      setRestoredImage(response.data.restored_image_url);
    } catch (error) {
      console.error('이미지 복원에 실패했습니다.', error);
      alert('이미지 복원에 실패했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료 (성공/실패 여부와 관계없이)
    }
  };

  return (
    <div>
      <PageTitle title="🖼️ AI 사진 복원" />
      <p>오래되거나 손상된 사진(특히 인물 사진)을 업로드하면 AI가 선명하게 복원해줍니다.</p>
      
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '복원 중...' : '복원하기'}
        </button>
      </form>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        {previewImage && (
          <div style={{ marginRight: '10px' }}>
            <h3>원본 이미지</h3>
            <img src={previewImage} alt="Original" width="300" />
          </div>
        )}
        {restoredImage && (
          <div>
            <h3>복원된 이미지</h3>
            <img src={restoredImage} alt="Restored" width="300" />
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoRestorer;