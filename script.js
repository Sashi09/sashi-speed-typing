const activeQuoteArray = {
    easy: ["The sun is bright.", "Cats like milk.", "The sky is blue.", "I like to code.", "Birds can fly.", "Dogs bark loud.", "Apples are red.", "The moon is up.", "Fish can swim.", "The car is red.", "I love music.", "The ball is big.", "Sit on a chair.", "Open the door.", "Run very fast.", "Water is cold.", "Ice is frozen.", "Trees are tall.", "The door is shut.", "Milk is white.", "Stars are far.", "Read a book.", "Walk the dog.", "Write your name.", "The fire is hot.", "The snow is cold.", "A small bird.", "Look at me.", "Help your mom.", "Eat an apple.", "Drink juice.", "Wear a hat.", "Play a game.", "Sing a song.", "A happy boy.", "The bus is here.", "Green grass.", "The big sea.", "Wash hands.", "Jump high.", "A gold ring.", "A fast boat.", "Sweet candy.", "Soft pillow.", "A new desk.", "My old shirt.", "Bright stars.", "Cold rain.", "Warm wind.", "The end now."],
    medium: ["Practice makes a man perfect.", "A journey of miles begins here.", "Better late than never to start.", "Consistency is the key to life.", "The early bird catches the worm.", "Knowledge is power for everyone.", "Honesty is the best policy now.", "Every cloud has a silver lining.", "Actions speak louder than words.", "Time and tide wait for no man.", "Don't judge a book by its cover.", "Hard work pays off in the end.", "Stay hungry and stay foolish.", "Innovation defines a true leader.", "Life is what happens to you.", "The purpose of life is happiness.", "Never fear the failure of work.", "Money does not change people.", "Your time is limited on earth.", "Turn wounds into wisdom today.", "Keep calm and carry on coding.", "Everything you imagine is real.", "Be the change you want to see.", "Quality is a habit not an act.", "The best revenge is success.", "Believe you can and you will.", "It seems impossible until done.", "The mind is everything today.", "Success is a ladder to climb.", "Coding is a very valuable skill.", "The world is full of wonders.", "Learning is a lifelong process.", "Success comes to those who wait.", "Make every single day count.", "A friend in need is a friend.", "Health is the greatest wealth.", "Think before you speak aloud.", "Patience is a virtue for all.", "Life is a beautiful journey.", "The sun rises in the east.", "Unity is strength in society.", "Hard work is the key to luck.", "Education is the best weapon.", "Respect is earned not given.", "Kindness costs nothing at all.", "A small step leads to a goal.", "Truth always triumphs in life.", "Nature is the best teacher.", "Keep your head held high.", "The sky is the limit for us."],
    hard: ["Linguistic complexity requires processing.", "Quantum mechanics describes particles.", "Microservices architecture decouples.", "Asynchronous programming uses callbacks.", "Recursive functions need a base case.", "Cryptographic protocols ensure privacy.", "Machine learning requires datasets.", "Artificial intelligence transforms.", "Distributed systems handle networks.", "Blockchain provides a secure ledger.", "Cybersecurity threats are evolving.", "Cloud computing enables scalability.", "Software lifecycles involve testing.", "Object oriented programming reuse.", "Functional programming avoids state.", "Database normalization reduces data.", "Neural networks simulate the brain.", "Parallel computing executes tasks.", "The uncertainty principle is key.", "Relational databases use logic.", "User experience design focuses on.", "Agile methodologies prioritize.", "Containerization simplifies deploy.", "The internet of things connects.", "Big data analytics extracts value.", "Natural language processing grows.", "Computer vision interprets data.", "Reinforcement learning optimizes.", "The Turing test measures levels.", "Encryption protects information.", "Version control manages changes.", "Continuous integration automates.", "Restful APIs enable systems.", "Frontend frameworks enhance UI.", "Backend systems manage servers.", "Fullstack developers possess skills.", "DevOps practices bridge gaps.", "Unit testing verifies code units.", "Integration testing ensures work.", "Performance optimization improves.", "Refactoring enhances maintainability.", "Design patterns provide solutions.", "Technical debt accumulates fast.", "Open source software fosters help.", "Logic gates are building blocks.", "Memory management is crucial.", "Operating systems manage hardware.", "Network protocols define rules.", "Software architecture is complex.", "Encryption algorithms are vital."]
};

let timeRemaining, isTestActive = false, timerRef;
let topScore = localStorage.getItem('user_top_wpm') || 0;
document.getElementById('best-wpm').innerText = topScore;

const displayElement = document.getElementById('display-area');
const inputElement = document.getElementById('typing-box');
const diffSelect = document.getElementById('diff-config');

function loadNewSentence() {
    const pool = activeQuoteArray[diffSelect.value];
    const randomText = pool[Math.floor(Math.random() * pool.length)];
    displayElement.innerHTML = '';
    randomText.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        displayElement.appendChild(span);
    });
    inputElement.value = '';
}

diffSelect.addEventListener('change', () => { if(!isTestActive) loadNewSentence(); });

inputElement.addEventListener('input', () => {
    if(!isTestActive) {
        isTestActive = true;
        diffSelect.disabled = true;
        let total = parseInt(document.getElementById('time-config').value);
        timeRemaining = total;
        timerRef = setInterval(() => {
            timeRemaining--;
            document.getElementById('live-timer').innerText = timeRemaining + 's';
            document.getElementById('progress-bar-fill').style.width = ((total - timeRemaining) / total) * 100 + '%';
            if(timeRemaining <= 0) endTestSession();
        }, 1000);
    }
    validate();
});

function validate() {
    const spans = displayElement.querySelectorAll('span');
    const entry = inputElement.value.split('');
    let correct = 0;
    spans.forEach((s, i) => {
        if(entry[i] == null) s.className = '';
        else if(entry[i] === s.innerText) { s.className = 'success'; correct++; }
        else s.className = 'fail';
    });
    let elapsed = (parseInt(document.getElementById('time-config').value) - timeRemaining) / 60;
    let wpm = Math.round((entry.length / 5) / (elapsed || 0.01));
    document.getElementById('live-wpm').innerText = wpm;
    document.getElementById('live-acc').innerText = entry.length > 0 ? Math.round((correct / entry.length) * 100) + '%' : '100%';
    if(entry.length >= spans.length) loadNewSentence();
}

function endTestSession() {
    clearInterval(timerRef);
    inputElement.disabled = true;
    const wpm = document.getElementById('live-wpm').innerText;
    if(parseInt(wpm) > topScore) localStorage.setItem('user_top_wpm', wpm);
    
    document.getElementById('cert-sidebar').style.display = 'block';
    document.getElementById('cert-wpm').innerText = wpm;
    document.getElementById('cert-acc').innerText = document.getElementById('live-acc').innerText;
    document.getElementById('cert-diff').innerText = diffSelect.value.toUpperCase();
    document.getElementById('cert-time').innerText = new Date().toLocaleString();
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const opt = {
        margin: 1,
        filename: 'Typing_Performance.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#161b22' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

loadNewSentence();
