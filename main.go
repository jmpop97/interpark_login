package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	//input
	// var id, password string
	// fmt.Scan(&id, &password) // fmt.Scan 함수의 두 번째 리턴값은 생략
	// fmt.Println(id, password)
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	fmt.Println("env [userId]:", os.Getenv("userId"))

	// // api_login
	// login_api := "https://accounts.interpark.com/login/submit"
	// client := &http.Client{}
	// bodyData := url.Values{
	// 	"postProc": {"FULLSCREEN"},
	// 	"LOGIN_TP": {"1500"},
	// 	"formSVC":  {"inpark"},
	// 	"bizId":    {"15"},
	// 	"userId":   {""},
	// 	"userPwd":  {""},
	// }

	// req, _ := http.NewRequest("POST", login_api, bytes.NewBufferString(bodyData.Encode()))
	// req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	// resp, err := client.Do(req)
	// if err != nil {
	// 	log.Fatalln(err)
	// }
	// defer resp.Body.Close()

	// body, err := ioutil.ReadAll(resp.Body)
	// if err != nil {
	// 	log.Fatalln(err)
	// }

	// data := string(body)

	// log.Println(data)
}
