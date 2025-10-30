import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import axiosInstance from '../api/axiosInstance'; // 우리가 만든 axiosInstance 사용
import { Box, Button, CircularProgress, Typography, Stack, Paper, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';


function PhotoRestorer() {
  const [selectedFile, setSelectedFile] = useState(null); // 선택한 파일 객체
  const [previewImage, setPreviewImage] = useState('');   // 미리보기 이미지 URL
  const [restoredImage, setRestoredImage] = useState(''); // 복원된 이미지 URL
  const [isLoading, setIsLoading] = useState(false);      // 로딩 상태

  const [openModal, setOpenModal] = useState(false);
  const [modalImage, setModalImage] = useState(''); // Modal에 보여줄 이미지 URL


  const handleOpenModal = (imageUrl) => {
    setModalImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalImage('');
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 1, // 이미지 주변 여백 최소화
    outline: 'none', // 포커스 테두리 제거
    maxWidth: '95vw', // 화면 너비의 95%
    maxHeight: '95vh', // 화면 높이의 95%
    overflow: 'auto', // 이미지가 클 경우 스크롤 가능
  };


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

  const handleDownload = async () => {
    if (!restoredImage) return;

    try {
      // 1. 이미지 URL로부터 이미지 데이터를 가져옵니다 (CORS 주의 필요)
      const response = await fetch(restoredImage);
      // 2. 응답 데이터를 Blob (Binary Large Object) 형태로 변환합니다.
      const blob = await response.blob();
      // 3. Blob 데이터를 가리키는 임시 URL을 생성합니다.
      const blobUrl = window.URL.createObjectURL(blob);
      // 4. 보이지 않는 임시 링크(<a> 태그)를 만듭니다.
      const link = document.createElement('a');
      link.href = blobUrl;
      // 5. 다운로드될 파일 이름을 지정합니다. (원본 파일 이름 활용 가능)
      const fileName = selectedFile ? `restored_${selectedFile.name}` : 'restored_image.png';
      link.setAttribute('download', fileName);
      // 6. 링크를 클릭하여 다운로드를 시작합니다.
      document.body.appendChild(link);
      link.click();
      // 7. 임시 링크와 URL을 정리합니다.
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("다운로드 중 오류 발생:", error);
      alert("파일 다운로드 중 오류가 발생했습니다.");
      // 직접 링크를 열어주는 fallback (CORS 오류 발생 시 유용)
      window.open(restoredImage, '_blank');
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
            <Button size="small" variant="outlined" onClick={() => handleOpenModal(restoredImage)}>전체 화면 (복원)</Button>
            {/* 원본 이미지 전체 화면 버튼도 추가 가능 */}
            <Button size="small" variant="outlined" onClick={() => handleOpenModal(previewImage)}>전체 화면 (원본)</Button>
            <Button size="small" variant="outlined" onClick={handleDownload}>다운로드</Button>
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
      {/* 모달 창 */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="fullscreen-image-modal"
        aria-describedby="image-viewer"
      >
        <Box sx={modalStyle}>
           {/* 닫기 버튼 */}
           <IconButton
             aria-label="close"
             onClick={handleCloseModal}
             sx={{ position: 'absolute', top: 8, right: 8, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
           >
             <CloseIcon />
           </IconButton>
           {/* 이미지 */}
           <img src={modalImage} 
                alt="Fullscreen view" 
                style={{
                display: 'block',
                // width: '100%', // 너비 100% 대신
                height: '100%',   // 높이를 100%로 설정 (모달 높이에 맞춤)
                width: 'auto',    // 너비는 비율에 맞게 자동 조절
                maxHeight: 'calc(95vh - 16px)', // 최대 높이 제한은 유지
                // 이미지가 컨테이너 안에 비율 맞춰 보이도록 object-fit 추가
                objectFit: 'contain',
                // 중앙 정렬을 위해 추가 (선택 사항)
                margin: 'auto',
             }} />
        </Box>
      </Modal>
    </Box>
  );
}

export default PhotoRestorer;