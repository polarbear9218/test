async function getProductInfo(ItemId){
  try{
    const response = 
    await fetch(`http://localhost:5193/api/Paradise/ProductInfo?ItemId=${ItemId}`);
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if(data.Status === 200 && data.Message.length>0){
      return data.Message;
    }else{
      throw new Error('Product info not found')
    }
  }catch(error){
    console.error('Failed to fetch product info:',error);
    return null;
  }
}

async function generate(ItemId){
  try{
    const productInfo = await getProductInfo(ItemId);
    console.log('Product info:',productInfo);
    generateColorOptions(productInfo);
    generateInfo(productInfo);
    generateQA(ItemId);
  }catch(error){
    console.error('Failed to fetch product info:',error);
  }
}


async function generateInfo(productInfo){
  try{
    const path = document.querySelector('.path');

    // 創建首頁連結
    const index = document.createElement('a');
    index.href = "./Index.html";
    index.textContent = "首頁";
    
    // 創建分隔符
    const separator1 = document.createElement('p');
    separator1.textContent = " > ";
    
    // 創建商品一覽連結
    const productAll = document.createElement('a');
    productAll.href = "./product_all.html";
    productAll.textContent = "商品一覽";

    const separator2 = document.createElement('p');
    separator2.textContent = " > ";
    
    
    // 創建商品名稱連結
    const itemName = document.createElement('a');
    itemName.href = "";
    itemName.textContent = "【"+productInfo[0].Brand+"】"+productInfo[0].ItemName;
    itemName.id = "ItemName";
    
    path.appendChild(index);
    path.appendChild(separator1);
    path.appendChild(productAll);
    path.appendChild(separator2);
    path.appendChild(itemName);
    

    const pictureDiv = document.querySelector('#main div:nth-child(1)')
    const picture = document.createElement('img');
    picture.src = `image/${productInfo[0].ItemImg[0]}`;
    picture.style.width = '100%';
    picture.style.height = 'auto';
    pictureDiv.appendChild(picture);
    const productBrand = document.getElementById('Brand2');
    productBrand.textContent = productInfo[0].Brand ;
    const productName = document.getElementById('ItemName2');
    productName.textContent = productInfo[0].ItemName;
    const introduce_photo = document.getElementById('introduce_photo');
    console.log(productInfo)
    Array.from(productInfo[0].ItemImg).forEach((item, index) => {
      if(index != 0){
        const img = document.createElement('img');
        img.src = `image/${item}`;
        introduce_photo.appendChild(img)
      }
    });
    // for (let i = 1; i < productInfo.ItemImg.length; i++) {
    //   const img = document.createElement('img');
    //   img.src = `image/${productInfo[0].ItemImg[i]}`;
    //   introduce_photo.appendChild(img);
    // }
    
    const introduce_detailed = document.getElementById('detailed');
    introduce_detailed.textContent = productInfo[0].Instruction;
  }catch(error){
    console.error('Feil',error);
  }
}

async function generateColorOptions(productInfo){
    const colorOptionsDiv = document.getElementById('colorOptions');
    colorOptionsDiv.innerHTML = '';
    const colors = new Set();
    productInfo.forEach(item => {
      colors.add(item.Color);
    });
    Array.from(colors).forEach((color, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = "radio";
      input.name = color;
      const span = document.createElement('span');
      span.className = "round button";
      span.textContent = color;
      label.dataset.color = color;
      label.classList.add('colorLabel');
      if(index === 0){
        label.classList.add('selected')
        input.checked = true;
      }
      label.addEventListener('click', async function() {
        const selectedColor = this.dataset.color;
        const spaceOptionsDiv = document.getElementById('SpaceOptions');
        spaceOptionsDiv.innerHTML = '';
        productInfo.forEach((info) => {
            if (info.Color === selectedColor) {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = "radio";
                input.name = 'Space';
                input.value = info.Space; 
                const span = document.createElement('span')
                span.className = "round button";
                span.textContent = info.Space;
                label.dataset.Space = info.Space;
                label.classList.add('SpaceLabel');
                label.addEventListener('click', async function() {
                    const selectedSpace = this.dataset.Space;
                    const format = productInfo.find(info => info.Color === selectedColor && info.Space === selectedSpace);
                    if (format) {
                        document.getElementById('ItemPrice').textContent = format.ItemPrice;
                        FormatId = format.FormatId;
                        console.log(ItemId,FormatId);
                    }
                    spaceOptionsDiv.querySelectorAll('.SapceLabel').forEach(btn => {
                        btn.classList.remove('selected');
                        const input = btn.querySelector('input').checked = false;
                    });
                    this.classList.add('selected');
                    const input = this.querySelector('input').checked = true;
                });
                spaceOptionsDiv.appendChild(label);
                label.appendChild(input);
                label.appendChild(span);
            }
        });
        document.getElementById('ItemPrice').textContent = '';
        document.querySelectorAll('.colorLabel').forEach(btn => {
            btn.classList.remove('seleted');
            const input = btn.querySelector('input').checked = false;
        });
        this.classList.add('selected');
        const input = this.querySelector('input').checked = true;
        const inputs = this.querySelectorAll('input');
        inputs.forEach(input => {
            input.checked = true;
        });
    });
    
      colorOptionsDiv.appendChild(label);
      label.appendChild(input);
      label.appendChild(span);
    });
}

