//  JS - Drum Machine Functionality -------------------------------------------------------------------------->
function flashPad(pad) {
	if (!pad) return;
	pad.classList.add('active');
	setTimeout(() => pad.classList.remove('active'), 120);
}

document.addEventListener("keydown", (event) => {
	let key = event.key.toUpperCase();
	let audio = document.getElementById(key);
	if (!audio) return;
	audio.currentTime = 0;
	audio.play();
	flashPad(audio.parentElement);
});

document.addEventListener("click", (event) => {
	let element = event.target;
	let audio = element.firstElementChild;
	if (!audio) return;
	audio.currentTime = 0;
	audio.play();
	flashPad(pad);
});


// Prevent Scroll Restoration -------------------------------------------------------------------------->
if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}

// Make Game Container Focusable -------------------------------------------------------------------------->
document.getElementById("game-frame").addEventListener("load", () => {
const frame = document.getElementById("game-frame");

frame.addEventListener("click", () => {
frame.focus();
});
});

// Hamburger Menu Functionality (nav + footer) -------------------------------------------------------------------------->
const navHamburger = document.querySelector(".nav-hamburger");
const nav = document.querySelector(".nav-bar");

navHamburger.addEventListener("click", () => {
nav.classList.toggle("active");
});

const footerHamburger = document.querySelector(".footer-hamburger");
const footer = document.querySelector(".footer");

footerHamburger.addEventListener("click", () => {
footer.classList.toggle("active");
});