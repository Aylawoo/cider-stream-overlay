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
    fetch("http://localhost:10769/currentPlayingSong")
        .then(response => response.json())
        .then((data) => {
            let playbackProgress = data.info.currentPlaybackTime;
            let songLength = data.info.durationInMillis / 1000;

            title.innerText = data.info.name;
            artist.innerText = data.info.artistName;
            timer.innerText = `${makeTimestamp(playbackProgress)} / ${makeTimestamp(songLength)}`
            progress.style.width = `${(playbackProgress / songLength) * 100}%`
        });
}

window.addEventListener("load", (event) => {
    var titleElem = document.getElementById("songTitle");
    var artistElem = document.getElementById("songArtist");
    var timerElem = document.getElementById("timer");
    var progressElem = document.getElementById("progressPercent");

    getSongInfo(titleElem, artistElem, timerElem, progressElem);
    setInterval(getSongInfo, 1000, titleElem, artistElem, timerElem, progressElem);
});
