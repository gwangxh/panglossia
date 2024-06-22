document.addEventListener('DOMContentLoaded', () => {
    const paradigmSelector = document.getElementById('paradigmSelector');
    const scriptSelect = document.getElementById('scriptSelect');
    const paradigmItem = document.getElementById('paradigmItem');
    const nextButton = document.getElementById('nextButton');
    const previousButton = document.getElementById('previousButton');
    
    let paradigms = {};
    let currentParadigm = [];
    let rowIndex = 0;
    let colIndex = 0;

    fetch('paradigms.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            paradigms = data;
            updateCurrentParadigm();
            updateParadigmItem();
        })
        .catch(error => console.error('Error loading paradigms:', error));

    function updateCurrentParadigm() {
        const selectedParadigm = document.querySelector('input[name="paradigm"]:checked').value;
        const selectedScript = scriptSelect.value;
        currentParadigm = paradigms[selectedParadigm][selectedScript];
    }

    function updateParadigmItem() {
        if (rowIndex < currentParadigm.length && colIndex < currentParadigm[rowIndex].length) {
            paradigmItem.textContent = currentParadigm[rowIndex][colIndex];
        } else {
            paradigmItem.textContent = "End of Paradigm";
        }
    }

    paradigmSelector.addEventListener('change', () => {
        rowIndex = 0;
        colIndex = 0;
        updateCurrentParadigm();
        updateParadigmItem();
    });

    scriptSelect.addEventListener('change', () => {
        updateCurrentParadigm();
        updateParadigmItem();
    });

    nextButton.addEventListener('click', () => {
        goToNextItem();
    });

    previousButton.addEventListener('click', () => {
        goToPreviousItem();
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !event.shiftKey) {
            event.preventDefault();
            goToNextItem();
        } else if (event.code === 'Space' && event.shiftKey) {
            event.preventDefault();
            goToPreviousItem();
        }
    });

    function goToNextItem() {
        if (colIndex < currentParadigm[rowIndex].length - 1) {
            colIndex++;
        } else if (rowIndex < currentParadigm.length - 1) {
            colIndex = 0;
            rowIndex++;
        }
        updateParadigmItem();
    }

    function goToPreviousItem() {
        if (colIndex > 0) {
            colIndex--;
        } else if (rowIndex > 0) {
            rowIndex--;
            colIndex = currentParadigm[rowIndex].length - 1;
        }
        updateParadigmItem();
    }

    // Initialize with the first item of the default paradigm
    updateParadigmItem();
});