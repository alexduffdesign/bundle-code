document.addEventListener("DOMContentLoaded", function () {
    // Your original initializeSea function
    function initializeSea() {
      const canvasElement = document.getElementById("sea");
  
      const layout = new rive.Layout({
        fit: rive.Fit.Cover
      });
  
      window.sea = new rive.Rive({
        src:
          "https://cdn.shopify.com/s/files/1/0258/6617/4561/files/treasure-prize.riv?v=1697383123",
        canvas: canvasElement,
        stateMachines: "Machine",
        layout: layout,
        autoplay: true,
        onLoad: () => {
          sea.resizeDrawingSurfaceToCanvas();
          const inputs = sea.stateMachineInputs("Machine");
          const input = inputs.find((i) => i.name === "Clicked");
          console.log("input", input);
        },
        onStateChange: async (event) => {
          console.log("State changed:", event.data);
          const eventString = event.data.join(" ");
          if (eventString.includes("Clicked")) {
            console.log("Triggering card animation");
            setTimeout(animateCards, 1600);
          }
        }
      });
  
      async function animateCards() {
        console.log("Animating cards"); // log at start of animateCards function
        const cardTimeline = [
          [
            "[data-card]",
            {
              y: ["8rem", "-2rem"],
              opacity: [0, 1],
              rotateY: [0, 1440],
              scaleY: [0.4, 0.9],
              scaleX: [0.4, 0.9]
            },
            {
              duration: 0.8,
              easing: Motion.spring({ stiffness: 100, damping: 10 })
            }
          ],
          [
            "[data-card]",
            {
              scaleY: [0.9, 0.8],
              scaleX: [0.9, 0.8]
            },
            { duration: 0.1 }
          ],
          [
            "[data-card-wrap]",
            {
              opacity: [1, 0, 1],
              backgroundColor: ["#FFFFFF", "#01373c"]
            },
            { duration: 0.15, at: "<" }
          ],
          [
            "[data-card]",
            {
              scaleY: [0.8, 1.2],
              scaleX: [0.8, 1.2],
              y: ["-2rem", "0rem"]
            },
            { duration: 0.3, at: "<" }
          ],
          [
            ".bundle_popup-scene",
            {
              opacity: [1, 0.4]
            },
            { duration: 0.15, at: "<" }
          ],
          [
            "[data-card-inner]",
            {
              filter: ["blur(5px)", "blur(0px)"],
              opacity: [0.65, 1]
            },
            { duration: 0.4 }
          ],
          [
            "[data-sea-wrap]",
            {
              pointerEvents: "auto"
            },
            { duration: 0.1, at: "<" }
          ],
          [
            "[sea-button-wrap]",
            {
              opacity: [0, 1]
            },
            { duration: 0.2 }
          ]
        ];
  
        const cardAnimation = Motion.timeline(cardTimeline, {
          defaultOptions: { ease: "ease-in-out" }
        });
  
        await cardAnimation.finished;
        console.log("Card animation finished"); // log after card animation finishes
  
        if (window.innerWidth > 990) {
          const cards = document.querySelectorAll(".bundle_treasure-popup-card");
          const holoGradient = document.querySelector(".holo-gradient");
          const target = document.querySelector(".bundle_treasure-popup");
  
          target.addEventListener("mousemove", function (event) {
            const rect = target.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
  
            const rotateY = 24 * x - 12;
            const rotateX = 12 - 24 * y;
  
            cards.forEach(function (card) {
              card.style.transform = `scale(1.2) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
  
            const moveHoloGradient = 200 * x - 100;
            holoGradient.style.transform = `translateX(${moveHoloGradient}%)`;
          });
        }
      }
    }
  
    // Your original sky code
    function initializeSky() {
      const canvasElement = document.getElementById("sky");
      const layout = new rive.Layout({
        fit: rive.Fit.Cover
      });
  
      window.sky = new rive.Rive({
        src:
          "https://cdn.shopify.com/s/files/1/0258/6617/4561/files/sky.riv?v=1696281316",
        canvas: canvasElement,
        stateMachines: "Machine",
        layout: layout,
        autoplay: true,
        onLoad: () => {
          sky.resizeDrawingSurfaceToCanvas();
          const inputs = sky.stateMachineInputs("Machine");
          console.log(inputs);
  
          // After 3.03 seconds (which is 3030 milliseconds), trigger the scratch card animation.
          setTimeout(() => {
            animateScratchCard();
          }, 3030);
        }
      });
  
      function animateScratchCard() {
        Motion.animate(
          "[scratch-card]",
          {
            opacity: [0, 1],
            y: ["3rem", "0rem"],
            pointerEvents: ["none", "auto"]
          },
          { duration: 0.4, ease: "ease-in-out" }
        );
      }
  
      const canvas = document.getElementById("scratch-card");
      const scratchCardDiv = document.querySelector(".scratch_card");
      canvas.width = scratchCardDiv.clientWidth;
      canvas.height = scratchCardDiv.clientHeight;
      const context = canvas.getContext("2d");
  
      // Draw the scratchable image
      const image = new Image();
  
      image.src =
        "https://uploads-ssl.webflow.com/623eeed217c4f432cc8ebfeb/6480dec6b9b62ef126824e92_scratch-card-texture.jpg"; // Set this to your scratchable image URL
  
      image.onload = function () {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      // Set up event listeners
      let mousedown = false;
  
      canvas.addEventListener("mousedown", function (e) {
        mousedown = true;
        context.globalCompositeOperation = "destination-out";
        console.log("mousedown");
      });
  
      canvas.addEventListener("mousemove", function (e) {
        if (mousedown) {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          context.beginPath();
          context.arc(x, y, 50, 0, Math.PI * 2);
          context.fill();
          console.log("scratch", x, y);
        }
      });
  
      canvas.addEventListener("mouseup", function () {
        mousedown = false;
        console.log("mouseup");
      });
  
      canvas.addEventListener("touchstart", function (e) {
        mousedown = true;
        context.globalCompositeOperation = "destination-out";
        console.log("touchstart");
      });
  
      canvas.addEventListener("touchmove", function (e) {
        if (mousedown) {
          const rect = canvas.getBoundingClientRect();
          const x = e.touches[0].clientX - rect.left;
          const y = e.touches[0].clientY - rect.top;
          context.beginPath();
          context.arc(x, y, 50, 0, Math.PI * 2);
          context.fill();
          console.log("scratch", x, y);
        }
      });
  
      canvas.addEventListener("touchend", function () {
        mousedown = false;
        console.log("touchend");
      });
  
      function isCleared() {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let counter = 0;
        for (let i = 3, n = imageData.data.length; i < n; i += 4) {
          if (imageData.data[i] === 0) counter++;
        }
        return counter / (imageData.data.length / 4) > 0.95; // Here 95% of pixels are transparent
      }
  
      canvas.addEventListener("mouseup", function () {
        mousedown = false;
        if (isCleared()) {
          // If the card is cleared, display your button here.
          document.querySelector(".add-to-bundle_wrap").style.display = "block";
        }
      });
  
      canvas.addEventListener("touchend", function () {
        mousedown = false;
        if (isCleared()) {
          // If the card is cleared, display your button here.
          document.querySelector(".add-to-bundle_wrap").style.display = "block";
        }
      });
  
      // Hiding the indicator
  
      canvas.addEventListener("mousedown", function () {
        document.querySelector(".scratch-indicator").style.display = "none";
      });
  
      canvas.addEventListener("touchstart", function () {
        document.querySelector(".scratch-indicator").style.display = "none";
      });
    }
  
    // Your original meadow code
    function initializeMeadow() {
      const canvasElement = document.getElementById("meadow");
  
      const layout = new rive.Layout({
        fit: rive.Fit.Cover
      });
  
      window.meadow = new rive.Rive({
        src:
          "https://cdn.shopify.com/s/files/1/0258/6617/4561/files/medow.riv?v=1696546704",
        canvas: canvasElement,
        stateMachines: "Machine",
        layout: layout,
        autoplay: true,
        onLoad: () => {
          meadow.resizeDrawingSurfaceToCanvas();
          const inputs = meadow.stateMachineInputs("Machine");
          const input = inputs.find((i) => i.name === "Click");
        },
        onStateChange: (event) => {
          if (event.data.includes("Click")) {
            // Replace "animationDuration" with the exact duration of your animation in seconds
            let animationDuration = 2; // for example, if the animation lasts 3 seconds
            setTimeout(() => {
              // Motion One
              const sequenceTwo = [
                [
                  "[cards-wrap]",
                  {
                    pointerEvents: ["none", "auto"]
                  },
                  { duration: 0.1 }
                ],
                [
                  "[popup-bg]",
                  {
                    opacity: [0, 1]
                  },
                  { duration: 0.4, at: "<" }
                ],
                [
                  "[cards-wrap]",
                  {
                    opacity: [0, 1]
                  },
                  { duration: 0.3 }
                ],
                [
                  ".cards-popup_card.is--1",
                  {
                    rotate: ["-7deg", "0deg"]
                  },
                  { duration: 0.4, at: "<" }
                ],
                [
                  ".cards-popup_card.is--2",
                  {
                    rotate: ["14deg", "0deg"]
                  },
                  { duration: 0.4, at: "<" }
                ],
                [
                  ".cards-popup_cards",
                  {
                    scale: ["0.2", "1"],
                    y: ["16em", "0em"]
                  },
                  { duration: 0.4, at: "<" }
                ],
                [
                  "[opacity-fade]",
                  {
                    opacity: [0, 1]
                  },
                  { duration: 0.4, delay: 0.5 }
                ]
              ];
  
              const animation = Motion.timeline(sequenceTwo, {
                defaultOptions: { ease: "ease-in-out" }
              });
            }, animationDuration * 1000);
          }
        }
      });
  
      // Animating the cards on click
  
      const treasureCards = document.querySelectorAll("[treasure-card]");
      let flippedCardsCount = 0;
  
      const cardClickListener = async function (event) {
        // Remove the event listener so the card can't be clicked again
        event.currentTarget.removeEventListener("click", cardClickListener);
  
        const card = event.currentTarget;
  
        // Initial rotate to 90deg
        await Motion.animate(card, { rotateY: "90deg" }, { duration: 0.8 })
          .finished;
  
        // At 90deg:
  
        // Hide the background image of the associated .cards-popup_card-icon
        const icon = card.querySelector(".cards-popup_card-icon");
        if (icon) {
          icon.style.backgroundImage = "none";
        }
  
        // Show the [treasure-card-prod] element
        const prodElement = card.querySelector("[treasure-card-prod]");
        if (prodElement) {
          prodElement.style.opacity = "1";
          prodElement.style.pointerEvents = "auto";
        }
  
        // Rotate back to 0deg
        await Motion.animate(card, { rotateY: "0deg" }, { duration: 0.2 })
          .finished;
  
        // Increase the count of flipped cards
        flippedCardsCount++;
        console.log(flippedCardsCount);
        console.log(treasureCards.length);
  
        // Check if all cards have been flipped
        if (flippedCardsCount === treasureCards.length) {
          const bundleWrap = document.querySelector("[meadow-atb]");
          console.log(bundleWrap);
          bundleWrap.classList.add("is--active");
        }
      };
  
      // Attach the event listener to each card
      treasureCards.forEach((card) => {
        card.addEventListener("click", cardClickListener);
      });
    }
  
    const seaEl = document.querySelector("[sea-el]");
    const skyEl = document.querySelector("[sky-el]");
    const meadowEl = document.querySelector("[meadow-el]");
  
    // Create a MutationObserver instance to listen for changes to the classList
    const observePrize = new MutationObserver(function (mutationsList) {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // For the sea animation
          if (
            seaEl.classList.contains("is--active") &&
            window.getComputedStyle(document.getElementById("sea")).display !==
              "none"
          ) {
            initializeSea();
          } else if (window.sea && typeof window.sea.cleanup === "function") {
            window.sea.cleanup(); // Cleanup for sea directly within the observer
          }
  
          // For the sky animation
          if (
            skyEl.classList.contains("is--active") &&
            window.getComputedStyle(document.getElementById("sky")).display !==
              "none"
          ) {
            initializeSky();
          } else if (window.sky && typeof window.sky.cleanup === "function") {
            window.sky.cleanup(); // Cleanup for sky directly within the observer
          }
  
          // For the meadow animation
          if (
            meadowEl.classList.contains("is--active") &&
            window.getComputedStyle(document.getElementById("meadow")).display !==
              "none"
          ) {
            initializeMeadow();
          } else if (
            window.meadow &&
            typeof window.meadow.cleanup === "function"
          ) {
            window.meadow.cleanup(); // Cleanup for meadow directly within the observer
          }
        }
      }
    });
  
    // Start observing the elements for changes in their classList
    observePrize.observe(seaEl, { attributes: true, attributeFilter: ["class"] });
    observePrize.observe(skyEl, { attributes: true, attributeFilter: ["class"] });
    observePrize.observe(meadowEl, {
      attributes: true,
      attributeFilter: ["class"]
    });
  });
  