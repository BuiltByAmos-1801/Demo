const preloader = document.querySelector('#preloader');
const form = document.querySelector('#activation-form');
const codeInput = document.querySelector('#activation-code');
const status = document.querySelector('#status');

window.addEventListener('load', () => {
  window.setTimeout(() => preloader.classList.add('is-hidden'), 2200);
});

codeInput.addEventListener('input', () => {
  codeInput.value = codeInput.value.replace(/[^0-9]/g, '').slice(0, 10);
  status.textContent = '';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = codeInput.value.length === 10
    ? 'Activation code accepted'
    : 'Enter the complete 10-digit code';
});
