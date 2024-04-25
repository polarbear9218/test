const Url="http://localhost:5193/api/Paradise/ProductInfo?ItemId=3";

fetch(Url, { credentials: 'include' })
  .then(response => {
    if (!response.ok) {
      throw new Error('網路錯誤，無法獲取資料');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);

    const InstructionElement = document.getElementById('Instruction');
    if (data.Message && data.Message.length > 0) {
      InstructionElement.textContent = data.Message[0].Instruction;
    } else {
      InstructionElement.textContent = 'NO Instruction Available';
    }
  })
  .catch(error => {
    console.error('發生錯誤:', error);
  });