document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[name="animal"]');
    const animalImage = document.getElementById('animalImage');
    const fileUpload = document.getElementById('fileUpload');
    const body = document.body;
    const imageBox = document.querySelector('.box:nth-child(2)');

    const animalColors = {
        cat: { body: '#FFD1DC', box: '#FFA07A' },
        dog: { body: '#98FB98', box: '#90EE90' },
        elephant: { body: '#B0E0E6', box: '#87CEEB' }
    };

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            // Uncheck other checkboxes
            checkboxes.forEach(cb => {
                if (cb !== event.target) {
                    cb.checked = false;
                }
            });

            // Show the selected animal image and change colors
            if (event.target.checked) {
                const animal = event.target.value;
                animalImage.innerHTML = `<img src="images/${animal}.jpg" alt="${animal}">`;
                body.style.background = animalColors[animal].body;
                imageBox.style.backgroundColor = animalColors[animal].box;
            } else {
                animalImage.innerHTML = '';
                body.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
                imageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        });
    });

    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                animalImage.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
                // Reset colors for uploaded images
                body.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
                imageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            };
            reader.readAsDataURL(file);
        }
    });
});
