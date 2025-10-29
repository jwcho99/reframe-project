import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import axiosInstance from '../api/axiosInstance'; // 우리가 만든 axiosInstance 사용
import { Box, Button, CircularProgress, Typography, Stack, Paper } from '@mui/material';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';


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
    <Box sx={{ mt: 4, mb: 4 }}> {/* 페이지 상하 여백 추가 */}
      <PageTitle title="🖼️ AI 사진 복원" />
      <Typography variant="body1" color="text.secondary" paragraph> {/* 설명 텍스트 스타일 */}
        오래되거나 손상된 사진(특히 인물 사진)을 업로드하면 AI가 선명하게 복원해줍니다.
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}> {/* 버튼들을 가로로 배치하고 간격 추가 */}
          <Button variant="contained" component="label" disabled={isLoading}>
            이미지 선택
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading || !selectedFile}>
            {isLoading ? '복원 중...' : '복원하기'}
          </Button>
        </Stack>
      </form>

      {/* 로딩 상태 표시 */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4, flexDirection: 'column' }}> {/* 세로 중앙 정렬 */}
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>AI가 이미지를 복원하고 있습니다...</Typography>
        </Box>
      )}

      {/* 결과 비교 슬라이더 */}
      {previewImage && restoredImage && !isLoading && (
        <Paper elevation={3} sx={{ mt: 4, p: 3, maxWidth: '800px', mx: 'auto' }}> {/* 카드 형태 배경 추가 */}
          <Typography variant="h6" gutterBottom align="center"> {/* 중앙 정렬 */}
            결과 비교 (슬라이더를 움직여보세요)
          </Typography>
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={previewImage} alt="Original Image" style={{ objectFit: 'contain' }} />}
            itemTwo={<ReactCompareSliderImage src={restoredImage} alt="Restored Image" style={{ objectFit: 'contain' }} />}
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9' }} // 가로세로 비율 조정 (선택 사항)
          />
          {/* 전체 화면 및 다운로드 버튼 (기능은 추후 추가) */}
          <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
            <Button size="small" variant="outlined">전체 화면</Button>
            <Button size="small" variant="outlined" href={restoredImage} download="restored_image.png">다운로드</Button> {/* 다운로드 링크 추가 */}
          </Stack>
        </Paper>
      )}

      {/* 원본 미리보기 (복원 전) */}
      {previewImage && !restoredImage && !isLoading && (
         <Box sx={{ mt: 4, textAlign: 'center' }}> {/* 중앙 정렬 */}
             <Typography variant="h6" gutterBottom>원본 이미지 미리보기</Typography>
             <img src={previewImage} alt="Original Preview" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} /> {/* 크기 및 비율 조절 */}
         </Box>
      )}
    </Box>
  );
}

export default PhotoRestorer;