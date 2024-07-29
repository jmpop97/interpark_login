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

type InputValue struct {
	Id      string
	Pwd     string
	IdToken string
}

func main() {
	var info InputValue
	info = input2()
	// log_in(info)
	// check_login()
	check_login_mypage(info)
}

func input1() InputValue {
	// fmt.Println(id, password
	var info InputValue
	fmt.Scan(&info.Id, &info.Pwd) // fmt.Scan 함수의 두 번째 리턴값은 생략
	return info

}
func input2() InputValue {
	env_data, err := os.Open("config.json")

	if err != nil {
		fmt.Println(err)
	}
	var info InputValue
	byteValue, _ := ioutil.ReadAll(env_data)
	json.Unmarshal(byteValue, &info)
	return info
}

func check_login_lpoint() {
	fmt.Print("work")
	check_log_in_api := "https://www.interpark.com/api/member/point/nolpoint"
	client := &http.Client{}
	// bodyData := url.Values{}
	req, _ := http.NewRequest("POST", check_log_in_api, nil)
	req.Header.Add("Cookie", "id_token=;")
	log.Println((req))
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	headers := resp
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	data := string(body)

	log.Println(data, headers)
}

func check_login_mypage(info InputValue) {
	fmt.Print("work")
	check_log_in_api := "https://www.interpark.com/_next/data/CQci7lqPuZOYI4_CbXD9M/mypage.json"
	client := &http.Client{}
	// bodyData := url.Values{}
	req, _ := http.NewRequest("GET", check_log_in_api, nil)
	req.Header.Add("Cookie", "id_token="+info.IdToken+";")
	log.Println((req))
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	headers := resp
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	data := string(body)

	log.Println(data, headers)
}

func log_in(info InputValue) {
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
	req.Header.Add("Host", "accounts.interpark.com")
	req.Header.Add("x-requested-with", "XMLHttpRequest")
	log.Print(req)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	headers := resp
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	data := string(body)

	log.Println(data, headers)
}
