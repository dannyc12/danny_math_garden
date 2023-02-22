var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}
    function predictImage() {
    // console.log('processing...');
    let image = cv.imread(canvas);
    // convert to gray scale and set threshold
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);
    // get contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    // bounding rectangle
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    // crop image using rectangle
    image = image.roi(rect);

    var height = image.rows;
    var width = image.cols;
    
    if (height >= width) {
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols/scaleFactor);
    } else {
        width = 20
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows/scaleFactor)
        
    }
    
    let dsize = new cv.Size(width, height);
    cv.resize(image, image, (dsize), 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - width)/2);
    const RIGHT = Math.floor(4 + (20 - width)/2);
    const TOP = Math.ceil(4 + (20 - height)/2);
    const BOTTOM = Math.floor(4 + (20 - height)/2);
    // console.log(`top: ${TOP}, bottom: ${BOTTOM}, left: ${LEFT}, right: ${RIGHT}`);
    
    // Add padding
    let s = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, s);

    // Find center of mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;
    // console.log(`M00: ${Moments.m00}, cx: ${cx}, cy: ${cy}`);
    
    const X_SHIFT = Math.round(image.cols/2 - cx); // 14 is midpoint of canvas
    const Y_SHIFT = Math.round(image.rows/2 - cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    dsize = new cv.Size(image.rows, image.cols);
    // You can try more different parameters
    cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    
    let pixelValues = image.data;
    // console.log(`pixel values: ${pixelValues}`);
    pixelValues = Float32Array.from(pixelValues);
    
    // update pixelValues array (divide by 255)
    pixelValues = pixelValues.map(function(item){
        return item / 255.0;
    });
    // console.log(`Scaled array: ${pixelValues}`);
    
    // Create tensor (in square brackets to make it 2d)
    const X = tf.tensor([pixelValues]);
    // console.log(`Shape of Tensor: ${X.shape}`);
    // console.log(`dtype of Tensor: ${X.dtype}`);
    
    // Predict with model
    const result = model.predict(X);
    result.print();
    // console.log(tf.memory());

    // store prediction
    const output = result.dataSync()[0];

    // Testing Only (delete later)
    const outputCanvas = document.createElement('CANVAS');
    cv.imshow(outputCanvas, image);
    document.body.appendChild(outputCanvas);

    // Cleanup
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();
    X.dispose();
    result.dispose();

    return output
}

    