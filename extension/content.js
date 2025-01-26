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

fetch('http://127.0.0.1:5000/select_link') // Fetch link first
    .then(response => response.json())
    .then(data => {
        const link = data.link;
        const title = data.title;
        let thelink = link;  // Assign link here
        console.log("Fetched link:", thelink);

        // Update the article image and title
        const articleImage = document.querySelector('.articleimage');
        const articleTitle = document.querySelector('.articleTitle');

        if (articleImage) {
            articleImage.href = thelink; // Ensure it's clickable
        }
        if (articleTitle) {
            articleTitle.textContent = title;
            articleTitle.fontSize = "20px"
        }

        // Now that the link is available, call qmaker
        return fetch("http://127.0.0.1:5000/qmaker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: thelink }) // Use the correct link
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log("QMaker Response:", data);

        if (data.error) {
            document.querySelector('.quizQuestion').textContent = "Error generating quiz.";
            return;
        }

        // Get the elements for question and answers
        const quizQuestion = document.querySelector('.quizQuestion');
        const quizContainer = document.querySelector('.quizContainer');

        // Set the question text
        quizQuestion.textContent = data.question;
        quizQuestion.style.fontSize = "15px";

        // Clear previous answers (if any)
        const quizAnswersDiv = document.querySelector('.quizAnswers');
        quizAnswersDiv.innerHTML = ""; // Clear existing buttons

        // Create answer buttons
        data.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.answer;
            button.style.fontSize = "10px";
            button.style.margin = "5px"; // Add spacing between buttons
            button.classList.add('quizAnswerButton'); // Add a class for styling

            // Handle correct/incorrect answer selection
            button.onclick = () => {
                if (answer.correct) {
                    alert("Correct!");
                    
                    // Change the gator image source when the answer is correct
                    const gatorImage = sidebar.querySelector(".gator");
                    if (gatorImage) {
                        gatorImage.src = chrome.runtime.getURL("new_gator_image.gif"); // Change to the new gator image
                    }
                } else {
                    alert("Wrong answer! Try again.");
                }
            };
            

            quizAnswersDiv.appendChild(button); // Add button to quizAnswers div
        });

        // **Dynamically adjust quizContainer size**
        quizContainer.style.display = "flex";
        quizContainer.style.flexDirection = "column";
        quizContainer.style.alignItems = "center"; // Center content
        quizContainer.style.padding = "10px";// Light background
        quizContainer.style.borderRadius = "8px"; // Rounded corners
        quizContainer.style.width = "auto"; // Fit content
        quizContainer.style.maxWidth = "400px"; // Limit max width
        quizContainer.style.margin = "10px auto"; // Center the quiz
    })
    .catch(error => console.error("Error:", error));


