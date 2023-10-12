import { useState, useEffect } from 'react';
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';
import './Tictoc.css';
import axios from 'axios';

const today_is = new Date().toISOString().slice(0, 10);

const Tictoc = () => {
  // 시작 시간
  const [startTime, setStartTime] = useState<Date | null>(null);
  // 공부한 시간 (재생 한번당)
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // intervalId를 받아 현재 시간 측정중인지!
  const [intervalId, setIntervalId] = useState<number | null>(null);
  // 날짜의 데이터를 가져와서 있다면 값을 넣어주고 없다면 기본값인 0으로
  const [studiedData, setStudiedData] = useState(0);
  
  const FetchStudyData = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // 해당 날짜의 공부 데이터 가져오기
    // 없으면 기본값인 0
    axios.post('http://localhost:8000/api/start_studying', 
      { date: formattedDate },
      { withCredentials: true }
    ) .then ((response) => {
        const timerData = response.data.studyTimer.study;
        // 어떤식으로 빈배열을 말하게 될지 몰라서 일단 다 넣어놓음
        if (timerData !== undefined && timerData !== null && timerData !== 0){
          setStudiedData(timerData);
          // 공부 시작 시간을 업데이트합니다.
          setStartTime(new Date());
        }
      }
    ) .catch((error) => {
      console.error('Study 데이터를 불러오는 중에 오류가 발생했습니다.', error);
    });
  }

  // 버튼 클릭 시 시간 측정 시작
  const startTimer = () => {
    FetchStudyData();

    // 이미 재생 버튼을 누른 상태라면
    if (intervalId !== null) {
      console.log('이미 공부 시간이 측정되는 중입니다.');
      return;
    }

    // 공부 시작 시간 새로 받기
    setStartTime(new Date());

    // setInterval 시작하고 인터벌 ID를 저장
    const id = window.setInterval(() => {
      // 현재 시간 1초에 한번씩 계속 받아오기
      const currentTime = new Date();
      // 저장되어있던 시간을 차에 더해준다.
      const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + studiedData : 0;
      // 그리고 그 값을 elapsedTime에 넣어줌
      setElapsedTime(elapsedMilliseconds);
    }, 1000);
    setIntervalId(id); // 인터벌 ID 저장
  };

  // 비동기 처리
  useEffect(() => {
    FetchStudyData();

    // 시작 시간이 변경될 때마다 경과 시간 계산
    if (startTime !== null) {
      const interval = setInterval(() => {
        const currentTime = new Date();
        const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + studiedData : 0;
        setElapsedTime(elapsedMilliseconds);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const timepause = () => {
    // setInterval을 중지하고 intervalId를 초기화 시킨다
    if (intervalId) {
      setStartTime(null);
      clearInterval(intervalId);
      setIntervalId(null);

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      axios.post('http://localhost:8000/api/pause_studying', 
        { date: formattedDate, study: elapsedTime },
        { withCredentials: true }
      )
    }   
  }

  // 밀리초를 시, 분, 초로 변환
  const millisecondsToTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    // 10미만인 경우 앞에 0을 붙여서 fomatting해주기로
    const formattedHours = hours % 24 < 10 ? `0${hours % 24}` : hours % 24;
    const formattedMinutes = minutes % 60 < 10 ? `0${minutes % 60}` : minutes % 60;
    const formattedSeconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
  
    return {
      hours: formattedHours,
      minutes: formattedMinutes,
      seconds: formattedSeconds,
    };
  };

  // 저장된 시간 포맷에~
  const formattedTime = millisecondsToTime(elapsedTime);

  return (
    <>
      <div className='tictoc'>
        <h1 className='today-is'>{today_is}</h1>
        {elapsedTime >= 0 && (
          <h1 className='format-time'>{formattedTime.hours} : {formattedTime.minutes} : {formattedTime.seconds}</h1>
        )}
        {intervalId === null ? (
          <BsFillPlayCircleFill size='140' className='tictoc-btn' onClick={startTimer}/>
        ) : (
          <BsFillPauseCircleFill size='140' className='tictoc-btn' onClick={timepause}/>
        )} 
      </div>
    </>
  );
};

export default Tictoc;