const Url = "http://localhost:5193/api/Paradise/QA/6";
fetch(Url)
    .then(response => {
        if (!response.ok) {
            throw new Error('伺服器回應錯誤');
        }
        return response.json();
    })
    .then(data => {
        const qaContainer = document.querySelector('#allQA_title + div'); // 找到QA區域的容器

        // 清空之前的內容
        qaContainer.innerHTML = '';

        // 將每一條QA數據添加到HTML中
        data.Message.forEach(qa => {
            const qaElement = document.createElement('div');
            qaElement.classList.add('content');
            qaElement.innerHTML = `
                <p>會員帳號：${qa.Account}</p>
                <p>提問內容：${qa.Content}</p>
                <p>提問時間：${qa.CreateTime ? formatDateTime(qa.CreateTime) : ''}</p>
                <p>回覆內容：${qa.ReplyContent ? qa.ReplyContent : ''}</p>
                <p>回覆時間：${qa.ReplyTime ? formatDateTime(qa.ReplyTime) : ''}</p>
            `;
            qaContainer.appendChild(qaElement);
        });
        
    })
    .catch(error => {
        console.error('發生錯誤:', error);
    });

// 修改時間格式
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString); // 解析日期時間字符串
    const year = dateTime.getFullYear();
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2); //.slice(-2)取末兩位的數字
    const date = ('0' + dateTime.getDate()).slice(-2);
    const hours = ('0' + dateTime.getHours()).slice(-2);
    const minutes = ('0' + dateTime.getMinutes()).slice(-2);
    const seconds = ('0' + dateTime.getSeconds()).slice(-2);

    const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}
