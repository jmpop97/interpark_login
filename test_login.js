let xhr = new XMLHttpRequest();
xhr.open('POST', 'https://accounts.interpark.com/login/submit');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
xhr.setRequestHeader('accept', 'application/json, text/javascript, */*; q=0.01');
xhr.send("userId=${id}&userPwd=${password}");
xhr.onload = () => {
    if(xhr.status === 201) {
        //201 상태코드는 요청이 성공적으로 처리 됬다는말/ 일반적으로 POST요청에 대한 응답
        const res = JSON.parse(xhr.response); // 응답데이터를 JSON.parse 함수의 JSON 객체로 변경
        console.log(res); //응답데이터 출력
    } else {
        //에러발생
        console.error(xhr.status, xhr.statusText); //응답상태와 응답 메시지 출력
    }
}