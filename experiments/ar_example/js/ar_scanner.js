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

        const assetExtensions = ['.png', '.jpeg', '.gif']
        // Note: Place .gif last as gif library modifies element.

        function setTexture(entityId, noFormatMatchCallback) {

            // Which extension to try.
            function useExtension(assetEltId, entityId, extensionIdx) {
                // Specific settings for .gif.
                if (assetExtensions[extensionIdx] === '.gif') {
                    const gifElt = document.getElementById(assetEltId);
                    gifElt.addEventListener('load', function() {
                        // Parse gif element.
                        let gifObj = new SuperGif({ gif: gifElt, progressbar_height: 0 });
                        let frameList = []
                        
                        gifObj.load(function() {
                            // Split gif into image frames.
                            for (let frameId = 0; frameId < gifObj.get_length(); frameId++) {
                                gifObj.move_to(frameId);
                                frameList.push(gifObj.get_canvas().toDataURL());
                            }

                            // Set interval to update card AR model with gif image frames.
                            let frameRate = new URLSearchParams(window.location.search).get('fr');
                            if (frameRate === null) {
                                frameRate = 500;    // Default framerate to 500ms.
                            }
                            let frameIdx = 0;
                            function changeFrame() {                                
                                let entityMaterial = document.getElementById(entityId).getAttribute('material');
                                entityMaterial.src = frameList[frameIdx];
                                document.getElementById(entityId).setAttribute('material', entityMaterial);
                                frameIdx = (frameIdx+1)%frameList.length;
                            }
                            setInterval(changeFrame, frameRate);
                        })
                    });
                    gifElt.src = photoLibraryLink + entityId + assetExtensions[extensionIdx];
                }
                
                else {
                    document.getElementById(assetEltId).src = photoLibraryLink + entityId + assetExtensions[extensionIdx];
                    let entityMaterial = document.getElementById(entityId).getAttribute('material');
                    entityMaterial.src = '#' + assetEltId;
                    document.getElementById(entityId).setAttribute('material', entityMaterial);
                }
            }

            // Cycle and try extensions in extension list.
            const assetEltId = entityId + '_img';
            let extIdx = 0;
            document.getElementById(assetEltId).addEventListener('error', function() {
                if (extIdx === assetExtensions.length - 1) {
                    noFormatMatchCallback();
                } else {
                    extIdx += 1
                    useExtension(assetEltId, entityId, extIdx);
                }
            });
            useExtension(assetEltId, entityId, extIdx);
        }

        setTexture('cover', reportError);
        setTexture('innercover', reportError);
        setTexture('content', reportError);
        // Don't report error if backcover does not exist 
        // since backcover is not necessarily available.
        setTexture('backcover', function() {
            let entityMaterial = document.getElementById('backcover').getAttribute('material');
            entityMaterial.src = './placeholder_backcover.png';
            document.getElementById('backcover').setAttribute('material', entityMaterial);
        });
    }

    setUpCardTextures();
})