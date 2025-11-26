document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.register-box');
  if (!form) return;
  
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values using the actual name attributes from HTML
    const email = (form.email.value || '').trim();
    const usuario = (form.usuario.value || '').trim();
    const password = (form.password.value || '');
    const color = (form.color.value || '').trim();
    
    // Validations
    if (!email || !usuario || !password) {
      alert('Por favor completa email, usuario y contraseña');
      return;
    }
    
    if (!/@/.test(email)) {
      alert('Por favor ingresa un correo válido');
      return;
    }
    
    if (password.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    
    // Get existing users from localStorage
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (err) {
      console.error('Error parsing users:', err);
      users = [];
    }
    
    // Check if user or email already exists
    if (users.some(u => u.usuario === usuario)) {
      alert('El nombre de usuario ya existe. Elige otro.');
      return;
    }
    
    if (users.some(u => u.email === email)) {
      alert('Este correo ya está registrado. Intenta con otro.');
      return;
    }
    
    // Create new user object
    const newUser = {
      email,
      usuario,
      password,
      color: color || 'Sin especificar',
      fechaRegistro: new Date().toLocaleString(),
      id: Date.now()
    };
    
    // Add user to array and save
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set logged user
    localStorage.setItem('loggedUser', JSON.stringify({
      usuario,
      email,
      color,
      id: newUser.id
    }));
    
    // Success feedback and redirect
    alert('¡Registro exitoso! Bienvenido ' + usuario);
    window.location.href = 'index.html';
  });
});