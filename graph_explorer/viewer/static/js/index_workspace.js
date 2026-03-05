// ===== WORKSPACE MANAGEMENT =====

// Trenutni workspace-ovi (simulacija baze podataka)
let workspaces = [
    { id: 'default', name: 'Default Workspace', active: true },
    { id: 'test1', name: 'JSON Test', active: false },
    { id: 'test2', name: 'CSV Export', active: false }
];

let currentWorkspaceId = 'default';

// Inicijalizacija workspace-ova
function initWorkspaces() {
    renderWorkspaceList();
}

// Prikaz workspace liste
function renderWorkspaceList() {
    const workspaceList = document.getElementById('workspace-list');
    if (!workspaceList) return;
    
    workspaceList.innerHTML = '';
    
    workspaces.forEach(workspace => {
        const badge = document.createElement('div');
        badge.className = `workspace-badge ${workspace.id === currentWorkspaceId ? 'active' : ''}`;
        badge.dataset.id = workspace.id;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = workspace.name;
        nameSpan.onclick = () => switchWorkspace(workspace.id);
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-workspace';
        removeBtn.textContent = '×';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            deleteWorkspace(workspace.id);
        };
        
        badge.appendChild(nameSpan);
        badge.appendChild(removeBtn);
        workspaceList.appendChild(badge);
    });
}

// Kreiranje novog workspace-a
function createNewWorkspace() {
    const name = prompt('Enter workspace name:', 'New Workspace');
    if (!name) return;
    
    const newWorkspace = {
        id: 'ws_' + Date.now(),
        name: name,
        active: false
    };
    
    workspaces.push(newWorkspace);
    switchWorkspace(newWorkspace.id);
    renderWorkspaceList();
}

// Čuvanje trenutnog workspace-a
function saveWorkspace() {
    const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);
    if (!currentWorkspace) return;
    
    // TODO: Ovdje sačuvaj trenutno stanje
    // - Izabrani plugin
    // - Parametri
    // - Graf
    // - Filteri
    // - Pretrage
    
    const workspaceState = {
        id: currentWorkspaceId,
        name: currentWorkspace.name,
        timestamp: new Date().toISOString(),
        plugin: document.getElementById('plugin-select').value,
        // Dodaj ostale podatke
    };
    
    console.log('💾 Čuvam workspace:', workspaceState);
    
    // Simulacija čuvanja u localStorage
    localStorage.setItem(`workspace_${currentWorkspaceId}`, JSON.stringify(workspaceState));
    
    alert(`Workspace "${currentWorkspace.name}" saved!`);
}

// Prebacivanje na drugi workspace
function switchWorkspace(workspaceId) {
    const oldWorkspaceId = currentWorkspaceId;
    currentWorkspaceId = workspaceId;
    
    // TODO: Učitaj stanje za novi workspace
    const savedState = localStorage.getItem(`workspace_${workspaceId}`);
    
    if (savedState) {
        const state = JSON.parse(savedState);
        console.log('📂 Učitavam workspace:', state);
        
        // TODO: Restore state
        // - Postavi plugin
        // - Učitaj graf
        // - Prikaži filtere
    }
    
    renderWorkspaceList();
}

// Brisanje workspace-a
function deleteWorkspace(workspaceId) {
    if (workspaceId === 'default') {
        alert('Cannot delete default workspace!');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this workspace?')) return;
    
    workspaces = workspaces.filter(w => w.id !== workspaceId);
    localStorage.removeItem(`workspace_${workspaceId}`);
    
    if (currentWorkspaceId === workspaceId) {
        switchWorkspace('default');
    }
    
    renderWorkspaceList();
}

// Dodaj event listener za dugmad nakon učitavanja stranice
document.addEventListener('DOMContentLoaded', function() {
    // Već postojeći kod...
    
    // Inicijalizuj workspace-ove
    initWorkspaces();
});