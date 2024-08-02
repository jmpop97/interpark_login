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
	var callback_url string
	var JSESSIONID string
	var id_token string
	var info InputValue

	info = input1()
	create_connection()
	callback_url, JSESSIONID = get_callback_url(info)
	id_token = login(callback_url, JSESSIONID)
	check_login_mypage(id_token)
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
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
}

func check_login_mypage(id_token string) string {
	check_log_in_api := "https://www.interpark.com/mypage"
	client := &http.Client{}
	// bodyData := url.Values{}
	req, _ := http.NewRequest("GET", check_log_in_api, nil)
	req.Header.Add("Cookie", "id_token="+id_token+";")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	datas := string(body)

	var data string
	data = filter_name(datas)
	return data
}

func filter_name(datas string) string {
	var end = len(datas)
	var korean []rune = []rune(datas)
	var check []rune = []rune(`"memNm":"`)
	var start = 0
	for i := 0; i < end && start < 8; i++ {
		for j := 0; i < end && j < 9; j++ {
			if korean[i] == check[j] {
				i++
				if j == 8 {
					start = i
				}
			} else {
				start = 0
				break
			}
		}
	}
	fmt.Printf(" 안녕하세요. ")
	for i := start; korean[i] != check[8]; i++ {
		fmt.Printf("%c", korean[i])
	}
	fmt.Printf("님!")
	return "test"
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

func create_connection() {
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
