import React, { useState } from 'react'; // useState를 react로부터 불러옵니다.

function Counter() {
  // useState를 사용해 'count'라는 state 변수를 만듭니다.
  // 1. count: 현재 카운트 값 (읽기 전용)
  // 2. setCount: count 값을 변경할 때 사용하는 '유일한' 함수
  // 3. useState(0): count의 초기값(시작값)을 0으로 설정합니다.
  const [count, setCount] = useState(0);

  // 버튼이 클릭될 때 실행될 함수
  const handleIncrement = () => {
    // setCount 함수를 호출하여 count state를 1 증가시킵니다.
    // 이렇게 state를 변경하면 리액트가 화면을 자동으로 다시 그립니다.
    setCount(count + 1);
  };

  return (
    <div>
      <h3>카운터 예제</h3>
      <p>현재 클릭 횟수: {count}</p>
      <button onClick={handleIncrement}>클릭해서 숫자 올리기</button>
    </div>
  );
}

export default Counter;