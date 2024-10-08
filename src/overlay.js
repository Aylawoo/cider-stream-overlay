/**
 * Pad a number with leading zeroes to be a specified final character count while
 * maintaining number sign.
 * @param {number} number Number to apply padding to
 * @param {number} target_length Desired final number length
 * @returns {string} Number with padding applied as a string
 */
function padNumber(number, target_length) {
    if (Math.sign(number) >= 0) {
        return number.toString().padStart(target_length, "0");
    } else {
        return (
            "-" +
            Math.abs(number)
                .toString()
                .padStart(target_length - 1, "0")
        );
    }
}
/**
 * Make a simple timestamp (1:00) from a given number of seconds
 * @param {number} seconds The total amount of seconds
 * @returns {string} A standard format timestamp in minutes and seconds
 */
function makeTimestamp(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds - minutes * 60;

    if (seconds == 60) {
        seconds = 0;
        minutes += 1;
    }

    minutes = minutes.toFixed(0);
    seconds = seconds.toFixed(0);

    return `${padNumber(minutes, 2)}:${padNumber(seconds, 2)}`
}

/**
 * Set the overlay info from the Cider RPC API
 * @param {HTMLElement} title The title header
 * @param {HTMLElement} artist The artist header
 * @param {HTMLElement} timer The progress bar timestamp paragraph
 * @param {HTMLElement} progress The progress bar itself
 */
function getSongInfo(title, artist, timer, progress) {
    let container = document.getElementById("musicBox");

    fetch("http://localhost:10767/api/v1/playback/now-playing")
        .then(response => response.json())
        .then((data) => {
            let art_url = data.info.artwork.url.replace(/(.{12})\w$/, "600x600bb.jpg");
            let playbackProgress = data.info.currentPlaybackTime;
            let songLength = data.info.durationInMillis / 1000;

            container.style.backgroundImage = `url(${art_url})`;

            title.innerText = data.info.name;
            artist.innerText = data.info.artistName;
            timer.innerText = `${makeTimestamp(playbackProgress)} / ${makeTimestamp(songLength)}`
            progress.style.width = `${(playbackProgress / songLength) * 100}%`
        });

        if (container.offsetWidth < title.scrollWidth + 12) {
            title.style.transform = "translateX(100%)";
            title.style.animation = "scroller 16s linear infinite";
        } else {
            title.style.transform = "translateX(0)";
            title.style.animation = "none";
        }
}

window.addEventListener("load", (event) => {
    let titleElem = document.getElementById("songTitle");
    let artistElem = document.getElementById("songArtist");
    let timerElem = document.getElementById("timer");
    let progressElem = document.getElementById("progressPercent");

    getSongInfo(titleElem, artistElem, timerElem, progressElem);
    setInterval(getSongInfo, 1000, titleElem, artistElem, timerElem, progressElem);
});
