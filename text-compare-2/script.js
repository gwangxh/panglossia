document.getElementById('compareButton').addEventListener('click', compareTexts);

function compareTexts() {
    const text1 = document.getElementById('text1').value.trim();
    const text2 = document.getElementById('text2').value.trim();
    const text3 = document.getElementById('text3').value.trim();

    if (!text1 || !text2 || !text3) {
        alert('Please fill in all three text fields.');
        return;
    }

    const dmp = new diff_match_patch();

    // Compare text1 vs text2
    const diff12 = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diff12);

    // Compare text1 vs text3
    const diff13 = dmp.diff_main(text1, text3);
    dmp.diff_cleanupSemantic(diff13);

    // Render the results
    renderDiffs(diff12, diff13);
}

function renderDiffs(diff12, diff13) {
    const output = document.getElementById('output');
    output.innerHTML = ''; // Clear previous output

    // Generate HTML for the comparison
    const comparisonHTML = mergeDiffs(diff12, diff13);
    output.innerHTML = comparisonHTML;
}

function mergeDiffs(diff12, diff13) {
    let mergedHTML = '';

    const maxLength = Math.max(diff12.length, diff13.length);

    for (let i = 0; i < maxLength; i++) {
        const part12 = diff12[i] || [0, '']; // Default to neutral if no match
        const part13 = diff13[i] || [0, ''];

        const operation12 = part12[0];
        const text12 = part12[1];

        const operation13 = part13[0];
        const text13 = part13[1];

        // Combine the operations into one unified view
        if (operation12 === 0 && operation13 === 0) {
            mergedHTML += `<span class="diff-equal">${text12}</span>`;
        } else {
            if (operation12 === -1) {
                mergedHTML += `<span class="diff-delete">[Variant 2: ${text12}]</span>`;
            } else if (operation12 === 1) {
                mergedHTML += `<span class="diff-insert">[Variant 2: ${text12}]</span>`;
            }

            if (operation13 === -1) {
                mergedHTML += `<span class="diff-delete">[Variant 3: ${text13}]</span>`;
            } else if (operation13 === 1) {
                mergedHTML += `<span class="diff-insert">[Variant 3: ${text13}]</span>`;
            }
        }
    }

    return mergedHTML;
}