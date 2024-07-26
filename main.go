package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
)

func main() {
	//input
	// var id, password string
	// fmt.Scan(&id, &password) // fmt.Scan 함수의 두 번째 리턴값은 생략
	// fmt.Println(id, password)
	//사용자 정보가 담겨 있는 json 파일
	env_data, err := os.Open("config.json")
	type Info struct {
		Id  string
		Pwd string
	}
	//에러 확인
	if err != nil {
		fmt.Println(err)
	}

	//open한 json을 읽는다
	var info Info
	byteValue, _ := ioutil.ReadAll(env_data)
	json.Unmarshal(byteValue, &info)
	fmt.Println(info.Id)

	// api_login
	login_api := "https://accounts.interpark.com/login/submit"
	client := &http.Client{}
	bodyData := url.Values{
		"postProc": {"FULLSCREEN"},
		"LOGIN_TP": {"1500"},
		"formSVC":  {"inpark"},
		"bizId":    {"15"},
		"userId":   {info.Id},
		"userPwd":  {info.Pwd},
	}

	req, _ := http.NewRequest("POST", login_api, bytes.NewBufferString(bodyData.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	data := string(body)

	log.Println(data)
}
