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
  // 저장된 공부시간 가져오기!
  const savedStudyTime = localStorage.getItem('studyTime');
  // 문자열을 10진수 정수 number로 변환합니다.
  const studyTime = savedStudyTime ? parseInt(savedStudyTime, 10) : 0;


  // 버튼 클릭 시 시간 측정 시작
  const startTimer = () => {
    // 시간 측정 중이 아니라면!
    if (intervalId === null) {
      // 날짜 받아서 기록이 있는지 확인하고
      // 있다면 기록된 시간 가져와서 거기에 더해주고
      // 없다면 지금 방식대로 기록


      // 공부 시작 시간 새로 받기
      setStartTime(new Date()); // 얘가 문제였음!
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

  const timepause = () => {
    // setInterval을 중지하고 intervalId를 초기화 시킨다
    if (intervalId) {
      setStartTime(null);
      clearInterval(intervalId);
      setIntervalId(null);
      
      // 이제 해야할 것
      // 기존에 사용하고 있던 StudyTime 대신 이 친구들을...
      // 날짜를 받아서 어제와 같으면 같은 날짜의 데이터에 값을 저장해주고
      // 저장한 날짜값 불러오기
      // 현재 날짜를 문자열로 가져옵니다.
      const currentDate = new Date().toISOString().slice(0, 10);

      // localStorage에서 해당 날짜의 데이터를 가져옵니다.
      const storedData = localStorage.getItem(currentDate);

      if (storedData) {
        // 이미 해당 날짜의 데이터가 저장되어 있는 경우
        const parsedData = JSON.parse(storedData);
        const storedStudyTimeInt = parsedData.studyTime ? parseInt(parsedData.studyTime, 10) : 0;
        const updateStudyTime = storedStudyTimeInt + elapsedTime
        // 기존 데이터를 업데이트하거나 필요에 따라 처리합니다.
        const updateData = { "username": 'coenffl', "date": parsedData.date, "studyTime": updateStudyTime.toString() };
        const studyJsonString = JSON.stringify(updateData);
        localStorage.setItem(parsedData.date, studyJsonString);
      } else {
        // 해당 날짜의 데이터가 아직 없는 경우
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