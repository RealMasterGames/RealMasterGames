document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId || typeof GAMES_DATA === 'undefined') {
        document.getElementById('gameName').textContent = 'Error: ID o datos no disponibles.';
        return;
    }
    
    const gameData = GAMES_DATA.find(g => g.id === gameId);

    if (!gameData) {
        document.getElementById('gameName').textContent = 'Error: Juego no encontrado.';
        return;
    }

    function populateTags(containerId, dataString) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        if (!dataString) return []; 
        
        const tags = dataString.split(',').map(tag => tag.trim()).filter(tag => tag);
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.classList.add('tag');
            span.textContent = tag;
            container.appendChild(span);
        });
        return tags; 
    }

    function createRequirementCard(title, requirements) {
        const card = document.createElement('div');
        card.classList.add('req-card');
        const reqs = requirements || {};
        
        const cardHTML = `
            <h4>${title}</h4>
            <ul>
                <li><strong>SO:</strong> ${reqs.os || 'N/A'}</li>
                <li><strong>CPU:</strong> ${reqs.procesador || 'N/A'}</li>
                <li><strong>RAM:</strong> ${reqs.memoria || 'N/A'}</li>
                <li><strong>GPU:</strong> ${reqs.graficos || 'N/A'}</li>
                <li><strong>Almacenamiento:</strong> ${reqs.almacenamiento || 'N/A'}</li> 
            </ul>
        `;
        card.innerHTML = cardHTML;
        return card;
    }

    function setMetacriticColor(score, element) {
        const s = parseInt(score);
        if (isNaN(s)) {
            element.style.backgroundColor = 'var(--bg-tertiary)';
        } else if (s >= 80) {
            element.style.backgroundColor = 'var(--success-color)';
        } else if (s >= 60) {
            element.style.backgroundColor = '#facc15';
        } else {
            element.style.backgroundColor = 'var(--danger-color)';
        }
    }

    document.getElementById('gameTitle').textContent = gameData.nombre || 'Juego Desconocido';
    document.getElementById('gameName').textContent = gameData.nombre || 'Título No Disponible';
    const launchDate = gameData.lanzamiento || 'N/A';
    document.getElementById('gameMeta').textContent = `App ID: ${gameData.appid || 'N/A'} | Lanzamiento: ${launchDate}`;

    document.getElementById('headerBgImage').src = gameData.portada_card || 'placeholder.jpg'; 
    document.getElementById('detailCoverImage').src = gameData.portada_miniatura || 'placeholder.jpg';

    document.getElementById('gameDescription').textContent = gameData.descripcion || 'No hay una descripción detallada disponible para este título.';
    document.getElementById('downloadLink').href = gameData.link_descarga || '#';
    if (!gameData.link_descarga) {
        document.getElementById('downloadLink').textContent = 'Link de Descarga No Disponible';
        document.getElementById('downloadLink').style.backgroundColor = 'var(--bg-tertiary)';
        document.getElementById('downloadLink').style.boxShadow = 'none';
    }

    document.getElementById('publisherTag').textContent = gameData.publisher || 'N/A';
    document.getElementById('releaseTag').textContent = launchDate;
    document.getElementById('sizeTag').textContent = gameData.peso || 'N/A';
    
    const metacriticElement = document.getElementById('metacriticTag');
    metacriticElement.textContent = gameData.valoracion_metacritic || 'N/A';
    setMetacriticColor(gameData.valoracion_metacritic, metacriticElement);

    const currentGenres = populateTags('genresList', gameData.genero);
    populateTags('modesList', gameData.modo_juego);

    const requirementsGrid = document.getElementById('requirementsGrid');
    requirementsGrid.innerHTML = '';
    
    if (gameData.requisitos && Object.keys(gameData.requisitos).length > 0) {
        requirementsGrid.appendChild(createRequirementCard('Requisitos del Sistema', gameData.requisitos));
    } else {
         requirementsGrid.innerHTML = '<p style="color:var(--text-secondary);">No se especifican requisitos del sistema para este título.</p>';
    }

    const screenshotsCarousel = document.getElementById('screenshotsCarousel');
    if (gameData.capturas && gameData.capturas.length > 0) {
        gameData.capturas.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Captura de ${gameData.nombre}`;
            screenshotsCarousel.appendChild(img);
        });
    } else {
        document.getElementById('noScreenshots').style.display = 'block';
    }
    
    const relatedGamesGrid = document.getElementById('relatedGamesGrid');
    const relatedGames = GAMES_DATA.filter(g => 
        g.id !== gameId && 
        g.genero && currentGenres.some(genre => g.genero.includes(genre))
    ).slice(0, 4); 

    if (relatedGames.length > 0) {
        relatedGames.forEach(relatedGame => {
            const card = document.createElement('a');
            card.classList.add('game-card'); 
            card.href = `game-detail.html?id=${relatedGame.id}`;
            
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${relatedGame.portada_miniatura || 'placeholder.jpg'}" class="card-image" alt="${relatedGame.nombre}">
                    <div class="card-overlay">
                        <span class="info-name">${relatedGame.nombre}</span>
                        <div class="download-btn-icon">⬇️</div>
                    </div>
                </div>
            `;
            relatedGamesGrid.appendChild(card);
        });
    } else {
        document.getElementById('noRelatedGames').style.display = 'block';
    }
});