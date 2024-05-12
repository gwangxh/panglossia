function applyFilter() {
    const searchTerm = document.getElementById('filter-input').value.toLowerCase();
    const filterUnits = document.querySelectorAll('.filter-unit');

    filterUnits.forEach(unit => {
        const text = unit.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            unit.style.display = ''; // Makes the div visible
        } else {
            unit.style.display = 'none'; // Hides the div
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const filterText = params.get('filter'); // Assuming the URL parameter is named 'filter'

    if (filterText) {
        const decodedText = decodeURIComponent(filterText);
        document.getElementById('filter-input').value = decodedText;
        applyFilter(); // Run filter function after setting input
        document.getElementById('document-title').innerHTML += `</br>(Selected passages with “${decodedText}”)`;
        document.getElementById('current-filter').innerHTML = `<b>Filtering for: "${decodedText}" <button id="cancel-filter">✖</a></button>`;
        document.getElementById('cancel-filter').addEventListener('click', function() {
            // This will reload the page to the base URL without any query parameters.
            window.location.href = window.location.pathname;
        });
    }
});

// Commented out filtering without page reload
// document.getElementById('filter-button').addEventListener('click', applyFilter);

document.getElementById('filter-button').addEventListener('click', function() {
    const input = document.getElementById('filter-input');
    const filterValue = encodeURIComponent(input.value);
    // Construct a new URL with the filter parameter
    window.location.href = `${window.location.pathname}?filter=${filterValue}`;
});

document.getElementById('highlight-button').addEventListener('click', function() {
    const searchTerm = document.getElementById('filter-input').value.toLowerCase();
    const filterUnits = document.querySelectorAll('.filter-unit');

    // Function to remove existing highlights
    function removeHighlights(node) {
        if (node.nodeType === 1 && node.childNodes) { // Node.ELEMENT_NODE
            const children = Array.from(node.childNodes);
            children.forEach(child => {
                if (child.nodeType === 1 && child.classList.contains('highlight')) {
                    node.replaceChild(document.createTextNode(child.textContent), child);
                } else {
                    removeHighlights(child);
                }
            });
        }
    }

    // Function to highlight text without disrupting HTML structure
    function highlightText(node) {
        if (node.nodeType === 3) { // Node.TEXT_NODE
            const text = node.nodeValue;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            if (text.match(regex)) {
                const frag = document.createDocumentFragment();
                let lastIdx = 0;
                text.replace(regex, (match, group, index) => {
                    const part = document.createTextNode(text.slice(lastIdx, index));
                    const highlighted = document.createElement('span');
                    highlighted.className = 'highlight';
                    highlighted.textContent = match;
                    frag.appendChild(part);
                    frag.appendChild(highlighted);
                    lastIdx = index + match.length;
                });
                frag.appendChild(document.createTextNode(text.slice(lastIdx)));
                const parent = node.parentNode;
                parent.insertBefore(frag, node);
                parent.removeChild(node);
            }
        } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) { // Node.ELEMENT_NODE
            Array.from(node.childNodes).forEach(highlightText);
        }
    }

    // Remove existing highlights before adding new ones
    filterUnits.forEach(unit => {
        removeHighlights(unit);
    });

    // Apply new highlighting
    filterUnits.forEach(unit => {
        highlightText(unit);
    });
});

// CSS for highlighting
const style = document.createElement('style');
style.innerHTML = `.highlight { background-color: yellow; }`;
document.head.appendChild(style);