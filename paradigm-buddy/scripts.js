document.addEventListener('DOMContentLoaded', () => {
    const paradigmSelector = document.getElementById('paradigmSelector');
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
            const selectedParadigm = document.querySelector('input[name="paradigm"]:checked').value;
            currentParadigm = paradigms[selectedParadigm];
            updateParadigmItem();
        })
        .catch(error => console.error('Error loading paradigms:', error));

    function updateParadigmItem() {
        if (rowIndex < currentParadigm.length && colIndex < currentParadigm[rowIndex].length) {
            paradigmItem.textContent = currentParadigm[rowIndex][colIndex];
        } else {
            paradigmItem.textContent = "End of Paradigm";
        }
    }

    paradigmSelector.addEventListener('change', () => {
        const selectedParadigm = document.querySelector('input[name="paradigm"]:checked').value;
        currentParadigm = paradigms[selectedParadigm];
        rowIndex = 0;
        colIndex = 0;
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
        colIndex++;
        if (colIndex >= currentParadigm[rowIndex].length) {
            colIndex = 0;
            rowIndex++;
        }
        if (rowIndex < currentParadigm.length) {
            updateParadigmItem();
        } else {
            paradigmItem.textContent = "End of Paradigm";
        }
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
});