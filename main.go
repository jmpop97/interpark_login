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
	create_JSESSIONID()
	var callback_url string
	var JSESSIONID string
	var id_token string
	callback_url, JSESSIONID = get_callback_url(info)
	id_token = login(callback_url, JSESSIONID)
	fmt.Println("id_token = " + id_token)
}

func input1() InputValue {
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
}

func check_login_mypage(info InputValue) {
	check_log_in_api := "https://www.interpark.com/_next/data/CQci7lqPuZOYI4_CbXD9M/mypage.json"
	client := &http.Client{}
	// bodyData := url.Values{}
	req, _ := http.NewRequest("GET", check_log_in_api, nil)
	req.Header.Add("Cookie", "id_token="+info.IdToken+";")
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

func get_callback_url(info InputValue) (string, string) {
	login_api := "https://accounts.interpark.com/login/submit"
	client := &http.Client{}
	bodyData := url.Values{
		"userId":   {info.Id},
		"userPwd":  {info.Pwd},
		"LOGIN_TP": {"1000"},
	}
	req, _ := http.NewRequest("POST", login_api, bytes.NewBufferString(bodyData.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Host", "accounts.interpark.com")
	req.Header.Add("x-requested-with", "XMLHttpRequest")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	s := string(body)
	var data map[string]interface{}
	err2 := json.Unmarshal([]byte(s), &data)
	if err != nil {
		panic(err2)
	}
	var callback_url string
	var JSESSIONID string
	callback_url = data["callback_url"].(string)
	cookies := resp.Cookies()
	for _, cookie := range cookies {
		if cookie.Name == "JSESSIONID" {
			JSESSIONID = cookie.Name + "=" + cookie.Value + ";"
			break
		}
	}
	return callback_url, JSESSIONID
}

func create_JSESSIONID() {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", "https://accounts.interpark.com/login/form", nil)
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
}

func login(callback_url string, JSESSIONID string) string {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", callback_url, nil)
	req.Header.Add("Cookie", JSESSIONID)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	cookies := resp.Cookies()
	for _, cookie := range cookies {
		if cookie.Name == "id_token" {
			return cookie.Value
		}
	}
	return "wrong id"
}
