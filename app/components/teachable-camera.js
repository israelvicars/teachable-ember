/* eslint-disable no-console */
import Component from '@ember/component';

const { KNNImageClassifier } = knn_image_classifier;
const { Array3D, ENV } = deeplearn;

const IMAGE_SIZE = 227;
const TOPK = 10;

class Main {
  constructor(NUM_CLASSES = 3){
    this.numClasses = NUM_CLASSES;
    this.infoTexts = [];
    this.training = -1;
    this.videoPlaying = false;

    this.knn = new KNNImageClassifier(NUM_CLASSES, TOPK, ENV.math);
    this.video = document.getElementById('tvid');

    // Create training buttons and info texts
    for(let i=0;i<NUM_CLASSES; i++){
      //const div = document.createElement('div');
      //document.body.appendChild(div);
      //div.style.marginBottom = '10px';

      //// Create training button
      //const button = document.createElement('button')
      //button.innerText = "Train "+i;
      //div.appendChild(button);

      //// Listen for mouse events when clicking the button
      //button.addEventListener('mousedown', () => this.training = i);
      //button.addEventListener('mouseup', () => this.training = -1);

      // Create info text
      const infoText = document.createElement('span')
      infoText.innerText = " No examples added";
      document.body.appendChild(infoText);
      this.infoTexts.push(infoText);
    }

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.width = IMAGE_SIZE;
        this.video.height = IMAGE_SIZE;

        this.video.addEventListener('playing', ()=> this.videoPlaying = true);
        this.video.addEventListener('paused', ()=> this.videoPlaying = false);
      })

    this.knn.load()
      .then(() => this.start());
  }

  start(){
    if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  stop(){
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  animate(){
    if(this.videoPlaying){
      // Get image data from video element
      const image = Array3D.fromPixels(this.video);

      // Train class if one of the buttons is held down
      if(this.training != -1){
        // Add current image to classifier
        this.knn.addImage(image, this.training)
      }

      // If any examples have been added, run predict
      const exampleCount = this.knn.getClassExampleCount();
      if(Math.max(...exampleCount) > 0){
        this.knn.predictClass(image)
        .then((res)=>{
          for(let i=0; i<this.numClasses; i++){
            // Make the predicted class bold
            if(res.classIndex == i){
              this.infoTexts[i].style.fontWeight = 'bold';
            } else {
              this.infoTexts[i].style.fontWeight = 'normal';
            }

            // Update info text
            if(exampleCount[i] > 0){
              this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i]*100}%`
            }
          }
        })
        // Dispose image when done
        .then(()=> image.dispose())
      } else {
        image.dispose()
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
}

export default Component.extend({
  classes: [
    { label: 'Class 0', status: 'No examples added' },
    { label: 'Class 1', status: 'No examples added' }
  ],

  didInsertElement() {
    this._super(...arguments);

    this.knn = new Main(this.get('classes.length'));
  },

  actions: {
    startTraining(index) {
      this.set('knn.training', index);
    },
    stopTraining() {
      this.set('knn.training', -1);
    },
  }
});
