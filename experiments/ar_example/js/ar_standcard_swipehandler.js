window.addEventListener('load', function() {

    function rotateCardArdYAxisBy(deg) {
        const card = document.querySelector("#card_obj");
        let rotation = card.getAttribute('rotation');
        rotation.y += deg;
        card.setAttribute('rotation', rotation);
    }

    function openCardByDeg(deg) {
        const cover = document.querySelector("#cover_obj");
        let rotation = cover.getAttribute('rotation');
        if (rotation.y <= -150) {
            if (deg < 0) {
                rotation.y = -150;
            } else {
                rotation.y += deg;
            }  
        } else if (rotation.y >= -20) {
            if (deg > 0) {
                rotation.y = -20;
            } else {
                rotation.y += deg;
            }
        } else {
            rotation.y += deg;
        }
        cover.setAttribute('rotation', rotation);
    }

    let mc = new Hammer.Manager(document.querySelector("#scene_obj"), {
        recognizers: [
            [Hammer.Pan],
            [Hammer.Pinch]
        ]});

    mc.on("panleft", function(ev) {
        rotateCardArdYAxisBy(-5);
    });

    mc.on("panright", function(ev) {
        rotateCardArdYAxisBy(5);
    });

    mc.on("pinchout", function(ev) {
        openCardByDeg(-1);
    })

    mc.on("pinchin", function(ev) {
        openCardByDeg(1);
    })
});