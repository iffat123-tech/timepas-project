document.addEventListener("DOMContentLoaded", () => {
  // Find the elements in your HTML.
  const questionScreen = document.getElementById("questionScreen");
  const loveScreen = document.getElementById("loveScreen");
  const buttonStage = document.getElementById("buttonStage");
  const yesButton = document.getElementById("yesButton");
  const noButton = document.getElementById("noButton");
  const teaseMessage = document.getElementById("teaseMessage");
  const replayButton = document.getElementById("replayButton");

  // Stop immediately with a useful error if an element is missing.
  const requiredElements = [
    questionScreen,
    loveScreen,
    buttonStage,
    yesButton,
    noButton,
    teaseMessage,
    replayButton,
  ];

  if (requiredElements.some((element) => !element)) {
    console.error(
      "Alicia website: An HTML element is missing. Check your element IDs.",
    );
    return;
  }

  let attempts = 0;
  let escaped = false;

  const messages = [
    "YOU DARE CHALLENGE DESTINY?",
    "There is no escape from the inevitable.",
    "The universe has already decided.",
    "Interesting. You have chosen rebellion.",
    "You cannot outrun your fate, bestie.",
    "DESTINY IS NOT ACCEPTING YOUR APPEAL.",
    "Your rebellion will be remembered.",
    "The prophecy remains unchanged.",
  ];

  // Display a different dramatic message after each attempt.
  function showMessage() {
    const index = Math.min(attempts - 1, messages.length - 1);

    teaseMessage.textContent = messages[index];

    teaseMessage.classList.remove("show-message");

    // Restart the CSS animation.
    void teaseMessage.offsetWidth;

    teaseMessage.classList.add("show-message");
  }

  // Move NO somewhere else inside its button area.
  function dodgeNoButton() {
    attempts++;
    escaped = true;

    const stageWidth = buttonStage.clientWidth;
    const stageHeight = buttonStage.clientHeight;
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;

    const maxX = Math.max(0, stageWidth - buttonWidth);
    const maxY = Math.max(0, stageHeight - buttonHeight);

    // Use YES's position to avoid placing NO on top of it.
    const yesRect = yesButton.getBoundingClientRect();
    const stageRect = buttonStage.getBoundingClientRect();

    const yesLeft = yesRect.left - stageRect.left;
    const yesTop = yesRect.top - stageRect.top;
    const yesRight = yesLeft + yesRect.width;
    const yesBottom = yesTop + yesRect.height;

    let x = 0;
    let y = 0;
    let foundSafeSpot = false;

    // Try several random positions.
    for (let i = 0; i < 80; i++) {
      const candidateX = Math.random() * maxX;
      const candidateY = Math.random() * maxY;

      const candidateRight = candidateX + buttonWidth;
      const candidateBottom = candidateY + buttonHeight;

      const overlapsYes =
        candidateX < yesRight &&
        candidateRight > yesLeft &&
        candidateY < yesBottom &&
        candidateBottom > yesTop;

      if (!overlapsYes) {
        x = candidateX;
        y = candidateY;
        foundSafeSpot = true;
        break;
      }
    }

    // If the available area is too small, use a fallback position.
    if (!foundSafeSpot) {
      x = maxX;
      y = maxY;
    }

    // Position NO relative to its container.
    noButton.style.position = "absolute";
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
    noButton.style.transform = "none";

    showMessage();
  }

  // Desktop: move away as the pointer approaches.
  noButton.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      dodgeNoButton();
    }
  });

  // Extra fallback: prevent NO from being clicked.
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dodgeNoButton();
  });

  // Touchscreen: dodge when someone attempts to tap NO.
  noButton.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") {
      event.preventDefault();
      dodgeNoButton();
    }
  });

  // Create a floating heart for the celebration.
  function createHeart() {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "♥" : "♡";

    heart.style.setProperty("--left", `${Math.random() * 100}vw`);

    heart.style.setProperty("--size", `${15 + Math.random() * 25}px`);

    heart.style.setProperty("--duration", `${3 + Math.random() * 3}s`);

    document.body.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }

  // Celebrate with a burst of hearts.
  function celebrate() {
    for (let i = 0; i < 35; i++) {
      setTimeout(createHeart, i * 80);
    }
  }

  // YES: reveal the next screen.
  yesButton.addEventListener("click", () => {
    questionScreen.classList.add("hidden");
    loveScreen.classList.remove("hidden");

    celebrate();
  });

  // Replay: restore the original experience.
  replayButton.addEventListener("click", () => {
    attempts = 0;
    escaped = false;

    noButton.style.position = "";
    noButton.style.left = "";
    noButton.style.top = "";
    noButton.style.transform = "";

    teaseMessage.textContent = "Choose wisely. I am watching.";

    teaseMessage.classList.remove("show-message");

    document.querySelectorAll(".floating-heart").forEach((heart) => {
      heart.remove();
    });

    loveScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden");
  });

  console.log("Alicia's website JavaScript loaded successfully.");
});
