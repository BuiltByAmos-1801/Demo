const form = document.querySelector('#activation-form');
const codeInput = document.querySelector('#activation-code');
const refreshButton = document.querySelector('#refresh-button');
const copyButton = document.querySelector('#copy-button');
const status = document.querySelector('#status');

codeInput.addEventListener('input', () => {
  codeInput.value = codeInput.value.replace(/[^0-9]/g, '').slice(0, 10);
  status.textContent = '';
});

refreshButton.addEventListener('click', () => {
  codeInput.value = '';
  status.textContent = '';
  codeInput.focus();
});

copyButton.addEventListener('click', async () => {
  if (!codeInput.value) {
    status.textContent = 'Enter an activation code first';
    return;
  }

  try {
    await navigator.clipboard.writeText(codeInput.value);
    status.textContent = 'Code copied';
  } catch {
    status.textContent = codeInput.value;
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = codeInput.value.length === 10
    ? 'Activation code accepted'
    : 'Enter the complete 10-digit code';
});
