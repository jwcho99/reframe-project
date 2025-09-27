import React from 'react';
import PageTitle from '../components/PageTitle';
import Counter from '../components/Counter'; // Counter 컴포넌트 불러오기

function Home() {
  return (
    <div>
      <PageTitle title="🏠 홈 페이지에 오신 것을 환영합니다!" />
      <hr /> {/* 구분선 추가 */}
      <Counter /> {/* 카운터 컴포넌트 사용 */}
    </div>
  );
}

export default Home;