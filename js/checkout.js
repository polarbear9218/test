
fetch("http://localhost:5193/api/Cart", { credentials: 'include' })
    .then(response => {
        if (!response.ok) {
            throw new Error('伺服器回應錯誤');
        }
        return response.json();
    })
    .then(data => {
        const itemContainer = document.querySelector('.item'); 

        // 清空之前的內容
        itemContainer.innerHTML = '';

        console.log(data);

        let total = 0;
        if (data && data.length > 0) {
            data.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('content');
                itemElement.innerHTML = `
                    <p>品名：${item.itemName}</p>
                    <p>規格：${item.space} / ${item.color}</p>
                    <p>數量：${item.itemNum}</p>
                    <p>單價：${item.itemPrice} </p>
                `;
                total += item.itemPrice * item.itemNum;
                itemContainer.appendChild(itemElement);
            });
        }
        
        
        const h2 = document.querySelector(".total")
        h2.textContent = `總計：$${total}`;

    })
    .catch(error => {
        console.error('發生錯誤:', error);
    });



    const url = "http://localhost:5193/api/Cart/Profile"; 


fetch(url,{credentials: 'include'})
  .then(response => {
    if (!response.ok) {
      throw new Error('網路錯誤，無法獲取資料');
    }
    return response.json(); // 解析 JSON 格式的回傳資料
  })
  .then(data => {

    console.log(data); 
    
    const nameElement = document.getElementById('Name');
    const cellphoneElement = document.getElementById('Cellphone');
    const emailElement = document.getElementById('Email');

    
    nameElement.textContent = data.name;
    cellphoneElement.textContent = data.cellphone;
    emailElement.textContent = data.email;

  })
  .catch(error => {
    console.error('發生錯誤:', error);
  });


document.getElementById('CheckoutForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  const address = '"' + document.querySelector('.text[name="address"]').value + '"';


  console.log(address);
  
  fetch("http://localhost:5193/api/Cart/Order", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' 
      },
      body: address, 
      credentials: 'include'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('伺服器回應錯誤');
      }
      return response.json();
  })
  .then(data => {
      console.log(data);
      alert('下單成功');
      window.location.href = './order.html';
  })
  .catch(error => {
      console.error('發生錯誤:', error);
  });
});
