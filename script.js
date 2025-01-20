const phrases = ["Web Developer", "Software Developer", "Web Designer", "Content Creator", "Script Writer"];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
const typingText = document.getElementById('typing-text');
const typingSpeed = 100; // Typing speed in milliseconds
const deletingSpeed = 50; // Deleting speed in milliseconds
const pauseBeforeDeleting = 2000; // Pause before deleting in milliseconds
const pauseBeforeTypingNextPhrase = 500; // Pause before typing the next phrase in milliseconds

function type() {
    if (currentCharIndex < phrases[currentPhraseIndex].length) {
        typingText.textContent += phrases[currentPhraseIndex].charAt(currentCharIndex);
        currentCharIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(() => {
            deleteText();
        }, pauseBeforeDeleting);
    }
}

function deleteText() {
    if (currentCharIndex > 0) {
        typingText.textContent = phrases[currentPhraseIndex].substring(0, currentCharIndex - 1);
        currentCharIndex--;
        setTimeout(deleteText, deletingSpeed);
    } else {
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        currentCharIndex = 0;
        setTimeout(() => {
            type();
        }, pauseBeforeTypingNextPhrase);
    }
}

type();

function hamburg() {
    document.getElementById('dropdownMenu').classList.toggle('hidden');
}

function cancel() {
    document.getElementById('dropdownMenu').classList.add('hidden');
}