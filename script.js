const searchButton = document.getElementById("searchButton");
const songInput = document.getElementById("songInput");
const songDetails = document.getElementById("songDetails");
const lyricsDiv = document.getElementById("lyrics");

const MUSIXMATCH_API_KEY = "3eb9f183-fcb7-41e1-8a0d-cf87fe72597d"; // Musixmatch API key

// Şarkı arama
searchButton.addEventListener("click", async () => {
    const query = songInput.value.trim();

    if (!query) {
        alert("Lütfen bir şarkı veya sanatçı adı girin!");
        return;
    }

    // Şarkı bilgilerini ve sözlerini al
    const track = await getTrack(query);
    if (track) {
        displaySongDetails(track);
        const lyrics = await getLyrics(track.track_id);
        displayLyrics(lyrics);
    } else {
        alert("Şarkı bulunamadı!");
    }
});

// Şarkı bilgilerini almak için API çağrısı
async function getTrack(query) {
    const response = await fetch(
        `https://api.musixmatch.com/ws/1.1/track.search?q_track=${query}&apikey=${MUSIXMATCH_API_KEY}`
    );
    const data = await response.json();
    if (data.message.body.track_list.length > 0) {
        return data.message.body.track_list[0].track;
    }
    return null;
}

// Şarkı sözlerini almak için API çağrısı
async function getLyrics(trackId) {
    const response = await fetch(
        `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${MUSIXMATCH_API_KEY}`
    );
    const data = await response.json();
    return data.message.body.lyrics.lyrics_body || "Şarkı sözleri bulunamadı.";
}

// Şarkı bilgilerini ekranda göster
function displaySongDetails(track) {
    songDetails.innerHTML = `
        <img src="${track.album_coverart_100x100 || 'https://via.placeholder.com/100'}" alt="${track.track_name}">
        <h2>${track.track_name} - ${track.artist_name}</h2>
        <p>Albüm: ${track.album_name}</p>
    `;
}

// Şarkı sözlerini ekranda göster
function displayLyrics(lyrics) {
    lyricsDiv.textContent = lyrics;
}
