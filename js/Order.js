fetch("http://localhost:5193/api/Cart/GetOrderItem", { credentials: 'include' })
    .then(response => {
        if (!response.ok) {
            throw new Error('伺服器回應錯誤');
        }
        return response.json();
    })
    .then(data => {
        console.log("123");
        
        const tableBody = document.querySelector("table tbody");
        if (data && data.length > 0) {
            data.forEach(order => {
                const newRow = document.createElement('tr');
                newRow.classList.add('tbody');
                newRow.innerHTML = `
                    <td>${order.orderId}</td>
                    <td>${order.orderTime ? formatDateTime(order.orderTime) : ''}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.orderStatus}</td>
                    <td>
                        <input type="submit" value="查詢" class="button2" data-OrderId="${order.orderId}">
                    </td>
                    <td>
                    ${order.orderStatus === "已出貨" ? `<input type="button" value="完成" class="buttonOK" data-OrderId="${order.orderId}">` : `<input type="button" value="完成" class="buttonOK_not" data-OrderId="${order.orderId}">`}
                    </td>                
                `;
                tableBody.appendChild(newRow);
            });
        }

        const detailButtons = document.querySelectorAll('.button2');

        detailButtons.forEach(button => {

            button.addEventListener('click', function() {
                const OrderId = button.getAttribute("data-OrderId");

                console.log(OrderId)
                console.log("123")

                fetch(`http://localhost:5193/api/Cart/GetOrderItemId?OrderId=${OrderId}`, { credentials: 'include' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('伺服器回應錯誤');
                        }
                        return response.json();
                    })
                    
                    .then(data => {
                        const modalContent = document.querySelector('.modal-content');
                        
                        modalContent.innerHTML = `
                            <span class="close">&times;</span>
                            <form>
                                <div>
                                    <h2>訂購商品：</h2>
                                </div>
                                <div class="create">
                                    ${data.map(item => `
                                        <div class="create">
                                            <div id="field1">◎ 【${item.brand}】  ${item.itemName}  ${item.space}  /  ${item.color} * ${item.itemNum} </p></div>
                                        </div>

                                    `).join('')}
                                </div>
                                <div>
                                    <h2>會員資訊：</h2>
                                </div>
                                <div class="create">
                                    <div id="field1"><p> ▸ 會員姓名：${data[0].name}</p></div>
                                </div>
                                <div class="create">
                                    <div id="field1"><p>▸ 電話號碼：${data[0].cellphone}</p></div>
                                </div>
                                <div class="create">
                                    <div id="field1"><p> ▸ 電子信箱：${data[0].email}</p></div>
                                </div>
                                <div class="create">
                                    <div id="field1"><p> ▸會員地址：${data[0].address}</p></div>
                                </div>
                            </form>
                        `;
                        modal.style.display = "block";
                        const closeBtn = document.querySelector('.close');
                        closeBtn.addEventListener('click', function() {
                            
                            modal.style.display = "none";
                        });


                        window.addEventListener('click', function(event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        });

                    })
                    .catch(error => {
                        console.error('發生錯誤:', error.message);
                    });
            });
        });


        const detailButtons2 = document.querySelectorAll('.buttonOK');

        detailButtons2.forEach(button => {
            button.addEventListener('click', function() {
                const OrderId = button.getAttribute("data-OrderId"); // 抓取data-OrderId
        
                console.log(OrderId)
        
                fetch("http://localhost:5193/api/Cart/OrderFinish", { 
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: OrderId // 將整數值直接作為請求主體
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('伺服器回應錯誤');
                    }
                    return response.json(); 
                })
                .then(data => {
                    console.log(data);
                    location.reload();
                })
                .catch(error => {
                    console.error('發生錯誤:', error);
                });
            });
        });
        

    })
    .catch(error => {
        console.error('發生錯誤:', error.message);
    });

function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
    const date = ('0' + dateTime.getDate()).slice(-2);
    const hours = ('0' + dateTime.getHours()).slice(-2);
    const minutes = ('0' + dateTime.getMinutes()).slice(-2);
    const seconds = ('0' + dateTime.getSeconds()).slice(-2);
    const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}
