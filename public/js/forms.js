document.addEventListener('DOMContentLoaded', () => {
  // Toggle mostrar/ocultar contraseña (botón con clase .toggle-password)
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input-with-icon');
      if (!wrapper) return;
      const input = wrapper.querySelector('input');
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      }
      input.focus();
    });
  });

  // Añadir/remover clase .filled si el input tiene valor (útil para autocompletado)
  document.querySelectorAll('.form-control').forEach(input => {
    const check = () => {
      if (input.value && input.value.trim() !== '') input.classList.add('filled');
      else input.classList.remove('filled');
    };
    input.addEventListener('input', check);
    // Si el navegador autocompleta, esperar un tick y chequear
    setTimeout(check, 50);
  });
});