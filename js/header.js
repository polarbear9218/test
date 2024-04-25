function checkLoginStatus(){
    const token = getCookies("Token");
    if(token){
        return true;
    }
    return false;
}

function getCookies(name){
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            console.log("成功");
            return cookieValue;
        }
    }
    console.log('失敗');
    return null;
}

function updateHeader(){
    var isLoginInfo = checkLoginStatus();
    if(isLoginInfo){
        BtnDisplayNone();
        SetUserBtn();
        SetLogoutBtn();
    }
}

function BtnDisplayNone(){
    const Loginbtn = document.querySelector('.header .nav2:nth-child(3)');
    const Registerbtn = document.querySelector('.header .nav2:nth-child(4)');
    Loginbtn.style.display = "none";
    Registerbtn.style.display = "none";
}

function SetUserBtn(){
    const navMain = document.querySelector('.header:nth-child(2) .nav_main');
    const navUserDiv = document.createElement('div');
    navUserDiv.className = "nav2";
    const navUser = document.createElement('a');
    navUser.href = "./order.html";
    const UserBtn = document.createElement('img');
    UserBtn.src = "./image/user.png";
    navMain.appendChild(navUserDiv);
    navUserDiv.appendChild(navUser);
    navUser.appendChild(UserBtn);
}

function SetLogoutBtn() {
    const navMain = document.querySelector('.header:nth-child(2) .nav_main');
    const navDiv = document.createElement('div');
    navDiv.className = "nav2";
    const navLogout = document.createElement('a');
    navLogout.href = "";
    navLogout.textContent = "登出";
    navLogout.className = "Logout";
    navMain.appendChild(navDiv);
    navDiv.appendChild(navLogout);
    navLogout.addEventListener('click', function (event) {
        event.preventDefault();
        fetch('http://localhost:5193/api/Member/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                alert('已登出');
                location.reload();
            } else {
                console.error('錯誤', response.statusText);
                alert('錯誤');
            }
        })
        .catch(error => {
            console.error('發生錯誤:', error);
            alert('錯誤');
        });
    });
}

// function SetLogoutBtn(){
//     const navMain = document.querySelector('.header:nth-child(2) .nav_main');
//     const navDiv = document.createElement('div');
//     navDiv.className = "nav2";
//     const navLogout = document.createElement('a');
//     navLogout.href = "";
//     navLogout.textContent = "登出"
//     navLogout.className = "Logout"
//     navMain.appendChild(navDiv);
//     navDiv.appendChild(navLogout);
//     navLogout.addEventListener('click', function(event){
//         event.preventDefault();
//         const xhr = new XMLHttpRequest();
//         xhr.withCredentials = true;
//         xhr.open('Delete','http://localhost:5193/api/Member/',true);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     alert('已登出')
//                     location.reload();
//                 } else {
//                    console.error('錯誤',xhr.responseText);
//                    alert("錯誤")
//                 }
//             }
//         };
//         xhr.send();
//     })
// }
document.addEventListener('DOMContentLoaded', function(){
    updateHeader();
}
);
