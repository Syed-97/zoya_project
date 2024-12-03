// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAisj4Mi4HroBOjSLxqWShecHQqvf1Eq_4",
    authDomain: "opportune-bd6d3.firebaseapp.com",
    projectId: "opportune-bd6d3",
    storageBucket: "opportune-bd6d3.firebasestorage.app",
    messagingSenderId: "164495994504",
    appId: "1:164495994504:web:4513d2dc91cc494c73793d",
    measurementId: "G-STRW9PYFPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
async function handleSignIn() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        return user; // Return the signed-in user
    } catch (error) {
        console.error("Sign-In Error:", error.message);
        alert("Failed to sign in. Please try again.");
    }
}

// Function to Save User Data in Firestore
async function saveUserData(user, careerInterest, skills = null, hobbies = null) {
    try {
        const userDoc = doc(db, "users", user.uid);
        const data = {
            name: user.displayName,
            email: user.email,
            careerInterest: careerInterest,
        };
        if (skills && hobbies) {
            data.skills = skills;
            data.hobbies = hobbies;
        }
        await setDoc(userDoc, data);
        alert("Your data has been saved successfully!");
    } catch (error) {
        console.error("Error saving user data:", error.message);
        alert("Failed to save data. Please try again.");
    }
}

// DOM Elements
const dontKnowButton = document.getElementById('dont-know');
const submitInterestButton = document.getElementById('submit-interest');
const signInButton = document.getElementById('sign-in');
const dialogBox = document.getElementById('dialog-box');

// Event Listener: Handle "I Don't Know" Button Click
dontKnowButton.addEventListener('click', async () => {
    const user = auth.currentUser || await handleSignIn(); // Ensure user is signed in
    if (!user) return;

    // Update the dialog box for additional fields
    dialogBox.innerHTML = `
        <h2>Tell us more about yourself!</h2>
        <input type="text" id="skills-input" placeholder="Enter your current skills" />
        <input type="text" id="hobbies-input" placeholder="Enter your interests or hobbies" />
        <button id="submit-details">Submit</button>
    `;

    const submitDetailsButton = document.getElementById('submit-details');
    submitDetailsButton.addEventListener('click', async () => {
        const skills = document.getElementById('skills-input').value;
        const hobbies = document.getElementById('hobbies-input').value;
        if (skills && hobbies) {
            await saveUserData(user, "I Don't Know", skills, hobbies);
        } else {
            alert('Please fill out both fields before submitting!');
        }
    });
});

// Event Listener: Handle "Submit Interest" Button Click
submitInterestButton.addEventListener('click', async () => {
    const user = auth.currentUser || await handleSignIn(); // Ensure user is signed in
    if (!user) return;

    const careerInterest = document.getElementById('career-input').value;
    if (careerInterest) {
        await saveUserData(user, careerInterest);
    } else {
        alert('Please enter a career interest before submitting!');
    }
});

// Event Listener: Handle "Sign In" Button Click
signInButton.addEventListener('click', async () => {
    await handleSignIn();
});
