const wrapper = document.querySelector('.wrapper');
const registerbtn = document.querySelector('.register-btn')
const loginbtn = document.querySelector('.login-btn');



registerbtn.addEventListener('click',()=>{
    wrapper.classList.add('active')
})

loginbtn.addEventListener('click',()=>{
    wrapper.classList.remove('active')
})
