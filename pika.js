fetch('./pikapics.json')
    .then((response) => response.json())
    .then((json) => console.log(json));

const MOUSE_THRESHOLD = 50;
const MAX_PHOTOS = 10;
const photos = [];
const photo_srcs = [];
let lastPosition = { x: -999, y: -999 };
let PIKA_PICS;

let imageIndex = 0;

async function loadPikaPics() {
    PIKA_PICS = (await (await fetch('./pikapics.json')).json()).pics;
}
loadPikaPics();

function photofield() {
    return document.getElementById("photofield");
}

function getDistance(a, b = lastPosition) {
    const dX = Math.abs(b.y-a.y);
    const dY = Math.abs(b.y-a.y);
    return Math.sqrt(dX*dX + dY*dY);
}

function getRandomImage(x, y) {
    // creating HTML element
    const element = document.createElement("img");
    element.className = "photo";

    // select a random photo for use
    console.log(PIKA_PICS);
    const photo = PIKA_PICS[Math.floor(Math.random() * PIKA_PICS.length)];
    element.style.left = x + photo.offset.x;
    element.style.top = y + photo.offset.y;
    element.src = photo.src;

    photofield().appendChild(element);

    photos.push(element);
    while (photos.length > MAX_PHOTOS) {
        photos.shift().remove();
    }
    
    return element;
}

window.addEventListener("mousemove", event => {
    if (getDistance(event) > MOUSE_THRESHOLD) {
        lastPosition = { x: event.x, y: event.y };
        getRandomImage(event.x, event.y);
    }
});

window.addEventListener("mousedown", event => {
    getRandomImage(event.x, event.y);
})
