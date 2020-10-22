let form = document.getElementById("form");
let search = document.getElementById("search");
let result = document.getElementById("result");
let more = document.getElementById("more");

let apiURL = "https://api.lyrics.ovh";

// Search by song or artist
async function searchSongs(term) {
  let res = await fetch(`${apiURL}/suggest/${term}`);
  let data = await res.json();

  showData(data);
}

// Show song artist in DOM
function showData(data) {
  result.innerHTML = `<ul class="song">
  ${data.data
    .map(
      (song) => `<li>
  <span><strong>${song.artist.name}</strong> - ${song.title}</span>
  <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
  </li`
    )
    .join("")}
  </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
    ${
      data.prev
        ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
        : ""
    } 
    ${
      data.next
        ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
        : ""
    }

    `;
  } else {
    more.innerHTML = "";
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  let res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);

  let data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songtitle) {
  let res = await fetch(`${apiURL}/v1/${artist}/${songtitle}`);

  let data = await res.json();

  let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songtitle}</h2>
  <span>${lyrics}</span>`;
  more.innerHTML = "";
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let searchTerm = search.value.trim();

  // Phu dinh
  if (!searchTerm) {
    alert("Please type in a search term");
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener("click", (e) => {
  let clickEl = e.target;

  if (clickEl.tagName === "BUTTON") {
    let artist = clickEl.getAttribute("data-artist");
    let songTitle = clickEl.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
});
