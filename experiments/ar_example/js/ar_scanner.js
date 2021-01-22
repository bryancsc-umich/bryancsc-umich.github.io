window.addEventListener('load', function() {
    let reportedError = false;
    function reportError() {
        if (!reportedError) {
            reportedError = true;
            alert("The URL provided to the scanner is invalid!");
        }
    }

    function setUpCardTextures() {
        let photoLibraryLink = new URLSearchParams(window.location.search).get('ref');
        if (photoLibraryLink === null) {
            reportError();
            return;
        }

        if (photoLibraryLink.charAt(photoLibraryLink.length - 1) != '/') {
            photoLibraryLink += '/';
        }
    
        // Set the image and perform error checking.
        document.getElementById('content_img').addEventListener('error', reportError)
        document.getElementById('cover_img').addEventListener('error', reportError)
        document.getElementById('innercover_img').addEventListener('error', reportError)
        document.getElementById('backcover_img').addEventListener('error', reportError)
    
        document.getElementById('innercover_img').src = photoLibraryLink + 'innercover.png';
        document.getElementById('backcover_img').src = photoLibraryLink + 'backcover.png';
        document.getElementById('cover_img').src = photoLibraryLink + 'cover.png';
        document.getElementById('content_img').src = photoLibraryLink + 'content.png';

        // Link entities to images
        let innercover_mat = document.getElementById('innercover').getAttribute('material');
        let backcover_mat = document.getElementById('backcover').getAttribute('material');
        let cover_mat = document.getElementById('cover').getAttribute('material');
        let content_mat = document.getElementById('content').getAttribute('material');

        innercover_mat.src = '#innercover_img'
        backcover_mat.src = '#backcover_img'
        cover_mat.src = '#cover_img'
        content_mat.src = '#content_img'

        document.getElementById('innercover').setAttribute('material', innercover_mat);
        document.getElementById('backcover').setAttribute('material', backcover_mat);
        document.getElementById('cover').setAttribute('material', cover_mat);
        document.getElementById('content').setAttribute('material', content_mat);

        // Update.
        document.querySelector('a-scene').flushToDOM(true);
    }

    setUpCardTextures();
})