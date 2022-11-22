const imageContainer = document.getElementById('image-container');
const errorContainer = document.getElementById('error-container');
const loader = document.getElementById('loader');
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];


// Unsplash API
const count = 30;
const apiKey = 'JqiliMxQYi3HNR2zB1-lMlpbHT3Ygcp9US_yD6CA5Tk';
// const apiUrl = '';

const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;


// Check if all images were loaded
function imageLoaded(){
    imagesLoaded++;
    if (imagesLoaded === totalImages){
        ready = true;
        loader.hidden = true;                                       // splash screen loader only for initial load
        console.log('ready =', ready);
    }
}

//Helper function to Set attributes on DOM Elements
function setAttributes(element, attributes){
    for (const key in attributes){
        element.setAttribute(key, attributes[key]);
    }
}


// Display Photos from unsplash API
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    console.log('totalImages: ', totalImages);
    // Run function for each object in photosArray
    photosArray.forEach((photo) => { 
        // Create <a> link to Unsplash
        const item = document.createElement('a'); 
        // item.setAttribute('href', photo.links.html);            // .links.html from unsplash API response
        // item.setAttribute('target', '_blank');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });

        // Create <img> for photo
        const img = document.createElement('img');
        // img.setAttribute('src', photo.urls.regular);            // ..urls.regular from unsplash API response
        // img.setAttribute('alt', photo.alt_description);         // .alt-description from unsplash API response
        // img.setAttribute('title', photo.alt_description);       // .alt-description from unsplash API response

        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,

        });
        // Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded());
  
        // Put <img> inside <a>, then put both into image-container
        item.appendChild(img);
        imageContainer.appendChild(item);

    });
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        // console.log(response.status);

        if(response.status >= 200 && response.status <=299){
            photosArray = await response.json();    
            displayPhotos();
        } else if (response.status === 403){
            loader.hidden = true;
            errorContainer.innerText = 'Unsplash API: Rate Limit Exceeded! Try again in 1hour!';
        }
    } catch (error) {
        // catch error here
    }
}

// Check to see if scrolling near bottom of page, Load more Photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        // console.log('window.innerHeight: ', window.innerHeight);  
        // console.log('window.scrollY: ', window.scrollY);  
        // console.log('window.innerHeight + scrollY: ', window.innerHeight + window.scrollY);  
        // console.log('document.body.offsetHeight - 1000: ', document.body.offsetHeight - 1000);  
        ready = false;
        getPhotos();
    }
});

// Onload
getPhotos();

