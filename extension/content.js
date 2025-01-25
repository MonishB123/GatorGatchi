const cat = document.createElement("img");
try {
    cat.src = chrome.runtime.getURL ? chrome.runtime.getURL("cat.gif") : "cat.gif";
} catch (e) {
    console.error("Error loading cat image:", e);
    cat.src = "cat.gif"; // Fallback
}
cat.style.position = "fixed";
cat.style.bottom = "0px";
cat.style.left = "0px";
cat.style.width = "100px";
cat.style.zIndex = "10000";
document.body.appendChild(cat);

let x = 0;
let direction = 1;

function moveCat() {
  x += direction * 0;
  if (x > window.innerWidth - 100 || x < 0) {
    direction *= -1;
    cat.style.transform = `scaleX(${direction})`;
  }
  cat.style.left = `${x}px`;
  requestAnimationFrame(moveCat);
}

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    moveCat();
  }
});