async function generateQA(ItemId){
  const QA = 
  await fetch(`http://localhost:5193/api/Paradise/QA/${ItemId}`,{
    method: 'GET',
    headers:{
      'Content-Type' :'application/json'
    },
    credentials: 'include'
  })
  .then(response =>{
    if(!response.ok){
      throw new Error('錯誤')
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    const Div = document.querySelector('#Q_A div:nth-child(3)');
    data.Message.forEach(item =>{
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = '';
      contentDiv.className = 'content';
      const Account = document.createElement('p');
      const QContent = document.createElement('p');
      const QCreateTime = document.createElement('p');
      const AContent = document.createElement('p');
      const ACreateTime = document.createElement('p');
      Account.textContent = '會員帳號： ' +  item.Account;
      QContent.textContent = '提問內容： ' +  item.Content;
      QCreateTime.textContent = '提問時間： ' +  formatDateTime(item.CreateTime);
      if(item.Reply != null){
        AContent.textContent = '回覆內容： ' +  item.Reply;
        ACreateTime.textContent = '回覆時間： ' +  formatDateTime(item.ReplyTime);
      }
      Div.appendChild(contentDiv);
      contentDiv.appendChild(Account);
      contentDiv.appendChild(QContent);
      contentDiv.appendChild(QCreateTime);
      contentDiv.appendChild(AContent);
      contentDiv.appendChild(ACreateTime);
      
    })
    console.log(data);
  })
  .catch(error=>{
    console.error('錯誤', data.Message);
    alert('失敗');
  })
}

const form = document.getElementById('AddCartForm')
form.addEventListener('submit',function(event){
  event.preventDefault();
  const AddItemNum = document.getElementById('val').value;

  fetch('http://localhost:5193/api/Cart', {
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({ItemId: ItemId, FormatId: FormatId, ItemNum: AddItemNum}),
    credentials: 'include'
  })
  .then(response =>{
    if(!response.ok){
      throw new Error('Error')
    }
    return response.json();
  })
  .then(data=>{
    var status = data.Status;
    if(status === 200){
      alert('加入成功')
      location.reload();
    }else{
      console.error('加入失敗', data.Message);
      alert('失敗');
    }
  })
  .catch(error => {
    console.error('加入失敗', data.Message);
    alert('失敗');
  })

});

const QA = document.getElementById('QAForm');
QA.addEventListener('submit', function(event){
    event.preventDefault();
    const formData = new FormData();
    formData.append('content',document.getElementById('create_text').value);
    fetch(`http://localhost:5193/api/Paradise/${ItemId}`,{
      method: 'POST',
      headers: {},
      body: formData,
      credentials: 'include'
    })
    .then(response =>{
      if(!response.ok){
         throw new Error('error');
      }
       return response.json();
    })
    .then(data=>{
      var status = data.Status;
      if(status === 200){
        alert('加入成功')
        location.reload();
      }
    })
    .catch(error=>{
      console.error('提問失敗');
      alert('失敗');
    })


});

let FormatId = -99;
let ItemId = -99;

window.onload = function(){
  const UrlParams = new URLSearchParams(window.location.search);
  ItemId = UrlParams.get('ItemId');
  generate(ItemId);
 }

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
 /*const url = "http://localhost:5193/api/Paradise/ProductInfo?ItemId=6"; 
const url = "http://localhost:5193/api/Paradise/ProductInfo?ItemId=6"; 


fetch(url, { credentials: 'include' })
  .then(response => {
    if (!response.ok) {
      throw new Error('網路錯誤，無法獲取資料');
    }
    return response.json();
  })
  .then(data => {
    console.log(data); 


    // 商品品牌
    const brandElement = document.getElementById('Brand');
    if (data.Message && data.Message.length > 0) {
      brandElement.textContent = data.Message[0].Brand;
    } else {
      brandElement.textContent = 'No Brand Available';
    }

    brandElement.href = `./product_brand.html?brand=${encodeURIComponent(data.brand)}`;


    const brand2Element = document.getElementById('Brand2');
    if (data.Message && data.Message.length > 0) {
      brand2Element.textContent = data.Message[0].Brand;
    } else {
      brand2Element.textContent = 'No Brand Available';
    }

    // 商品名稱
    const ItemNameElement = document.getElementById('ItemName');
    if (data.Message && data.Message.length > 0) {
      ItemNameElement.textContent = data.Message[0].ItemName;
    } else {
      ItemNameElement.textContent = 'No Brand Available';
    }

    const ItemName2Element = document.getElementById('ItemName2');
    if (data.Message && data.Message.length > 0) {
      ItemName2Element.textContent = data.Message[0].ItemName;
    } else {
      ItemName2Element.textContent = 'No Brand Available';
    }

    // 商品價格
    const ItemPriceElement = document.getElementById('ItemPrice');
    if (data.Message && data.Message.length > 0) {
      ItemPriceElement.textContent = data.Message[0].ItemPrice;
      const itemPrice = parseFloat(data.Message[0].ItemPrice);
    } else {
      ItemPriceElement.textContent = 'No Brand Available';
    }
    

     // 商品顏色
     const colorOptionsElement = document.getElementById('colorOptions');
     if (data.Message && data.Message.length > 0) {
       const Colors = data.Message.map(item => item.Color); //map可以抓取所有資料儲存於Colors陣列
 
       Colors.forEach((Color, first) => {
        const label = document.createElement('label'); //創建顏色容器
        label.id = Color.toLowerCase(); // 將顏色轉換為小寫作為 label 的 id
        const isChecked = first === 0 ? 'checked="checked"' : ''; // 判斷是否是第一個颜色，是的話會變成預設值
        label.innerHTML = `
          <input type="radio" name="color" ${isChecked}> <!-- 这里添加了 ${isChecked} -->
          <span class="round button">${Color}</span>
        `;
        colorOptionsElement.appendChild(label);
      });
     } else {
       colorOptionsElement.textContent = 'No Colors Available';
     }

      // 儲存空間
      const SpaceOptionsElement = document.getElementById('SpaceOptions');
      if (data.Message && data.Message.length > 0) {
        const Spaces = data.Message.map(item => item.Space); //map可以抓取所有資料儲存於Spaces陣列
        Spaces.forEach((Space, first) => {
          const label = document.createElement('label'); //創建儲存空間容器
          label.id = Space.toLowerCase(); // 將儲存空間轉換為小寫作為 label 的 id
          const isChecked = first === 0 ? 'checked="checked"' : ''; // 判斷是否是第一個空間容器，是的話會變成預設值
          label.innerHTML = `
            <input type="radio" name="Space" value="${Space}" ${isChecked}>
            <span class="round button">${Space}</span>
          `;
          SpaceOptionsElement.appendChild(label);
        });
      } else {
        SpaceOptionsElement.textContent = 'No Colors Available';
      }


      //商品單價
      const SpaceOptions = document.getElementsByName('Space'); // 所有儲存空間選項
      SpaceOptions.forEach(option => {
        option.addEventListener('change', function() {
          const selectedSpace = this.value; // 獲取所選的儲存空間
          const itemPrice = parseFloat(data.Message.find(item => item.Space === selectedSpace).ItemPrice); // 找到所選儲存空間的價格
      
          const ItemPriceElement = document.getElementById('ItemPrice');
          ItemPriceElement.textContent = itemPrice; // 更新單價顯示
        });
      });
      



  })


  .catch(error => {
    console.error('發生錯誤:', error);
  });*/


