import React, { useEffect, useState } from 'react'

const User = {
  id: 'coenffl',
  pw: 'chaessi0115@@'
}

export default function Login() {
  return (
    <div>
      <p>감자 맞나요?</p>
      <input type="text" placeholder='아이디를 입력해주세요'/>
      <input type="password" placeholder='비밀번호를 입력해주세요' />
      <button>확인</button>
    </div>
  )
}