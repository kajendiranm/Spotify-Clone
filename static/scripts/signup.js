const name = document.getElementById('name')
const email = document.getElementById('email')
const username = document.getElementById('username')
const pass1 = document.getElementById('password1')
const pass2 = document.getElementById('password2')
const submit = document.querySelector('button')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

error_field = document.querySelector('.error-field')
error_field.classList.add('hide')

submit.addEventListener('click', event => {
    if (name.value === '' || email.value === '' || username.value === '' || pass1.value === '' || pass2.value === '') {
        error('All fields are required!')
        event.preventDefault()
        return
    }
    else if (pass1.value !== pass2.value) {
        error('Both password fields must be same!')
        event.preventDefault()
        return
    }
    else if(!(emailRegex.test(email.value))){
        error('Enter a valid Email!')
        email.focus()
        event.preventDefault()
        return
    }
    validatePassword(pass1.value, event)
})

function validatePassword(password) {
    if (password.length < 8) {
        error("Password should be at least 8 characters long.")
        event.preventDefault()
    }
    
    if (!/\d/.test(password || !/[@#$!%*?&]/.test(password))) {
        error("Password should contain at least one number and one special character.")
        event.preventDefault()
    }

}

function error(err){
    error_field.classList.remove('hide')
    error_field.textContent = err
}