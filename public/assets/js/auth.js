// logout function
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}
 