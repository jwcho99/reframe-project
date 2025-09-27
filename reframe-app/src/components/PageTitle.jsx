import React from 'react';

// 함수의 파라미터로 { title }을 받는 부분에 주목하세요.
// 이것이 부모로부터 'title'이라는 이름의 prop을 전달받는 문법입니다.
function PageTitle({ title }) {
  // 전달받은 title 변수를 <h1> 태그 안에 표시합니다.
  return <h1>{title}</h1>;
}

export default PageTitle;