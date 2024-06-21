document.addEventListener('DOMContentLoaded', () => {
    const paradigms = {
        gaja: [
            ["gajaḥ", "gajau", "gajāḥ"],
            ["gajam", "gajau", "gajān"],
            ["gajena", "gajābhyām", "gajaiḥ"],
            ["gajāya", "gajābhyām", "gajebhyaḥ"],
            ["gajāt", "gajābhyām", "gajebhyaḥ"],
            ["gajasya", "gajayoḥ", "gajānām"],
            ["gaje", "gajayoḥ", "gajeṣu"],
            ["gaja", "gajau", "gajāḥ"]
        ],
        phala: [
            ["phalam", "phale", "phalāni"],
            ["phalam", "phale", "phalāni"],
            ["phalena", "phalābhyām", "phalaiḥ"],
            ["phalāya", "phalābhyām", "phalebhyaḥ"],
            ["phalāt", "phalābhyām", "phalebhyaḥ"],
            ["phalasya", "phalayoḥ", "phalānām"],
            ["phale", "phalayoḥ", "phaleṣu"],
            ["phala", "phale", "phalāni"]
        ]
        // Add more paradigms here
    };

    const paradigmSelector = document.getElementById('paradigmSelector');
    const paradigmItem = document.getElementById('paradigmItem');
    const nextButton = document.getElementById('nextButton');

    let currentParadigm = paradigms[paradigmSelector.value];
    let rowIndex = 0;
    let colIndex = 0;

    function updateParadigmItem() {
        if (rowIndex < currentParadigm.length && colIndex < currentParadigm[rowIndex].length) {
            paradigmItem.textContent = currentParadigm[rowIndex][colIndex];
        } else {
            paradigmItem.textContent = "End of Paradigm";
        }
    }

    paradigmSelector.addEventListener('change', () => {
        currentParadigm = paradigms[paradigmSelector.value];
        rowIndex = 0;
        colIndex = 0;
        updateParadigmItem();
    });

    nextButton.addEventListener('click', () => {
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
    });

    // Initialize with the first item of the default paradigm
    updateParadigmItem();
});