import "./style-log-in.css"
import { logInUser } from "../firebase"

const formButton = document.getElementById('form-button')
formButton.addEventListener('click', async () => login())

async function login() {
    const email = document.getElementById('email-input').value
    const password = document.getElementById('password-input').value

    const logUser = await logInUser(email, password)

    if (logUser.status) {
        alert('Sesión Iniciada con éxito, id:', logUser.info)
        window.location.href = '/main/'

    } else {
        alert('La contraseña o el correo no son válidos')
    }
}