package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func main() {
	//input1
	// var id, password string
	// fmt.Scan(&id, &password) // fmt.Scan 함수의 두 번째 리턴값은 생략
	// fmt.Println(id, password

	// //input2
	// env_data, err := os.Open("config.json")
	// type Info struct {
	// 	Id  string
	// 	Pwd string
	// }
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// var info Info
	// byteValue, _ := ioutil.ReadAll(env_data)
	// json.Unmarshal(byteValue, &info)

	// // api_login
	// login_api := "https://accounts.interpark.com/login/submit"
	// client := &http.Client{}
	// bodyData := url.Values{
	// 	"postProc": {"FULLSCREEN"},
	// 	"LOGIN_TP": {"1500"},
	// 	"formSVC":  {"inpark"},
	// 	"bizId":    {"15"},
	// 	"userId":   {info.Id},
	// 	"userPwd":  {info.Pwd},
	// }
	// req, _ := http.NewRequest("POST", login_api, bytes.NewBufferString(bodyData.Encode()))
	// log.Println(bytes.NewBufferString(bodyData.Encode()))
	// req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	// req.Header.Add("Host", "accounts.interpark.com")
	// req.Header.Add("x-requested-with", "XMLHttpRequest")
	// resp, err := client.Do(req)
	// if err != nil {
	// 	log.Fatalln(err)
	// }
	// defer resp.Body.Close()
	// headers := resp
	// body, err := ioutil.ReadAll(resp.Body)
	// if err != nil {
	// 	log.Fatalln(err)
	// }

	// data := string(body)

	// log.Println(data, headers)

	check_login()
}
func check_login() {
	fmt.Print("work")
	check_log_in_api := "https://www.interpark.com/api/member/point/nolpoint"
	client := &http.Client{}
	// bodyData := url.Values{}
	req, _ := http.NewRequest("POST", check_log_in_api, nil)
	req.Header.Add("Cookie", "id_token=eyJraWQiOiI4RVVRbzRaX0VNYjdaVFR6ek9CRFF3WXhwaENMSlFYM21iZkhnbjQwRlJVIiwiYWxnIjoiUlMyNTYifQ.eyJhY2Nlc3NfdG9rZW4iOiJ5N0NUT0RmVld5K2J1anA0VlZKZnNkXC9MYmZKbUVES1lLcTAybk5vRGd5WDh5akVmOU91N2g3NTNMZjYzUzN5QiIsInN1YiI6InFaZmZFUkJFaGx2S3lmUVJMNW5Kb3c9PSIsImF1ZCI6ImludGVycGFyay1wYyIsImlzcyI6Imh0dHBzOlwvXC9hY2NvdW50cy5pbnRlcnBhcmsuY29tIiwiZXhwIjoxNzIyMTc1MTg3LCJpYXQiOjE3MjIxNjk3ODcsIm1ubyI6IlRTaThaM0JPdVp6XC9GSWJKMG02WlRRPT0iLCJzaWQiOiJkcnBaaUZ5M0ptSlFcL3NGNEdVRVN0QnpHVWx5QXVmRVpaNDVVeVBpOVcyYz0ifQ.d18QLVLnOp_PO4rvxaSM3Ht4ECR1rCEkgAgrVqDpOjW0Crgqi8qz7rSxbpVeRtMYXQwecCPlksvBPXHu5l2JDww49HKH6PKN9goBVAHzAHeC0_wd4tuSv3tN58ONuR3DxMXnuWS1xNE_ackA_2W4egntUamvtmxyHHkLN6MU75eiWVHUQCnAR7_SxoJh8b3sfm8gIWyYm9urbheR_GU0C6k0JV-NpoZNyiTDmz8ZhUHFHE4Q4gs_NS1R-ll1nAz2Y6AxfsNkFguFim4LuXxcYM9tBPNj6HTdli-wcInlwxSjqIwTiDZsrDSZ7-W_b0UbaY1G_FjLtTTFMRuJmjGrDg;")
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
func cookie(key string, value string) string {
	result := key + "=" + value + `; Path=/; Expires=Mon, 28 Jul 2025 12:43:40 GMT;`
	return result
}
func cookies() {

}
