function handleClickEvent() {
    const cover = document.querySelector("#cover_obj");
    let animation = cover.getAttribute('animation');
    if (animation === null || animation.to.y === 0) {
        animation = {
            property: 'rotation',
            to: {
                x: 0,
                y: -180,
                z: 0
            },
            dur: 1000
        }
    } else {
        animation.to.y = 0;
    }
    cover.setAttribute('animation', animation);
}

AFRAME.registerComponent('czar_click', {  
    init: function() {    
        // this.el.addEventListener('touchend', handleClickEvent);    
        this.el.addEventListener('click', handleClickEvent);  
    }
});