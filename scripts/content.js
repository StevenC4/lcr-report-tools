const saveButton = document.querySelector('div#mainContent a.custom-reports-save-button');
const buttonBar = document.querySelector('div#mainContent a.custom-reports-save-button').parentElement;

const exportButton = document.createElement('a');
saveButton.classList.forEach(function(className) {
    exportButton.classList.add(className);
});
exportButton.textContent = 'Export CSV';
exportButton.style = 'margin-left: 13px;';

saveButton.insertAdjacentElement('afterend', exportButton);
