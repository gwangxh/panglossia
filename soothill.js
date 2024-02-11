// Function to load external XML file
function loadXMLFile(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseXML);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

// Function to search the dictionary
function searchDictionary(xmlDoc, term) {
  var entries = xmlDoc.querySelectorAll('entry');
  var results = [];
  entries.forEach(function(entry) {
    var form = entry.querySelector('form').textContent;
    var sense = entry.querySelector('sense').textContent;
    if (form == term) {
      results.push({ form: form, sense: sense });
    }
  });
  return results;
}

// Function to display search results in the side panel
function displayResults(results) {
  const sidePanel = document.getElementById('side-panel');
  sidePanel.innerHTML = ''; // Clear previous results
  
  if (results.length === 0) {
    sidePanel.innerText = 'No results found.';
  } else {
    results.forEach(function(result) {
      const resultDiv = document.createElement('div');
      resultDiv.innerHTML = '<strong>' + result.form + '</strong>: ' + result.sense;
      sidePanel.appendChild(resultDiv);
    });
  }
}

// Function to perform search when clicking on text
document.querySelectorAll('.lookup').forEach(function(element) {
  element.addEventListener('click', function(event) {
    var searchTerm = element.textContent.trim();
    var xmlFileUrl = 'ddbc.soothill-hodous.tei.p5.xml'; // Replace 'path_to_your_xml_file' with the actual path
    loadXMLFile(xmlFileUrl, function(xmlDoc) {
      var searchResults = searchDictionary(xmlDoc, searchTerm);
      displayResults(searchResults);
    });
  });
});
