export default class Camera{
    videoNode; // html element vom typ vid übergeben
    constructor(videoNode){
        this.videoNode = videoNode;
    }

    switchOn() {
        // Get camera media stream and set it to player
        navigator.mediaDevices
            .getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
                facingMode: 'user', // or environment
            })
            .then(stream => {
                console.log('Establish stream');
                this.videoNode.srcObject = this.stream = stream;
            });
    }

        takePhoto() {
        // Create a canvcas to draw on
        let canvas = document.createElement('canvas');
        canvas.setAttribute('width', 640);
        canvas.setAttribute('height', 480);
        let context = canvas.getContext('2d');
        // Copy image from video to canvas
        context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);
        // Convert image to data string
        this.photo = context.canvas.toDataURL();
        // Release resources
        context = null;
        canvas = null;
        return this.photo;
    }

    switchOff() {
        this.videoNode.pause();
        this.stream.getTracks()[0].stop();
    }

}
