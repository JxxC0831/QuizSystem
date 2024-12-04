document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Frontend validation
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
        alert('Invalid username. Must be 3-30 characters and alphanumeric.');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Invalid email format.');
        return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
        alert('Password must be at least 8 characters and contain at least one number.');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if(data.success) {
            alert('Registration successful! Please login.');
            window.location.href = '/login';
        } else {
            alert(data.error);
        }
    } catch(error) {
        alert('An error occurred. Please try again.');
    }
     

}); 