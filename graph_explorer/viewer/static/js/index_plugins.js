// index_plugins.js - Jednostavno učitavanje pluginova

document.addEventListener('DOMContentLoaded', function() {
    loadPlugins();
});

function loadPlugins() {
    const selectElement = document.getElementById('plugin-select');
    
    // Pošalji zahtev ka backendu
    fetch('/api/plugins/')
        .then(response => response.json())
        .then(pluginNames => {
            console.log('Primljeni pluginovi:', pluginNames);
            
            // Očisti select (osim prve opcije)
            selectElement.innerHTML = '<option value="none">Select datasource plugin...</option>';
            
            // Dodaj svaki plugin kao opciju
            pluginNames.forEach(pluginName => {
                const option = document.createElement('option');
                option.value = pluginName;
                option.textContent = pluginName;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Greška:', error);
            selectElement.innerHTML = '<option value="none">Error loading plugins</option>';
        });
}