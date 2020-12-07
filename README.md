# 建中資訊社第33屆 社網  
半成品qwq  
## 連線Database(postgresql)
### 外部(本機test, 社團server, etc.)  
* 使用公開IP  
* 以下是從gcp sql管理頁面看到的畫面  
![](https://i.imgur.com/15hK4xn.png)  
* 連線步驟:  
    1. 將本機IP加入gcp sql server(不 我不是說M$的那個)的白名單  
        如果不知道IP就到[這裡](https://www.whatismyip.com.tw/)查  
        但你可能是浮動IP，不能連線可能是因為你新的IP不在白名單  
    2. 連線(host=sql server的IP)，有問題再說  
### GCP Cloud Run
* [參考這篇](https://cloud.google.com/sql/docs/postgres/connect-run)

## Deployments  
* [gcp cloud run](https://infor33rd-vqf5pcbabq-de.a.run.app/)  