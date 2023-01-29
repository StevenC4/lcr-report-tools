// Set up observer to wait for the right elements to load on the page
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

// The main function that will be run when the elements are loaded 
const execute = async () => {
    // Insert a button onto the page. Set up an on-click function.
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

// Auxiliary functions to manipulate data
const getElementText = element => element.textContent;
const formatData = value => {
    if (value.indexOf(',') !== -1) {
        return `"${value}"`;
    } else {
        return value;
    }
};

const getReportTableRows = () => {
    // Get report contents
    const reportTable = document.querySelector('div#mainContent custom-reports-table');
    // Get table header
    const columnNames = Array.from(reportTable.querySelectorAll('table thead tr th a span')).map(getElementText);
    // Get table contents
    const tableValues = Array.from(reportTable.querySelectorAll('table tbody tr td span:not(:has(*))'))
        .map(getElementText)
        .reduce((accumulator, item, i) => {
            if (i % columnNames.length === 0) {
                accumulator.push([]);
            }
            accumulator[accumulator.length - 1].push(item);
            return accumulator;
        }, []);
    // Join table columns and row values
    const tableRows = [
        columnNames,
        ...tableValues
    ];
    return tableRows;
};

// The on-click function to export the CSV data and kick off a download
const exportCSV = async () => {
    // Get title
    let title = document.querySelector('div#mainContent custom-reports-title div.pageTitle h2.pageTitle span').textContent;
    title = title.replaceAll(/[\s\.]+/g, '_') + '.csv';
    
    const tableRowValues = getReportTableRows();
    const rowValuesCleaned = tableRowValues.map(row => row.map(formatData));
    const csvData = rowValuesCleaned.map(row => row.join(',')).join('\n');
    // Convert to CSV data blob
    var csvBlob = new Blob([csvData], {
        type: 'text/csv'
    }); 
    var csvUrl = URL.createObjectURL(csvBlob);

    // Send message to background script to initialize CSV download
    await chrome.runtime.sendMessage({
        type: 'DOWNLOAD_CSV',
        filename: title,
        body: csvUrl
    });
}