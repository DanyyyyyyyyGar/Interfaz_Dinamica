document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.login-box');
  if (!form) return;
  
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const usuario = (form.usuario.value || '').trim();
    const password = (form.password.value || '').trim();
    
    // Validation
    if (!usuario || !password) {
      alert('Por favor completa usuario y contraseña');
      return;
    }
    
    // Get users from localStorage
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (err) {
      console.error('Error parsing users:', err);
      users = [];
    }
    
    // Find user with matching credentials
    const user = users.find(u => u.usuario === usuario && u.password === password);
    
    if (user) {
      // Save logged user info
      localStorage.setItem('loggedUser', JSON.stringify({
        usuario: user.usuario,
        email: user.email,
        color: user.color,
        id: user.id
      }));
      
      alert('¡Bienvenido ' + usuario + '!');
      window.location.href = 'index.html';
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  });
});