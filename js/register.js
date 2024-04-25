
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

   const formData = new FormData(this); 

    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    const url = "http://localhost:5193/api/Member/Register"; 

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData), // 將表單資料轉換成 JSON 字串送出
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('伺服器回應錯誤');
                }
                return response.json(); // 解析回傳的 JSON
            })
            .then(data => {
                // 在這裡處理從後端收到的回應
                console.log(data);
                // 可以在這裡添加一些反饋給使用者的動作，例如顯示註冊成功訊息或導向其他頁面
                alert('註冊成功！');
            })
            .catch(error => {
                // 處理錯誤
                console.error('發生錯誤:', error);
            });
        });