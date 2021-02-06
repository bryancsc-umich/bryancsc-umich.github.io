var processor = {
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      var self = this;
      setTimeout(function () {
        self.timerCallback();
      }, 16); // roughly 60 frames per second
    },
  
    doLoad: function() {
      this.video = document.getElementById("my-video");
      this.c1 = document.getElementById("my-canvas");
      this.ctx1 = this.c1.getContext("2d");
      var self = this;
  
      this.video.addEventListener("play", function() {
        self.width = self.video.width;
        self.height = self.video.height;
        self.timerCallback();
      }, false);
    },
  
    computeFrame: function() {
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);

      var screenshotImgData = this.ctx1.getImageData(0, 0, this.width, this.height);
            
      // Remap.
      var outImgData = remap(screenshotImgData);

      // Display remap.
      this.c1.width = outImgData.width*2;
      this.c1.height = outImgData.height;
      this.ctx1.fillStyle = "black";
      this.ctx1.fillRect(0, 0, this.c1.width, this.c1.height);
      this.ctx1.putImageData(outImgData, Math.floor(outImgData.width/2), 0);
      return;
    }
};

window.addEventListener('load', function() {
    processor.doLoad();
    // var canvasStream = document.getElementById('my-canvas').captureStream(25);

    // var element = document.querySelector('#my-video-2')
    // element.srcObject = canvasStream;
    // element.onloadedmetadata = function(e) {
    //     element.play();
    // };
    document.querySelector('#my-video').play();
    // document.querySelector('.a-enter-vr-button').click();
    // document.querySelector("#vsphere").components.material.material.map.image.play();
})