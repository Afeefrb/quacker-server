module.exports.validateRegisterInput = (
    username, email, password, confirmPassword
) => {
    const errors = {};

    if(username.trim() === ''){
        errors.username = "Username is empty" 
    }

    if(email.trim() === '') {
        errors.email = "Email is empty"
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)) {
            errors.email = "Enter a valid email"
        }
    }

    if(password === '') {
        errors.password = "Password is empty"
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }



}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};

    if(username.trim() === '') errors.username = "Username is empty"
    if(password.trim() === '') errors.password = "Password is empty"

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}