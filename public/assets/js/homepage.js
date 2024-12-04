document.addEventListener('DOMContentLoaded', async () => {
    try {
        // check auth status
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        const navItems = document.getElementById('navItems');
        const actionButtons = document.getElementById('actionButtons');
         
        if (data.isLoggedIn) {
            // logged in user nav
            navItems.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/quiz">Start Quiz</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/rankings">Rankings</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/profile">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="logout()">Logout</a>
                </li>
            `;
            
            // logged in user action buttons
            actionButtons.innerHTML = `
                <a href="/quiz" class="btn btn-primary btn-lg">Start Quiz</a>
                <a href="/rankings" class="btn btn-outline-primary btn-lg">View Rankings</a>
            `;
        } else {
            // not logged in user nav
            navItems.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/login">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/register">Register</a>
                </li>
            `;
            
            // not logged in user action buttons
            actionButtons.innerHTML = `
                <a href="/login" class="btn btn-primary btn-lg">Login</a>
                <a href="/register" class="btn btn-outline-primary btn-lg">Register</a>
            `;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        // if error, default to not logged in state
        const navItems = document.getElementById('navItems');
        const actionButtons = document.getElementById('actionButtons');
        
        navItems.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/login">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/register">Register</a>
            </li>
        `;
        
        actionButtons.innerHTML = `
            <a href="/login" class="btn btn-primary btn-lg">Login</a>
            <a href="/register" class="btn btn-outline-primary btn-lg">Register</a>
        `;
    }
});

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
