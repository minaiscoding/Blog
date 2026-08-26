(function () {
  var input = document.getElementById('siteSearchInput');
  var resultsBox = document.getElementById('siteSearchResults');
  if (!input || !resultsBox) return;

  var fuse = null;

  function loadIndex() {
    if (fuse) return Promise.resolve(fuse);
    return fetch('index.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        fuse = new Fuse(data, {
          keys: ['title', 'summary'],
          threshold: 0.35,
          ignoreLocation: true
        });
        return fuse;
      });
  }

  function renderResults(results) {
    resultsBox.innerHTML = '';
    if (!results.length) {
      var empty = document.createElement('div');
      empty.className = 'search-no-results';
      empty.textContent = 'No results';
      resultsBox.appendChild(empty);
      resultsBox.style.display = 'block';
      return;
    }
    results.slice(0, 8).forEach(function (r) {
      var item = r.item;
      var a = document.createElement('a');
      a.href = item.permalink;
      a.className = 'search-result-item';

      var title = document.createElement('div');
      title.className = 'search-result-title';
      title.textContent = item.title;

      var summary = document.createElement('div');
      summary.className = 'search-result-summary';
      summary.textContent = item.summary;

      a.appendChild(title);
      a.appendChild(summary);
      resultsBox.appendChild(a);
    });
    resultsBox.style.display = 'block';
  }

  input.addEventListener('input', function () {
    var q = input.value.trim();
    if (!q) {
      resultsBox.style.display = 'none';
      resultsBox.innerHTML = '';
      return;
    }
    loadIndex().then(function (f) {
      renderResults(f.search(q));
    });
  });

  document.addEventListener('click', function (e) {
    if (!resultsBox.contains(e.target) && e.target !== input) {
      resultsBox.style.display = 'none';
    }
  });
})();