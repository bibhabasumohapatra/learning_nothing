document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[name="animal"]');
    const animalImage = document.getElementById('animalImage');
    const imageComment = document.getElementById('imageComment');
    const fileUpload = document.getElementById('fileUpload');
    const body = document.body;
    const imageBox = document.querySelector('.box:nth-child(2)');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async (event) => {
            // Uncheck other checkboxes
            checkboxes.forEach(cb => {
                if (cb !== event.target) {
                    cb.checked = false;
                }
            });

            // Show the selected animal image and change colors
            if (event.target.checked) {
                const animal = event.target.value;
                try {
                    const response = await fetch(`/api/animal/${animal}`);
                    if (response.ok) {
                        const data = await response.json();
                        animalImage.innerHTML = `<img src="${data.image}" alt="${animal}">`;
                        body.style.background = data.colors.body;
                        imageBox.style.backgroundColor = data.colors.box;
                        imageComment.textContent = `This is a ${animal.charAt(0).toUpperCase() + animal.slice(1)}`;
                    } else {
                        console.error('Failed to fetch animal data');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                animalImage.innerHTML = '';
                imageComment.textContent = '';
                body.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
                imageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        });
    });

    fileUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    animalImage.innerHTML = `<img src="${data.image}" alt="Uploaded image">`;
                    imageComment.textContent = `File: ${data.filename}, Size: ${data.size}, Type: ${data.type}`;
                    // Reset colors for uploaded images
                    body.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
                    imageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                } else {
                    console.error('Failed to upload image');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});
