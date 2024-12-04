document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
     
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if(data.success) {
            window.location.href = '/quiz'; // redirect to quiz page after login
        } else {
            alert(data.error);
        }
    } catch(error) {
        alert('An error occurred. Please try again.');
    }
}); 