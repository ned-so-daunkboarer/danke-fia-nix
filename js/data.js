const presidentsData = [
    {
        date: "<strong>Jan 2025</strong>",
        title: "Einsparmaßnahmen",
        description: "Einsparmaßnahmen <em>Klima</em>",
        details: "Jo Eingspoat hoid"
    },
    {
        date: "<strong>Jan 2025</strong>",
        title: "Scheißblatt",
        description: "Scheißblatt <em>blede aussog</em>",
        details: "Mei meinung dazua"
    }
];

let currentIndex = 0;
const itemsPerLoad = 3;
const timeline = document.getElementById('timeline');
const loadingElement = document.getElementById('loading');
const footerElement = document.getElementById('timeline-footer');
let isLoading = false;

function createTimelineItem(data) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <div class="timeline-date">${data.date}</div>
            <h3 class="timeline-title">${data.title}</h3>
            <p class="timeline-text">${data.description}</p>
            <button class="expand-button" onclick="toggleDetails(this)">Show Details</button>
            <div class="timeline-details">
                <div class="timeline-details-content">
                    ${data.details}
                </div>
            </div>
        </div>
    `;
    
    return item;
}

function toggleDetails(button) {
    const details = button.nextElementSibling;
    const isExpanded = details.classList.contains('expanded');
    
    if (isExpanded) {
        details.classList.remove('expanded');
        button.textContent = 'Show Details';
    } else {
        details.classList.add('expanded');
        button.textContent = 'Hide Details';
    }
}

function loadMoreItems() {
    if (isLoading || currentIndex >= presidentsData.length) return;
    
    isLoading = true;
    loadingElement.classList.add('loading-visible');

    setTimeout(() => {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < itemsPerLoad && currentIndex < presidentsData.length; i++) {
            const item = createTimelineItem(presidentsData[currentIndex]);
            fragment.appendChild(item);
            currentIndex++;
        }

        timeline.appendChild(fragment);

        // Trigger animation for new items
        setTimeout(() => {
            const newItems = timeline.querySelectorAll('.timeline-item:not(.visible)');
            newItems.forEach(item => item.classList.add('visible'));
        }, 100);

        isLoading = false;
        loadingElement.classList.remove('loading-visible');

        // Check if we've reached the end
        if (currentIndex >= presidentsData.length) {
            loadingElement.style.display = 'none';
            footerElement.style.display = 'block';
            setTimeout(() => {
                footerElement.classList.add('visible');
            }, 100);
        }

        // Check if we should load more
        checkScroll();
    }, 1000); // Simulate loading delay
}

function checkScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const timelineBottom = timeline.offsetTop + timeline.offsetHeight;

    if (scrollPosition >= timelineBottom - 500) {
        loadMoreItems();
    }
}

// Initial load
loadMoreItems();

// Event listeners
window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);