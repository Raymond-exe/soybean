const MOUSE_THRESHOLD = 75;
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
    element.className = "hidden photo";

    // select a random photo for use
    const photo = PIKA_PICS[Math.floor(Math.random() * PIKA_PICS.length)];
    if (photo_srcs.includes(photo)) {
        return getRandomImage(x, y);
    }
    element.style.left = x;
    element.style.top = y;
    element.src = `${photo}?width=256&height=256`;

    photofield().appendChild(element);

    photos.push(element);
    photo_srcs.push(photo)
    while (photos.length > MAX_PHOTOS) {
        photo_srcs.shift();
        let del = photos.shift();
        del.classList.add("hidden");
        del.style.opacity = 0;
        setTimeout(() => {
            del.remove();
        }, 750);
    }
    
    setTimeout(() => {
        element.classList.remove("hidden");
    }, 1);

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
