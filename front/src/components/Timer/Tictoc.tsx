import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';
import './Tictoc.css';
import axios from 'axios';

const Tictoc = () => {
  const today_is = new Date().toISOString().slice(0, 10);
  
  // 공부한 시간 (재생 한번당)
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // intervalId를 받아 현재 시간 측정중인지!
  const [intervalId, setIntervalId] = useState<number | null>(null);
  // 날짜의 데이터를 가져와서 있다면 값을 넣어주고 없다면 기본값인 0으로
  const [studiedData, setStudiedData] = useState(0);
  // 현재 라우트의 URL 파라미터 값
  const currentURL = useLocation();

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const FetchStudyData = async () => {
    try {
      // 해당 날짜의 공부 데이터 가져오기
      // 없으면 기본값인 0
      const response = await axios.get(
        'http://localhost:8000/api/study_timers/date_range/',
        {
          params: {
            from_date: formattedDate,
            to_date: formattedDate
          },
          withCredentials: true
        }
      );
      const timerData = response.data[0].study;
      if (timerData !== null) {
        setStudiedData(timerData);
      }
    } catch (error) {
      console.error('Study 데이터를 불러오는 중에 오류가 발생했습니다.', error);
    }
  };

  useEffect(()=> {
    FetchStudyData();
  }, []);

  // 버튼 클릭 시 시간 측정 시작
  const startTimer = async () => {
    // 이미 재생 버튼을 누른 상태라면
    if (intervalId !== null) {
      console.log('이미 공부 시간이 측정되는 중입니다.');
      return;
    }

    axios.post('http://localhost:8000/api/start_studying',
      { date: formattedDate },
      { withCredentials: true }
    )

    const id = window.setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000)
    }, 1000);

    setIntervalId(id);
  };

  const timepause = () => {
    // setInterval을 중지하고 intervalId를 초기화 시킨다
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);

      axios.post('http://localhost:8000/api/pause_studying',
        { date: formattedDate, study: elapsedTime + studiedData },
        { withCredentials: true }
      )
    }

    setStudiedData(elapsedTime + studiedData);
    setElapsedTime(0);
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
  const formattedTime = millisecondsToTime(elapsedTime + studiedData);

  if ( currentURL.pathname == '/stop-watch' ) {
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
  } else {
    return (
      <div className='bottom-tictoc-box'>
        <h1 className='bottom-tictoc-time'>{formattedTime.hours} : {formattedTime.minutes} : {formattedTime.seconds}</h1>
        <div className='bottom-tictoc-btns'>
          <BsFillPlayCircleFill color='rgb(10, 83, 202)' size='50' className='bottom-tictoc-btn' onClick={startTimer}/>
          <BsFillPauseCircleFill color='rgb(10, 83, 202)' size='50' className='bottom-tictoc-btn' onClick={timepause}/>
        </div>
      </div>
    );
  }

  
};

export default Tictoc;