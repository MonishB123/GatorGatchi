fetch(chrome.runtime.getURL("layout.css"))
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
    })
    .then(css => {
        // Create a style tag and add the fetched CSS content
        const styleTag = document.createElement("style");
        styleTag.innerHTML = css;
        document.head.appendChild(styleTag);
    })
    .catch(error => console.error("Error loading layout.css:", error));

// Create sidebar container
const sidebar = document.createElement("div");
sidebar.id = "customSidebar";

// Fetch the HTML file (popup.html)
fetch(chrome.runtime.getURL("popup.html"))
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
    })
    .then(data => {
        sidebar.innerHTML = data;

        // Set the image source dynamically
        const gatorImage = sidebar.querySelector(".gator");
        if (gatorImage) {
            gatorImage.src = chrome.runtime.getURL("base_gif.gif"); // Set the gator image source
        }

        const techImage = sidebar.querySelector(".technology");
        if (techImage){
            techImage.src = chrome.runtime.getURL("technology.jpg");
        }

        // Append sidebar after setting image source
        document.body.appendChild(sidebar);
    })
    .catch(error => console.error("Error loading popup.html:", error));

// Apply styles to sidebar
sidebar.style.position = "fixed";
sidebar.style.top = "50px";
sidebar.style.right = "10px";
sidebar.style.width = "270px";
sidebar.style.background = "white";
sidebar.style.border = "1px solid black";
sidebar.style.padding = "10px";
sidebar.style.zIndex = "10000";
sidebar.style.maxHeight = "90vh";  // Ensure it's not too tall
sidebar.style.overflowY = "auto";  // Allow scrolling if content overflows

// Create toggle button
const toggleButton = document.createElement("button");
toggleButton.id = "toggleSidebar";
toggleButton.textContent = "Toggle Sidebar";
toggleButton.style.position = "fixed";
toggleButton.style.top = "10px";
toggleButton.style.right = "10px";
toggleButton.style.zIndex = "10001"; // Ensure it's clickable

// Append elements to body
document.body.appendChild(toggleButton);

// Toggle sidebar visibility
toggleButton.addEventListener("click", () => {
    sidebar.style.display = sidebar.style.display === "none" ? "block" : "none";
});

// Fetch data from the API and update articleImage and articleTitle
fetch('http://127.0.0.1:5000/select_link') // Replace with your Flask API URL
    .then(response => response.json())
    .then(data => {
        const link = data.link;
        const title = data.title;

        // Find the articleImage and articleTitle elements
        const articleImage = document.querySelector('.articleimage');
        const articleTitle = document.querySelector('.articleTitle');

        // Update the article image to be clickable and set the link
        // Update the article image to be clickable and set the link
        if (articleImage) {
            articleImage.href = link
        }

        // Set the article title
        if (articleTitle) {
            articleTitle.textContent = title;
        }

    })
    .catch(error => console.error("Error fetching data from API:", error));