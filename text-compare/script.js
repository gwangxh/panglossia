document.getElementById('processButton').addEventListener('click', processText);
document.getElementById('finalizeButton').addEventListener('click', finalizeText);

function processText() {
    const input1 = document.getElementById('input1').value.trim();
    const input2 = document.getElementById('input2').value.trim();
    const input3 = document.getElementById('input3').value.trim();

    if (!input1 || !input2 || !input3) {
        alert('Please fill in all three text inputs.');
        return;
    }

    const chunks = getChunks(input1, input2, input3);
    renderChunks(chunks);
}

function getChunks(text1, text2, text3) {
    const chunks = [];
    findLCS(text1, text2, text3, chunks);
    return chunks;
}

function findLCS(str1, str2, str3, chunks) {
    const lcs = getLCS(str1, str2, str3);

    if (!lcs || lcs.length < 1 || !lcs.includes(' ')) {
        // If no valid LCS or LCS is less than one word
        if (str1.trim() || str2.trim() || str3.trim()) {
            chunks.push({
                type: 'c',
                text: str1.trim() || str2.trim() || str3.trim(),
                words: [{ word1: str1, word2: str2, word3: str3 }],
            });
        }
        return;
    }

    // Split strings into parts before and after the LCS
    const before1 = str1.substring(0, str1.indexOf(lcs)).trimEnd();
    const after1 = str1.substring(str1.indexOf(lcs) + lcs.length).trimStart();
    const before2 = str2.substring(0, str2.indexOf(lcs)).trimEnd();
    const after2 = str2.substring(str2.indexOf(lcs) + lcs.length).trimStart();
    const before3 = str3.substring(0, str3.indexOf(lcs)).trimEnd();
    const after3 = str3.substring(str3.indexOf(lcs) + lcs.length).trimStart();

    // Add the part before the LCS as differing chunks
    if (before1 || before2 || before3) {
        chunks.push({
            type: 'c',
            text: before1 || before2 || before3,
            words: [{ word1: before1, word2: before2, word3: before3 }],
        });
    }

    // Add the LCS as an identical chunk
    chunks.push({
        type: 'a',
        text: lcs,
        words: [{ word1: lcs, word2: lcs, word3: lcs }],
    });

    // Recursively process the remaining parts
    if (after1.trim() || after2.trim() || after3.trim()) {
        findLCS(after1, after2, after3, chunks);
    }
}

function getLCS(str1, str2, str3) {
    const len1 = str1.length;
    const len2 = str2.length;
    const len3 = str3.length;

    // Create a 3D array for LCS lengths
    const dp = Array(len1 + 1).fill(null).map(() =>
        Array(len2 + 1).fill(null).map(() => Array(len3 + 1).fill(0))
    );

    let lcs = '';
    let maxLen = 0;
    let endIndex1 = 0;

    // Compute the LCS length and track the LCS string
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            for (let k = 1; k <= len3; k++) {
                if (str1[i - 1] === str2[j - 1] && str2[j - 1] === str3[k - 1]) {
                    dp[i][j][k] = dp[i - 1][j - 1][k - 1] + 1;

                    // Update LCS if a longer sequence is found
                    if (dp[i][j][k] > maxLen) {
                        maxLen = dp[i][j][k];
                        endIndex1 = i;
                    }
                }
            }
        }
    }

    // Extract the LCS
    if (maxLen > 0) {
        lcs = str1.substring(endIndex1 - maxLen, endIndex1);
    }

    return lcs;
}

function renderChunks(chunks) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';
    const finalizeButton = document.getElementById('finalizeButton');
    finalizeButton.style.display = 'block';

    chunks.forEach((chunk, index) => {
        const chunkSpan = document.createElement('div');
        chunkSpan.classList.add('chunk', chunk.type);
        chunkSpan.textContent = chunk.text;

        // For 'b' or 'c' chunks, show clickable options
        if (chunk.type === 'b' || chunk.type === 'c') {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options-container');
            optionsContainer.id = `options-container-${index}`;

            ['Variant 1', 'Variant 2', 'Variant 3'].forEach((variant, variantIndex) => {
                const optionButton = document.createElement('div');
                optionButton.classList.add('variant-option');
                optionButton.textContent = chunk.words[0][`word${variantIndex + 1}`] || '(blank)';
                optionButton.dataset.variant = variantIndex + 1;

                // Add click event to select this option
                optionButton.addEventListener('click', () => {
                    document
                        .querySelectorAll(`#options-container-${index} .variant-option`)
                        .forEach((btn) => btn.classList.remove('selected')); // Remove previous selection
                    optionButton.classList.add('selected'); // Highlight this option
                    optionButton.dataset.selected = true; // Mark as selected
                });

                optionsContainer.appendChild(optionButton);
            });

            chunkSpan.appendChild(optionsContainer);
        }

        outputDiv.appendChild(chunkSpan);
    });

    // Store chunks for finalization
    outputDiv.dataset.chunks = JSON.stringify(chunks);
}

function finalizeText() {
    const outputDiv = document.getElementById('output');
    const chunks = JSON.parse(outputDiv.dataset.chunks);

    const finalText = chunks.map((chunk, index) => {
        if (chunk.type === 'a') {
            return chunk.text.trim();
        } else if (chunk.type === 'b' || chunk.type === 'c') {
            const selectedOption = document.querySelector(
                `#options-container-${index} .variant-option.selected`
            );
            return selectedOption ? selectedOption.textContent.trim() : '';
        }
        return '';
    });

    // Join the text with a single space between chunks
    const cleanedText = finalText.filter((chunk) => chunk).join(' ');
    const finalTextDiv = document.getElementById('finalText');
    finalTextDiv.textContent = cleanedText;
}
