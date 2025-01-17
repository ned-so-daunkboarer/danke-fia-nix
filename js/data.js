// data.js
const timelineData = {
    politics: [
        {
            id: "climate-2025",
            date: "<strong>Jan 2025</strong>",
            title: "Einsparmaßnahmen",
            description: "Einsparmaßnahmen <em>Klima</em>",
            summary: "Eine kurze Zusammenfassung der Einsparmaßnahmen im Klimabereich.",
            opinion: "Meine persönliche Einschätzung zu den Auswirkungen dieser Maßnahmen.",
            sources: [
                {
                    originalUrl: "https://example.com/original-article",
                    archiveUrl: "https://web.archive.org/web/example",
                    dateAdded: "2025-01-15"
                }
            ]
        },
        {
            id: "standard-2025",
            date: "<strong>Jan 2025</strong>",
            title: "Scheißblatt",
            description: "Scheißblatt <em>blede aussog</em>",
            summary: "Der FPÖ-Politiker Dominik Nepp hat nach kritischer Berichterstattung des STANDARD über einen FPÖ-Stammtisch den STANDARD als \"Scheißblatt\" bezeichnet.",
            opinion: "Die Drohungen der FPÖ gegen kritische Medien zeigen autoritäre Tendenzen und stellen eine Gefahr für die Demokratie dar.",
            sources: [
                {
                    originalUrl: "https://example.com/standard-article",
                    archiveUrl: "https://web.archive.org/web/standard",
                    dateAdded: "2025-01-10"
                }
            ]
        }
    ],
    fun: [
        {
            id: "fun-event-2025",
            date: "<strong>Jan 2025</strong>",
            title: "Beispiel Fun Event",
            description: "Ein lustiges Beispiel",
            summary: "Eine kurze Zusammenfassung des lustigen Events.",
            opinion: "Meine Meinung dazu.",
            sources: [
                {
                    originalUrl: "https://example.com/fun-article",
                    archiveUrl: "https://web.archive.org/web/fun",
                    dateAdded: "2025-01-01"
                }
            ]
        }
    ]
};

let currentCategory = 'politics';
let currentIndex = 0;
const itemsPerLoad = 3;
const timeline = document.getElementById('timeline');
const loadingElement = document.getElementById('loading');
const footerElement = document.getElementById('timeline-footer');
let isLoading = false;

// URL parameter handling
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        category: params.get('category')
    };
}

function setUrlParams(id, category) {
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
}

function clearUrlParams() {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    url.searchParams.delete('category');
    window.history.pushState({}, '', url);
}

// Share functionality
window.shareEntry = function(id, category) {
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    url.searchParams.set('category', category);
    
    // Create a temporary input to copy the URL
    const tempInput = document.createElement('input');
    tempInput.value = url.toString();
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show feedback
    const button = document.querySelector(`[data-entry-id="${id}"] .share-button`);
    const originalText = button.textContent;
    button.textContent = 'Link kopiert!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
};

// Find entry by ID across all categories
function findEntryById(id) {
    for (const [category, entries] of Object.entries(timelineData)) {
        const entry = entries.find(e => e.id === id);
        if (entry) {
            return { entry, category };
        }
    }
    return null;
}

// Make toggleDetails function global
window.toggleDetails = function(button) {
    const details = button.nextElementSibling;
    const isExpanded = details.classList.contains('expanded');
    
    if (isExpanded) {
        details.classList.remove('expanded');
        button.textContent = 'Details anzeigen';
    } else {
        details.classList.add('expanded');
        button.textContent = 'Details verstecken';
    }
};

function createCategorySelector() {
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'category-selector';
    
    const select = document.createElement('select');
    select.id = 'category-select';
    select.className = 'category-select';
    
    const categories = Object.keys(timelineData);
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        clearUrlParams();
        resetTimeline();
    });
    
    selectorContainer.appendChild(select);
    const categoryContainer = document.getElementById('category-container');
    if (categoryContainer) {
        categoryContainer.appendChild(selectorContainer);
    }
}

function resetTimeline() {
    timeline.innerHTML = '';
    currentIndex = 0;
    loadingElement.style.display = 'block';
    loadingElement.classList.remove('loading-visible');
    if (footerElement) {
        footerElement.style.display = 'none';
        footerElement.classList.remove('visible');
    }
    loadMoreItems();
}

function createTimelineItem(data) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('data-entry-id', data.id);
    
    const sourcesHtml = data.sources.map(source => `
        <div class="source-item">
            <a href="${source.originalUrl}" target="_blank">Original</a> | 
            <a href="${source.archiveUrl}" target="_blank">Archive</a>
            <span class="source-date">Added: ${source.dateAdded}</span>
        </div>
    `).join('');
    
    item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <div class="timeline-date">${data.date}</div>
            <h3 class="timeline-title">${data.title}</h3>
            <p class="timeline-text">${data.description}</p>
            <button class="expand-button" onclick="toggleDetails(this)">Details anzeigen</button>
            <div class="timeline-details">
                <div class="timeline-details-content">
                    <div class="details-section">
                        <h4>Zusammenfassung:</h4>
                        <p>${data.summary}</p>
                    </div>
                    <div class="details-section">
                        <h4>Meinung:</h4>
                        <p>${data.opinion}</p>
                    </div>
                    <div class="details-section">
                        <h4>Quellen:</h4>
                        <div class="sources-list">
                            ${sourcesHtml}
                        </div>
                    </div>
                    <div class="share-section">
                        <button class="share-button" onclick="shareEntry('${data.id}', '${currentCategory}')">
                            <svg class="share-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                            </svg>
                            Link teilen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return item;
}

function loadMoreItems() {
    const currentData = timelineData[currentCategory];
    if (isLoading || currentIndex >= currentData.length) return;
    
    isLoading = true;
    loadingElement.classList.add('loading-visible');

    setTimeout(() => {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < itemsPerLoad && currentIndex < currentData.length; i++) {
            const item = createTimelineItem(currentData[currentIndex]);
            fragment.appendChild(item);
            currentIndex++;
        }

        timeline.appendChild(fragment);

        setTimeout(() => {
            const newItems = timeline.querySelectorAll('.timeline-item:not(.visible)');
            newItems.forEach(item => item.classList.add('visible'));
        }, 100);

        isLoading = false;
        loadingElement.classList.remove('loading-visible');

        if (currentIndex >= currentData.length) {
            loadingElement.style.display = 'none';
            if (footerElement) {
                footerElement.style.display = 'block';
                setTimeout(() => {
                    footerElement.classList.add('visible');
                }, 100);
            }
        }

        checkScroll();
        
        // Handle URL parameters after loading items
        const params = getUrlParams();
        if (params.id) {
            const targetElement = document.querySelector(`[data-entry-id="${params.id}"]`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const expandButton = targetElement.querySelector('.expand-button');
                if (expandButton) {
                    setTimeout(() => {
                        expandButton.click();
                    }, 500);
                }
            }
        }
    }, 50);
}

// Initialize with URL parameters
document.addEventListener('DOMContentLoaded', () => {
    const params = getUrlParams();
    if (params.id) {
        const result = findEntryById(params.id);
        if (result) {
            currentCategory = result.category;
        }
    } else if (params.category && timelineData[params.category]) {
        currentCategory = params.category;
    }
    
    createCategorySelector();
    document.getElementById('category-select').value = currentCategory;
    loadMoreItems();
});

// Event listeners for infinite scroll
window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);

function checkScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const timelineBottom = timeline.offsetTop + timeline.offsetHeight;

    if (scrollPosition >= timelineBottom - 500) {
        loadMoreItems();
    }
}