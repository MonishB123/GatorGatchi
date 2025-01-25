import { googleSignIn } from "../firebase/firebase-config.js";

document.getElementById("signInBtn").addEventListener("click", async () => {
  const user = await googleSignIn();
  if (user) {
    alert(`Welcome, ${user.displayName}!`);
  }
});
