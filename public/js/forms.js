document.addEventListener('DOMContentLoaded', () => {
  // marcar inputs con valor (incluye caso server-side value="")
  document.querySelectorAll('.form-control').forEach(input => {
    const mark = () => {
      if (input.value && input.value.trim() !== '') input.classList.add('filled');
      else input.classList.remove('filled');
    };
    input.addEventListener('input', mark);
    // comprobación inmediata y ligera espera por si el navegador autocompleta
    mark();
    setTimeout(mark, 80);
  });

  // detectar autofill en WebKit (fallback adicional)
  document.addEventListener('animationstart', (e) => {
    if (e.animationName === 'onAutoFillStart') {
      const el = e.target;
      if (el.classList && el.classList.contains('form-control')) el.classList.add('filled');
    }
  }, true);

  // toggle contraseña (si ya lo tenés)
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input-with-icon');
      if (!wrapper) return;
      const input = wrapper.querySelector('input');
      if (!input) return;
      input.type = (input.type === 'password') ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) icon.classList.toggle('fa-eye-slash');
      input.focus();
    });
  });
});