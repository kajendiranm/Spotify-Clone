const username = document.getElementById('username')
const pass = document.getElementById('password')
const submit = document.querySelector('button')

error_field = document.querySelector('.error-field')
error_field.classList.add('hide')

submit.addEventListener('click', event => {
    if (username.value === '' || pass.value === '' ) {
        error_field.classList.remove('hide')
        error_field.textContent = 'All fields are required!'
        event.preventDefault()
    }
})
