import { useState, useEffect } from 'react';
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';
import './Tictoc.css';

// dummydata를 만들어서..
// 잘 작동하는지 보자구......

const today_is = new Date().toISOString().slice(0, 10);

const Tictoc = () => {
  // 시작 시간
  const [startTime, setStartTime] = useState<Date | null>(null);
  // 공부한 시간 (재생 한번당)
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // intervalId를 받아 현재 시간 측정중인지!
  const [intervalId, setIntervalId] = useState<number | null>(null);
  // 총 공부한 시간
  // 어차피 초깃값이 0이기 때문에 조건걸지않고 처음부터 공부한 시간에 더해줘도 됨
  // 근데 문제는 이렇게 하면 다음날까지도 이렇게 될수 있기 때문에
  // 현재 시간을 가지고 오는데
  // 날이 바뀌면(수->목) 오늘(수) 날짜데이터가 있는지 확인해보고 
  // 있다면 거기에(수요일 데이터) 더한후 이걸 다시 0으로 바꿔주어야할거같다
  // 없다면 새로운 데이터(수요일 데이터)에 이걸 집어넣어주고 0으로 바꿔줘야함
  // 그리고 브라우저를 끄면 중지 + 저장 기능도 만들어야함
  // 그리고... 가장 중요한... 브라우저를 끄지않고 
  const [studyTime, setStudyTime] = useState<number>(0);

  
  // 버튼 클릭 시 시간 측정 시작
  const startTimer = () => {
    // 시간 측정 중이 아니라면!
    if (intervalId === null) {
      // 공부 시작 시간 새로 받기
      setStartTime(new Date()); // 얘가 문제였음!
      console.log('공부 시작 시간 들어옵니다.')
      console.log(startTime) 
      // setInterval 시작하고 인터벌 ID를 저장
      const id = window.setInterval(() => {
        // 현재 시간 1초 당 계속 받아오기
        const currentTime = new Date();
        // null 체크 빼먹지 말자,,
        const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + studyTime : 0;
        // 무조건 값에 studyTime을 더해서 보여주면 되잖아...
        setElapsedTime(elapsedMilliseconds);
      }, 1000);
      setIntervalId(id); // 인터벌 ID 저장
    }
  };
  
  const timepause = () => {
    // setInterval을 중지하고 intervalId를 초기화 시킨다
    if (intervalId) {
      // 총 공부시간에 기존에 들어간 공부시간 저장하기
      setStudyTime(elapsedTime)
      console.log('공부시간 저장!')
      console.log(studyTime) // 공부시간이 저장되긴하는데 일회용이다...
      setStartTime(null);
      clearInterval(intervalId);
      setIntervalId(null);
    } 
  }

  // 비동기 처리
  useEffect(() => {
    // 시작 시간이 변경될 때마다 경과 시간 계산
    if (startTime !== null) {
      const interval = setInterval(() => {
        // 때마다 시간 가지고 와서 시간 차 계산하고 elapsedTime에 넘겨주기
        const currentTime = new Date();
        // 계산 똑같이
        const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + studyTime : 0;
        setElapsedTime(elapsedMilliseconds);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  // 밀리초를 시, 분, 초로 변환
  const millisecondsToTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return {
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  };

  // 저장된 시간 포맷에~
  const formattedTime = millisecondsToTime(elapsedTime);

  return (
    <div>
      <h1>{today_is}</h1>
      <BsFillPlayCircleFill size='50' className='tictoc-btn' onClick={startTimer}/>
      <BsFillPauseCircleFill size='50' className='tictoc-btn' onClick={timepause}/>
      {elapsedTime >= 0 && (
        <div>
          <h1>경과 시간:</h1>
          <h1>{formattedTime.hours} 시간 {formattedTime.minutes} 분 {formattedTime.seconds} 초</h1>
        </div>
      )}
    </div>
  );
};

export default Tictoc;
