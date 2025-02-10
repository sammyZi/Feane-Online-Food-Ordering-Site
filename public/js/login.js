function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // Dummy validation (replace with actual authentication logic)
    if (email === 'user@example.com' && password === 'password') {
        messageElement.textContent = 'Login successful!';
        messageElement.style.color = 'green';
        // Redirect to the profile page or do other actions here
        // window.location.href = 'profile.html'; 
    } else {
        messageElement.textContent = 'Invalid email or password.';
        messageElement.style.color = 'red';
    }
}
