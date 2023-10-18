import React from 'react'
import '../MyPage.css';

const MyPage = () => {
  return (
    <div className='MyPage'>
      {/* 프로필 사진 및 개인정보 수정 버튼 등 */}
      <div className='mypage-first-box'>
        <div className='mypage-profile-box'>
          <div className='mypage-profile-img-box'>
            <img className='mypage-profile-img' src="../images/230521_0.jpeg" alt="" />
          </div> 
          <div className='mypage-profile-content'>
            <p className='mypage-profile-nickname'>coenffl</p>
            <p>22.12.21~</p>
            <br/>
            <p>https://github.com/yangu1455</p>
            <p>https://github.com/yangu1455</p>
          </div>
        </div>
        <div>
          <div className='ballon-a'>
            <p>INFJ</p>
          </div>
          <div className='ballon-b'>
            <p>FE</p>
          </div>
        </div>
        <button className='mypage-profile-btn'>개인 정보 수정</button>
      </div>
      {/* 작성 댓글 + 공부 */}
      <div className='mypage-second-box'>
        <div className='mypage-comment-box'>
          <p>작성한 댓글 ⌨️</p>
          <div className='mypage-comment-list'>
            <p>아직 작성한 댓글이 없습니다.</p>
          </div>
        </div>
        <div className='mypage-study-box'>
          <p>📚</p>
          <div>
            <div className='mypage-study-money-box'>
              <p>벌금 합산 : 0{}원</p>
              <button className='mypage-money-reset-btn'>초기화</button>
            </div>
            <p>일주일 공부 합산 : 00{}시간</p>
            <p>페널티 : 2{}개</p>
            <p>면제권: 0{}개</p>
          </div>
        </div>
      </div>
      {/* 적용중인 규칙 */}
      <div className='mypage-third-box'>
        <p>현재 적용중인 규칙 ☑️</p>
        <table>
          <thead>
            <tr>
              <th>벌금</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3000원</td>
              <td>주 40시간 채우기</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyPage