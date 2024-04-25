document.getElementById('create_from').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const formData = new FormData(); 
    formData.append('content', document.getElementById('create_text').value); 

    const url = "http://localhost:5193/api/Paradise/6";

    fetch(url, {
        method: 'POST',
        body: formData, 
        credentials: 'include', 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('伺服器回應錯誤');
        }
        return response.json(); 
    })
    .then(data => {
        console.log(data);
        alert('新增提問留言成功！');
        location.reload();
    })
    .catch(error => {
        console.error('發生錯誤:', error);
    });
});
