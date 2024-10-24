
const apiKey = "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"; 

const maxImages = 6;

let selectedImageNumber = null;

const clearButton = document.getElementById('clearButton');

// Function to generate a random number between min and max (inclusive)

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Function to disable the generate button during processing
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}


// Function to enable the generate button after process
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}


// Function to clear image grid
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}


// Function to generate images using  API
async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.classList.remove("d-none");    //  loading message

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`; 

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`, 
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("Failed to generate image!");
            continue;
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `image-${i + 1}`;
        img.classList.add("col-md-6", "mb-3"); 

        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.classList.add("d-none"); 
    enableGenerateButton();
    selectedImageNumber = null; // Reset selected image number
}

// Event listener for the generate button

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    if (input.trim() !== "") {
        generateImages(input);
    } else {
        alert("Please enter a prompt!");
    }
});

// function for delete button
clearButton.addEventListener('click', function() {
document.getElementById("user-prompt").value = ''; // Clear the textarea
    
});


// Function to download image

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`; 
    link.click();
}
