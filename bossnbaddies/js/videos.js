const API_KEY = "AIzaSyDi_mmvbR_fW0IGq0POrvJDyBjDyN4QZAw";

const container = document.getElementById("video-sections");
const debugBox = document.getElementById("debug");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function setDebug(message) {
  debugBox.textContent = message;
}

async function searchVideos(query) {
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet" +
    "&q=" + encodeURIComponent(query) +
    "&type=video" +
    "&videoEmbeddable=true" +
    "&maxResults=12" +
    "&key=" + API_KEY;

  const response = await fetch(url);
  return await response.json();
}

async function getVideoDetails(ids) {
  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    "?part=status,snippet" +
    "&id=" + ids.join(",") +
    "&key=" + API_KEY;

  const response = await fetch(url);
  return await response.json();
}

function clearResults() {
  container.innerHTML = "";
}

function renderResults(videos, titleText) {
  clearResults();

  const section = document.createElement("section");
  section.innerHTML = "<h2>" + titleText + "</h2>";

  const grid = document.createElement("div");
  grid.className = "video-grid";

  videos.forEach(video => {
    const videoId = video.id;
    const title = video.snippet.title;

    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML =
      '<div class="video-frame">' +
      '<iframe ' +
      'src="https://www.youtube.com/embed/' + videoId + '" ' +
      'title="' + title.replace(/"/g, "&quot;") + '" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
      'allowfullscreen>' +
      '</iframe>' +
      '</div>' +
      '<h3>' + title + '</h3>';

    grid.appendChild(card);
  });

  section.appendChild(grid);
  container.appendChild(section);
}

async function runSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    setDebug("Type an artist or song first.");
    clearResults();
    return;
  }

  setDebug("Searching for: " + query);
  clearResults();

  try {
    const searchData = await searchVideos(query);

    if (searchData.error) {
      setDebug("Search error: " + searchData.error.message);
      return;
    }

    if (!searchData.items || searchData.items.length === 0) {
      setDebug("No results found.");
      return;
    }

    const ids = searchData.items
      .map(item => item.id && item.id.videoId)
      .filter(Boolean);

    if (ids.length === 0) {
      setDebug("No video IDs found.");
      return;
    }

    const detailsData = await getVideoDetails(ids);

    if (detailsData.error) {
      setDebug("Details error: " + detailsData.error.message);
      return;
    }

    const embeddableVideos = detailsData.items.filter(video => {
      return video.status && video.status.embeddable === true;
    });

    if (embeddableVideos.length === 0) {
      setDebug("No embeddable videos found for this search.");
      return;
    }

    renderResults(embeddableVideos.slice(0, 8), 'Results for "' + query + '"');
    setDebug("Showing " + Math.min(embeddableVideos.length, 8) + " embeddable videos.");
  } catch (err) {
    setDebug("Error: " + err.message);
  }
}

searchBtn.addEventListener("click", runSearch);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    runSearch();
  }
});
