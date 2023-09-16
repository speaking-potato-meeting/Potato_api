import { useState, useEffect } from 'react';
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';
import './Tictoc.css';

const today_is = new Date().toISOString().slice(0, 10);

const Tictoc = () => {
  // 시작 시간
  const [startTime, setStartTime] = useState<Date | null>(null);
  // 공부한 시간 (재생 한번당)
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // intervalId를 받아 현재 시간 측정중인지!
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // 현재 날짜를 문자열로 가져옵니다.
  const currentDate = new Date().toISOString().slice(0, 10);
  // localStorage에서 해당 날짜의 데이터를 가져옵니다.
  const storedData = localStorage.getItem(currentDate);
  // 저장된 공부시간 가져오기!
  const savedStudyTime = localStorage.getItem('studyTime');
  // 문자열을 10진수 정수 number로 변환합니다.
  const studyTime = savedStudyTime ? parseInt(savedStudyTime, 10) : 0;


  // 버튼 클릭 시 시간 측정 시작
  const startTimer = () => {
    // 시간 측정 중이 아니라면!
    if (intervalId === null) {
      // 해당 날짜의 데이터가 있다면 기록된 시간 가져와서 거기에 더해주고
      if (storedData) {
        // 저장되어있던 시간을 불러와서
        const parsedData = JSON.parse(storedData);
        const storedStudyTimeInt = parsedData.studyTime ? parseInt(parsedData.studyTime, 10) : 0;
        // 공부 시작 시간 새로 받기
        setStartTime(new Date());
        // setInterval 시작하고 인터벌 ID를 저장
        const id = window.setInterval(() => {
        // 현재 시간 1초 당 계속 받아오기
        const currentTime = new Date();
        // 저장되어있던 시간을 차에 더해준다.
        const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + storedStudyTimeInt : 0;
        // 그리고 그 값을 elapsedTime에 넣어줌
        setElapsedTime(elapsedMilliseconds);
        console.log('해당 날짜의 데이터가 있습니다.')
        console.log(elapsedMilliseconds) // 0
        }, 1000);
        setIntervalId(id); // 인터벌 ID 저장
      } 
      else {
        setStartTime(new Date());
        const id = window.setInterval(() => {
        const currentTime = new Date();
        const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + studyTime : 0;
        setElapsedTime(elapsedMilliseconds);
        }, 1000);
        setIntervalId(id); // 인터벌 ID 저장
        console.log('해당 날짜의 데이터가 없습니다.')
      };
    }
  };
  
  // 비동기 처리
  useEffect(() => {
    // 시작 시간이 변경될 때마다 경과 시간 계산
    if (startTime !== null) {
      const interval = setInterval(() => {
        if (storedData) {
          // 저장되어있던 시간을 불러와서
          const parsedData = JSON.parse(storedData);
          const storedStudyTimeInt = parsedData.studyTime ? parseInt(parsedData.studyTime, 10) : 0;
          // 현재 시간 1초 당 계속 받아오기
          const currentTime = new Date();
          // 저장되어있던 시간을 차에 더해준다.
          const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + storedStudyTimeInt : 0;
          // 그리고 그 값을 elapsedTime에 넣어줌
          setElapsedTime(elapsedMilliseconds);
        } else {
          // 때마다 시간 가지고 와서 시간 차 계산하고 elapsedTime에 넘겨주기
          const currentTime = new Date();
          // 계산 똑같이
          const elapsedMilliseconds = startTime ? currentTime.getTime() - startTime.getTime() + studyTime : 0;
          setElapsedTime(elapsedMilliseconds);
        };
        
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
      
      // 해당 날짜의 데이터가 있다면
      if (storedData) {
        const parsedData = JSON.parse(storedData);    
        // 저장되어있던 날짜에 새로 측정한 시간을 넣어주기만 하면 됨
        const updateData = { ...parsedData, "studyTime": elapsedTime.toString() };
        const studyJsonString = JSON.stringify(updateData);
        localStorage.setItem(parsedData.date, studyJsonString);
      } else {
        // 해당 날짜의 데이터가 아직 없는 경우
        // 오늘 날짜에 저장된 시간 넣어주면 됨
        const studyData = { "username": 'coenffl', "date": currentDate, "studyTime": elapsedTime.toString() };
        const studyJsonString = JSON.stringify(studyData);
        localStorage.setItem(currentDate, studyJsonString);
      }
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
  );
};

export default Tictoc;