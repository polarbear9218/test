fetch("http://localhost:5193/api/Cart", { credentials: 'include' })
    .then(response => {
        if (!response.ok) {
            throw new Error('伺服器回應錯誤');
        }
        return response.json();
    })
    .then(data => {
        const itemContainer = document.querySelector('.item');

        itemContainer.innerHTML = '';

        console.log(data);
        let total = 0
        if (data && data.length > 0) {
            data.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('content');
                itemElement.innerHTML = `
                    <p>品名：${item.itemName}</p>
                    <p>規格：${item.space} / ${item.color}</p>
                    <p>數量：${item.itemNum}</p>
                    <p>單價：${item.itemPrice} <a href="" class="delete"><img src="image/trash.png" alt="" class="delete"></a></p> <!-- 修改此行 -->
                `;

                const deleteButton = itemElement.querySelector('.delete');

                deleteButton.addEventListener('click', function(event) {
                    event.preventDefault(); 

                    console.log("123");

                    const Id=item.id;

                    console.log(Id);
                    fetch(`http://localhost:5193/api/Cart`, { 
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ Id: Id}),
                        credentials: 'include'
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('伺服器回應錯誤');
                            }
                            return response.json();
                        })

                        .then(data => {
                            console.log("已刪除商品");
                            alert('已刪除商品');
                            location.reload();
                        })
                        .catch(error => {
                            console.error('發生錯誤:', error);
                        });
                });
                total += item.itemPrice * item.itemNum;
                itemContainer.appendChild(itemElement);
            });
        }
        console.log(total);
        const h2 = document.querySelector(".total")
        h2.textContent = `總計：$${total}`;
    })
    .catch(error => {
        console.error('發生錯誤:', error);
        alert('請先登入');  
        window.location.href = './login.html';
    });

