let observer = new MutationObserver(function(mutations, mutationInstance) {
    const saveButton = document.querySelector('div#mainContent a.custom-reports-save-button');
    const titleBar = document.querySelector('div#mainContent custom-reports-title div.pageTitle h2.pageTitle span');
    const reportTable = document.querySelector('div#mainContent custom-reports-table');
    if (saveButton && titleBar && reportTable) {
        mutationInstance.disconnect();
        execute();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});

function execute() {
    const saveButton = document.querySelector('div#mainContent a.custom-reports-save-button');
    const exportButton = document.createElement('a');
    saveButton.classList.forEach(function(className) {
        exportButton.classList.add(className);
    });
    exportButton.textContent = 'Export CSV';
    exportButton.style = 'margin-left: 13px;';
    exportButton.onclick = exportCSV;

    saveButton.insertAdjacentElement('afterend', exportButton);
}

function exportCSV() {
    console.log('Exporting CSV...');
    
    // Get title
    let title = document.querySelector('div#mainContent custom-reports-title div.pageTitle h2.pageTitle span').textContent;
    title = title.replaceAll(/[\s\.]+/g, '_') + '.csv';
    
    // Get report contents
    let reportTable = document.querySelector('div#mainContent custom-reports-table');
    // Get table header
    let tableHeaders = Array.from(reportTable.querySelectorAll('table thead tr th a span'));
    let columnNames = tableHeaders.map(function(column) {
        return column.textContent;
    });
    // Get table contents
    let tableValues = reportTable.querySelectorAll('table tbody tr th a span');
}