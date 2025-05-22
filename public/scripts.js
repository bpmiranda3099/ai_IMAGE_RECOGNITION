document.addEventListener('DOMContentLoaded', () => {
    const loadView = document.getElementById('loadView');
    const canvas = document.getElementById('loadingCanvas');
    const loadingText = document.getElementById('loadingText');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create multifaceted abstract 3D objects
    const geometries = [
        new THREE.TetrahedronGeometry(),
        new THREE.OctahedronGeometry(),
        new THREE.DodecahedronGeometry(),
        new THREE.IcosahedronGeometry(),
        new THREE.BoxGeometry(),
        new THREE.ConeGeometry(),
        new THREE.CylinderGeometry(),
        new THREE.SphereGeometry(),
        new THREE.TorusGeometry(),
        new THREE.RingGeometry()
    ];
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    let abstractObject = new THREE.Mesh(geometries[0], material);
    scene.add(abstractObject);

    // Add grid plane
    const gridHelper = new THREE.GridHelper(20, 20, 0xffffff, 0xffffff);
    gridHelper.position.y = -2; // Position the grid below the object
    scene.add(gridHelper);

    // Add 3D text
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry1 = new THREE.TextGeometry('ai', {
            font: font,
            size: 1.5, // Decreased size
            height: 0.1,
        });
        const textGeometry2 = new THREE.TextGeometry('///IMAGE', {
            font: font,
            size: 1.5, // Increased size
            height: 0.1,
        });
        const textGeometry3 = new THREE.TextGeometry('RECOGNITION', {
            font: font,
            size: 1.5, // Increased size
            height: 0.1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh1 = new THREE.Mesh(textGeometry1, textMaterial);
        const textMesh2 = new THREE.Mesh(textGeometry2, textMaterial);
        const textMesh3 = new THREE.Mesh(textGeometry3, textMaterial);
        textMesh1.position.set(-6, 2, -5); // Position the text above IMAGE///
        textMesh2.position.set(-4.3, 2, -5); // Position the text in the background
        textMesh3.position.set(-6.5, 0.5, -5); // Position the text in the background
        scene.add(textMesh1);
        scene.add(textMesh2);
        scene.add(textMesh3);

        // Add drawing effect
        const drawEffect = (mesh, duration) => {
            const totalLength = mesh.geometry.attributes.position.count;
            let currentLength = 0;
            const drawInterval = setInterval(() => {
                currentLength += totalLength / (duration / 50);
                if (currentLength >= totalLength) {
                    clearInterval(drawInterval);
                    mesh.geometry.setDrawRange(0, totalLength);
                } else {
                    mesh.geometry.setDrawRange(0, currentLength);
                }
            }, 100);
        };

        drawEffect(textMesh1, 2000); // Draw "TEACHABLE" over 2 seconds
        drawEffect(textMesh2, 2000); // Draw "MACHINE//" over 2 seconds
        drawEffect(textMesh3, 2000);
    });

    function animate() {
        requestAnimationFrame(animate);
        abstractObject.rotation.x += 0.01;
        abstractObject.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();

    // Randomly transform the object every second without repeating shapes
    let availableGeometries = [...geometries];
    setInterval(() => {
        if (availableGeometries.length === 0) {
            availableGeometries = [...geometries];
        }
        const randomIndex = Math.floor(Math.random() * availableGeometries.length);
        const randomGeometry = availableGeometries.splice(randomIndex, 1)[0];
        scene.remove(abstractObject);
        abstractObject = new THREE.Mesh(randomGeometry, material);
        scene.add(abstractObject);
    }, 500);

    // Update loading text
    let percentage = 0;
    const interval = setInterval(() => {
        percentage += 1;
        loadingText.textContent = percentage;
        if (percentage >= 100) {
            clearInterval(interval);
            loadView.style.display = 'none';
        }
    }, 40); // 4000ms / 100 = 40ms per percentage point

    loadModel('assets/bottle/scene.gltf', 'model1');
    loadModel('assets/shoe/scene.gltf', 'model2');
    loadModel('assets/watch/scene.gltf', 'model3');
    loadModel('assets/smartphone/scene.gltf', 'model4');
    loadModel('assets/myself/scene.gltf', 'model5');

    document.querySelectorAll('.loading-bar').forEach(bar => {
        bar.addEventListener('click', () => {
            const modelId = bar.getAttribute('data-model');
            document.querySelectorAll('.model-wrapper').forEach(wrapper => {
                wrapper.style.display = 'none';
            });
            document.getElementById(modelId).style.display = 'block';
        });
    });    // Ensure portfolio button is clickable
    const portfolioButton = document.querySelector('.nav-links a');
    if (portfolioButton) {
        portfolioButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://bpmiranda3099.github.io/', '_blank');
            return false;
        });
        
        // Make sure it's styled to indicate it's clickable
        portfolioButton.style.cursor = 'pointer';
        portfolioButton.style.pointerEvents = 'auto';
        portfolioButton.title = 'Click to open portfolio';
    }
});

window.addEventListener('load', () => {
    document.getElementById('pageNumbers').classList.add('flip-in');
});

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

document.querySelectorAll('.page-numbers span').forEach((span, index) => {
    span.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}

// Automatically move the carousel every 2 seconds
setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}, 5000);

function getStarted() {
    window.location.href = 'model.html';
}

function loadModel(modelPath, containerId) {
    const modelContainer = document.getElementById(containerId);
    const modelViewer = document.createElement('model-viewer');
    modelViewer.src = modelPath;
    modelViewer.alt = "A 3D model";
    modelViewer.autoRotate = true;
    modelViewer.cameraControls = true;
    modelViewer.style.width = '50vw'; // Adjust width to fit within the viewport
    modelViewer.style.height = '50vh'; // Adjust height to fit within the viewport
    modelViewer.style.position = 'absolute'; // Ensure the model-viewer is positioned absolutely
    modelViewer.style.top = '50%'; // Center vertically
    modelViewer.style.left = '50%'; // Center horizontally
    modelViewer.style.transform = 'translate(-50%, -50%)'; // Center both horizontally and vertically
    modelContainer.appendChild(modelViewer);

    // Log the coordinates of the model
    modelViewer.addEventListener('load', () => {
        console.log(`Model ${containerId} loaded at coordinates:`, modelViewer.getBoundingClientRect());
    });
}

function updateLoadingBars(predictions) {
    let highestPredictionIndex = 0;
    let highestProbability = 0;

    predictions.forEach((prediction, index) => {
        const loadingBar = document.querySelector(`.loading-bar[data-model="model${index + 1}"]`);
        if (loadingBar) {
            loadingBar.style.width = `${prediction.probability * 100}%`;
        }

        // Check for the highest prediction
        if (prediction.probability > highestProbability) {
            highestProbability = prediction.probability;
            highestPredictionIndex = index;
        }
    });

    // Show the model with the highest prediction
    const modelWrappers = document.querySelectorAll('.model-wrapper');
    modelWrappers.forEach((wrapper, index) => {
        if (index === highestPredictionIndex) {
            wrapper.style.display = 'block';
        } else {
            wrapper.style.display = 'none';
        }
    });
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    updateLoadingBars(prediction);
}

VANTA.NET({
    el: "#mainContent",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0xffffff,
    backgroundColor: 0x000000,
    points: 8.00,  // Reduce number of points for better performance
    maxDistance: 20.00,  // Reduce max distance
    spacing: 10.00,  // Increase spacing
    backgroundAlpha: 0.10,  // Make background more transparent
    mouseCoeffX: 0.1,
    mouseCoeffY: 0.1
});
