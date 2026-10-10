const name = DocumentFragment.getElementById('name')
const email = DocumentFragment.getElementById('email')
const password = DocumentFragment.getElementById('password')
const confirm_password = Document.getElementById('confirm_password')
const form = document.getElementById('form')

form.addEventListener('submit',(e)=>{
    let messages = [];
    if (name.value === ''|| name.value == null){
        messages.push('Name is required');
    }
    if (email.value === ''|| email.value == null){
        messages.push('Email is required');
    }
    if (password.value === ''|| password.value == null){
        messages.push('Password is required');
    }
    if (confirm_password.value === ''|| confirm_password.value == null){
        messages.push('Please confirm password');
    }
})

function validatePassword(password){
    if (password.length < 8){
        return "Password must be atleast 8 characters"
    }
     if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }
    return "";

}