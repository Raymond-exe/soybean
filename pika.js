/* * * * * TWEAKABLES * * * * */

// mouse travel before new photo appears
const MOUSE_THRESHOLD = 75;

// max number of photos on the screen
const MAX_PHOTOS = 10;



/* * * * * SCRIPT CACHE STUFF * * * * */

// stores HTML img elements
const photos = [];

// stores srcs of present photos
const photo_srcs = [];

// last position a new photo was added at
let lastPosition = { x: -999, y: -999 };

// JSON data loaded from pikapics.json
let PIKA_PICS;



/* * * * * UTIL METHODS * * * * */

// loads JSON and assigns data to PIKA_PICS (above)
async function loadPikaPics() {
    PIKA_PICS = (await (await fetch('./pikapics.json')).json()).pics;
}
loadPikaPics();

// accessor for document window's photoField div element
function getPhotoField() {
    return document.getElementById("photofield");
}

// calculates distance between two points, default b is lastPosition
function getDistance(a, b = lastPosition) {
    const dX = Math.abs(b.y-a.y);
    const dY = Math.abs(b.y-a.y);
    return Math.sqrt(dX*dX + dY*dY);
}

// creates a random image at (x, y) on the screen, and returns it
function getRandomImage(x, y) {
    // select a random photo for use
    const photo = PIKA_PICS[Math.floor(Math.random() * PIKA_PICS.length)];
    if (photo_srcs.includes(photo)) {
        return getRandomImage(x, y);
    }


    // create HTML element & assign properties
    const element = document.createElement("img");
    element.className = "hidden photo";
    element.style.left = x;
    element.style.top = y;
    element.src = photo;

    // add element to photofield
    getPhotoField().appendChild(element);

    // add element to array
    photos.push(element);
    photo_srcs.push(photo);

    // if array is too large, delete the oldest element
    while (photos.length > MAX_PHOTOS) {
        photo_srcs.shift();
        let del = photos.shift();
        del.classList.add("hidden");
        del.style.opacity = 0;
        setTimeout(() => {
            del.remove();
        }, 750);
    }
    
    // remove "hidden" class from photo shortly
    // used to create grow/shrink effect
    setTimeout(() => {
        element.classList.remove("hidden");
    }, 1);

    return element;
}



/* * * * * EVENT LISTENERS * * * * */

window.addEventListener("mousemove", handleEvent);
window.addEventListener("mousedown", handleEvent);

function handleEvent(event) {
    if (event.type === "mousedown" || getDistance({ x:event.x, y:event.y }) > MOUSE_THRESHOLD) {
        lastPosition = { x: event.x, y: event.y };
        getRandomImage(event.x, event.y);
    }
}
