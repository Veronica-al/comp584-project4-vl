// Get elements from the page
const fortuneBtn = document.getElementById("fortuneBtn");
const fortuneText = document.getElementById("fortuneText");

// Grab spring from Popmotion
const pop = window.popmotion || {};
const spring = pop.spring || null;

// Function to animate the fortune box in with a spring
function springInFortune() {
  // If Popmotion didn't load
  if (!spring) {
    fortuneText.style.opacity = 1;
    fortuneText.style.transform = "translateY(0)";
    return;
  }

  // Start
  fortuneText.style.opacity = 0;
  fortuneText.style.transform = "translateY(30px)";


  spring({
    from: 30,         
    to: 0,            
    stiffness: 200,  
    damping: 20,    
    mass: 1
  }).start((y) => {
    fortuneText.style.transform = `translateY(${y}px)`;

    const opacity = 1 - Math.min(Math.abs(y) / 30, 1);
    fortuneText.style.opacity = opacity;
  });
}

// call AdviceSlip API
function getFortune() {
  // Show a loading message first
  fortuneText.textContent = "Consulting the cosmos...";

  fetch("https://api.adviceslip.com/advice?" + Date.now())
    .then(response => {
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log("API data:", data);

      const advice = data.slip && data.slip.advice
        ? data.slip.advice
        : "The universe is quiet right now.";

      fortuneText.textContent = `"${advice}"`;

      springInFortune();
    })
    .catch(error => {
      console.error("Error fetching advice:", error);
      fortuneText.textContent =
        "I couldn't read your fortune. Try again in a moment.";
    });
}

// When the button is clicked, get a new fortune
fortuneBtn.addEventListener("click", getFortune);

