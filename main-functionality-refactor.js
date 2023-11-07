// DEFAULTS

document.addEventListener("DOMContentLoaded", function () {
    // START BUNDLE
    const openingSlide = document.querySelector(".opening-slide");
    const startButton = document.querySelector("[start-bundle]");
    const startPara = document.querySelector("[start-para]");
    const startLogo = document.querySelector("[start-logo]");
    const bunny = document.querySelector(".bunny");
    const owlRive = document.querySelector(".owl-wrap");
    const glowingScroll = document.querySelector(".glowing-scroll");
    const scroll = document.querySelector("[intro]");
    const scrollMiddle = document.querySelector(".bundle_intro-map");
    const scrollCovering = document.querySelector(".bundle_map-covering");
    const fastEase = "cubic-bezier(.9, 0, .1, 1)";
    const body = document.querySelector("body");
    const nextStepEl = document.querySelector(".bundle_next-step");
  
    const products = document.querySelector("[products-area]");
    const cmsItems = document.querySelectorAll("[data-left][data-bottom]");
    const popupBg = document.querySelector(".bundle_popup-bg");
    const map = document.querySelector("[map]");
    const mapImg = document.querySelector("[map-img]");
    const mapText = document.querySelector("[map-text]");
    const indicatorMap = document.querySelector("[indicator-map]");
  
    const bundleCart = document.querySelector("[bundle-cart]");
    const bundleCartIndicator = document.querySelector("[bundle-cart-indicator]");
    const bundleMapItem = document.querySelectorAll(".bundle_map-spot-item");
    const bundleOverflow = document.querySelector(".bundle_overflow");
    const bundleGuide = document.querySelector("[bundle-guide]");
    const changeBundleProductBtn = document.querySelectorAll("[change-btn]");
    const removeBundleProductBtn = document.querySelectorAll("[remove-product]");
    const bundleProductImg = document.querySelector(".bundle_steps_product-img").src;
    const popupCheckoutWrap = document.querySelector("[popup-checkout]");
    const checkoutBtn = document.querySelectorAll("[checkout]");

  
  
    function isMobile() {
      return tablet.matches || mobileLandscape.matches || mobile.matches;
    }
  
    const bundleStepsItems = document.querySelectorAll(
      "[bundle-step-wrap] [bundle-step]"
    );
    const mapStepsItems = document.querySelectorAll("[map] [bundle-step]");
  
    function initializeSteps(stepItems) {
      stepItems.forEach((wrap, index) => {
        const bundleItem = wrap.querySelector("[bundle-item]");
        if (bundleItem) {
          bundleItem.classList.remove("is--active");
        }
  
        wrap.querySelector("[step-image]").classList.remove("is--active");
  
        // If it's the first element, add the is--active class
        if (index === 0) {
          if (bundleItem) {
            bundleItem.classList.add("is--active");
          }
          wrap.querySelector("[step-image]").classList.add("is--active");
        }
      });
    }
  
    // Initialize the bundle steps and map steps separately:
    initializeSteps(bundleStepsItems);
    initializeSteps(mapStepsItems);
  
    // STARTING ANIMATION
    if (startButton) {
      startButton.addEventListener("click", async function () {
        const animationSequence = [
          // First Stage
          [
            startPara,
            { transform: "translateY(3em)", opacity: 0 },
            { duration: 0.84 }
          ],
          [
            startButton,
            { transform: "translateY(3em)", opacity: 0 },
            { at: "<", duration: 0.84 }
          ],
          [
            startLogo,
            { transform: "translateY(3em)", opacity: 0 },
            { at: 0.1, duration: 0.84 }
          ],
          // [dragon, { opacity: 0 }, { at: "<", duration: 0.84 }],
          // [bunny, { opacity: 0 }, { at: "<", duration: 0.84 }],
  
          // Second Stage
          [
            owlRive,
            { transform: "translateY(25.5em)" },
            { duration: 0.64, at: 0.6 }
          ],
          [glowingScroll, { opacity: 0 }, { duration: 0.3 }],
          [
            scroll,
            { opacity: 1, pointerEvents: "auto" },
            { duration: 0.3, at: "<" }
          ],
          [
            owlRive,
            { transform: "translateY(-30em)" },
            { delay: 0.1, duration: 0.64 }
          ],
          [
            scroll,
            { transform: "translateY(0em) rotate(0) scale(1)" },
            { duration: 0.56, at: "<", delay: 0.2, easing: fastEase }
          ],
          [scrollMiddle, { width: "100%" }, { duration: 0.64, easing: fastEase }],
          [scrollCovering, { opacity: 0 }, { duration: 0.35 }]
        ];
  
        const animation = Motion.timeline(animationSequence, {
          defaultOptions: { easing: "ease-in-out" }
        });
  
        owlRive.classList.remove("is--active");
      });
    }
  
    // INTRO CODE
    let clickCount = 0;
    const introButton = document.querySelector("[intro-btn]");
  
  
    if (introButton) {
      introButton.addEventListener("click", function () {
        clickCount++;
  
        if (clickCount === 1) {
          introButton.textContent = "Start";
          const introList = document.querySelector(".bundle_intro-list");
          if (introList) {
            introList.style.justifyContent = "flex-end";
          }
        } else if (clickCount === 2) {
          const closeScroll = [
            [scrollCovering, { opacity: 1 }, { duration: 0.35 }],
            [scrollMiddle, { width: "8%" }, { duration: 1, easing: fastEase }],
            [
              scroll,
              {
                pointerEvents: "none",
                transform: "translate(0em) rotate(260) scale(0.4)"
              },
              { duration: 1, at: "<" }
            ],
            [
              openingSlide,
              { opacity: 0, pointerEvents: "none" },
              { duration: 0.5, at: "0.8", easing: fastEase }
            ],
            [
              products,
              { display: "flex" },
              { duration: 0.01, at: "<", easing: fastEase }
            ],
            [
              products,
              { opacity: 1 },
              { duration: 0.5, at: "<", easing: fastEase }
            ]
          ];
          const closeScrollAnim = Motion.timeline(closeScroll);
        }
      });
    }
  
  
  
    ///////////////////////////////////// Bundle Functionality (add to bundle) ///////////////////////////////////////
  

    //// State Machine

    const state = {
      currentStep: 0,
      bundle: [],
      editingStep: null,   
      prizeSteps: [2, 4, 6],
    };

    const stepsTracker = {
      milestones: {
        firstProduct: false,
        secondProduct: false,
        firstPrize: false,
        thirdProduct: false,
        secondPrize: false,
        fourthProduct: false,
        thirdPrize: false
      }
    };


    //// Initial States

    function initialSetup() {
      const initialStepElement = getCurrentStepData(0);
      if (initialStepElement) {
        updatePopup(initialStepElement);  // Debug log
        updateProductArea(initialStepElement);
        updateMobileBundleStepInfo(initialStepElement);
      }
    }

    initialSetup();


    //// Actions

    function addProductToBundle(productBlocks) {
      
      // Adds ID of each product to the bundle array in state
      state.bundle = processProductBlocks(productBlocks, state.currentStep, state.editingStep);

      console.log("product Id's", state.bundle);

      // Call the function to handle all UI updates
      updateUIAfterProductAdded(productBlocks);

      // Claim prize if applicable
      if (state.prizeSteps.includes(state.currentStep)) {
        claimPrize(state.currentStep);
        console.log(state.claimedPrizes);
      }

      markMilestonesAsComplete(state.currentStep);
      console.log("Milestones after removing", stepsTracker.milestones);


    }

    function moveToNextStepClick() {
      console.log("Next Step Button Clicked: Initial editingStep =", state.editingStep, "currentStep =", state.currentStep);
    
      // Clear any editing state
      state.editingStep = null;
      
      // Only move to the next step if the current step's product has been added
      if (isProductAddedForStep(state.currentStep)) {
        if (state.currentStep === state.discountStep) {
          state.discountClaimed = true;
        }
        state.currentStep++;
        console.log("Next Step Button Clicked: After Increment currentStep =", state.currentStep);
      }
    
      // Handle any popup-related actions
      handlePopupBtnClick();
    
      // If the step involves a prize, activate the prize UI
      if (isPrizeStep(state.currentStep)) {
        activatePrizes(state.currentStep);
      }
    
      // Perform UI updates after state changes
      updateUIAfterMoveToNextStep();
    
      console.log("Next Step Button Clicked: After Reset editingStep =", state.editingStep);
    }

    function dontMoveToNextStep() {
      closeNextStepPopup();
      bundleGuide.classList.add("is--active");
    }
      
    function editMode(stepValue) {
      // Close popup if it's open
      closeNextStepPopup();
    
      // Set editingStep to the chosen step
      state.editingStep = stepValue;

      // Update the UI to reflect the editing mode state
      updateUIForEditMode(state.editingStep);
    }

    function removeProduct(stepToRemove, bundleProduct) { 

      state.editingStep = null;

       // Deactivate any active prize 🏆 elements and show the products if necessary
       if (isPrizeStep(state.currentStep)) {
        deactivatePrizeElements();
        products.classList.add("is--active");
      }

      // Logic to identify the step and remove the product from the array
      state.bundle = state.bundle.filter(product => product.step < stepToRemove);
      console.log("Checking Bundle To See If ID removed", state.bundle);

      // Set the current step to the one that had the product removed
      state.currentStep = stepToRemove;

      console.log("Current Step After Removing Product", state.currentStep);

      // Hide the popup if it's visible
      closeNextStepPopup();

      updateUIforRemoveProduct(state.currentStep, bundleProduct);

      resetMilestonesFromStep(stepToRemove);
      console.log("Milestones after removing", stepsTracker.milestones);
    }
  


    //// Update UI based on actions functions

    function updateUIAfterProductAdded(productBlocks) {
      
      animateAddedProductToCart(productBlocks);
      populateBundleProduct(productBlocks);
      clearTitleOverlay(bundleStepsItems);
    
      // if were not editing then it can add the selected to the bundleStep
      if (state.editingStep === null) {
        colourSignifyingTheProductIsAdded(bundleStepsItems[state.currentStep]);
      }
    
      const popupDataCurrent = getCurrentStepData(state.currentStep);
      const popupDataPast = getCurrentStepData(state.currentStep - 1);
    
      if (state.editingStep === null && isProductAddedForStep(state.currentStep)) {
        makeStepImageSelected(bundleStepsItems[state.currentStep + 1]);
        makeStepImageSelected(mapStepsItems[state.currentStep + 1]);
        updateIndicatorPosition(state.currentStep + 1, bundleStepsItems.length);
        updatePopup(popupDataCurrent);
      } else if (!isProductAddedForStep(state.currentStep)) {
        updatePopup(popupDataPast);
      }
    
      changeBundleProductBtn[state.currentStep].classList.add("is--active");
      removeBundleProductBtn[state.currentStep].classList.add("is--active");

      if (state.prizeSteps.includes(state.currentStep)) {
      showCheckout();
      } else {
      hideCheckout();
      }

      setTimeout(() => openNextStepPopup(), 720);
    }


    function updateUIAfterMoveToNextStep() {
      // Update the step images for bundle and map areas
      activateStepImage(bundleStepsItems[state.currentStep]);
      activateStepImage(mapStepsItems[state.currentStep]);

      // Make previous step selected
      makeStepImageSelected(bundleStepsItems[state.currentStep - 1]);
      makeStepImageSelected(mapStepsItems[state.currentStep - 1]);
      
      // Deactivate Previous Step
      deactivateStepImage(bundleStepsItems[state.currentStep - 1]);
      deactivateStepImage(mapStepsItems[state.currentStep - 1]);
    
      openBundleItem(bundleStepsItems[state.currentStep]);

      // Update mobile bundle step info
      const dataForCurrentStep = getCurrentStepData(state.currentStep);
      updateMobileBundleStepInfo(dataForCurrentStep);
    
      // Update the product area 
      const productAreaData = getCurrentStepData(state.currentStep);
      updateProductArea(productAreaData);
    
      // Remove active state from the bundle guide
      bundleGuide.classList.remove("is--active");
    
      // Reset UI to no-popup state
      backToNoPopup();

    }


    function updateUIForEditMode(stepIndex) {
      // Deactivate any active prize elements and show the products if necessary
      if (isPrizeStep(state.currentStep)) {
        deactivatePrizeElements();
        products.classList.add("is--active");
      }

      // Update the product area with data from the step being edited
      const stepData = getCurrentStepData(stepIndex);

      updateProductArea(stepData);

    }


    function updateUIforRemoveProduct(currentStep) {

      // Update the indicator position ✅
      updateIndicatorPosition(currentStep, bundleStepsItems.length);

      // Update bundleImage
      activateStepImage(bundleStepsItems[state.currentStep]);
      activateStepImage(mapStepsItems[state.currentStep]);
    
      // Update the mobile bundle step information
      const dataForCurrentStep = getCurrentStepData(currentStep);
      console.log("data for current step", dataForCurrentStep);
      console.log("data current step", currentStep);

      // Update mobile bundle step info with current step data
      updateMobileBundleStepInfo(dataForCurrentStep);
    
      // Update the product area to reflect the current step ✅
      updateProductArea(dataForCurrentStep);
    
      // Update the popup data for the current step ✅
      updatePopup(dataForCurrentStep);

      // Grabs all the bundleStepItems 
      bundleStepsItems.forEach((item, index) => {
        // Check if the index is equal to or above the current step
        if (index > currentStep && index !== state.discountStep || (index === currentStep && index !== state.discountStep)){
          const bundleProduct = item.querySelector("[bundle-product]");
          // Always remove the product data and apply the title overlay
          removeBundleProduct(bundleProduct); // Directly pass the element
          applyTitleOverlay(item);

          item.querySelector("[remove-product]").classList.remove("is--active");
          item.querySelector("[change-btn]").classList.remove("is--active");

        } if (index > currentStep) {
          item.querySelector("[bundle-item]").classList.remove("is--active");
          deactivateStepUI(item);
        }
      });

      mapStepsItems.forEach((item, index) => {
        if (index > currentStep) {
          deactivateStepUI(item);
        }
      });
      
    }


    //// Event listeners

    // [add-to-bundle] button
      document.addEventListener("click", function (e) {
      if (!e.target.matches("[add-to-bundle]")) return;
      const productBlocks = getClosestProductBlock(e.target);
      addProductToBundle(productBlocks);
      });
  
      // [next-step-btn] buttons
      document.querySelectorAll("[next-step-btn]").forEach((button) => {
      button.addEventListener("click", moveToNextStepClick);
      });
  
      // [change] buttons  
      changeBundleProductBtn.forEach((button) => {
        button.addEventListener('click', function(event) {
          const stepValue = parseInt(event.currentTarget.dataset.step, 10) - 1;
          console.log("stepValue of Change", stepValue);
          editMode(stepValue);
        })
      });
  
      // [popup-exit] button
      document.querySelector("[popup-exit]").addEventListener("click", function () {
        closeNextStepPopup();
        dontMoveToNextStep();
      });

      // [remove-product] button
      removeBundleProductBtn.forEach((button) => {
        button.addEventListener('click', function(event) {
          const stepToRemove = parseInt(event.currentTarget.dataset.step, 10) - 1;
          const bundleProduct = event.currentTarget.closest("[bundle-item]");
          removeProduct(stepToRemove, bundleProduct);
        })
      });


    //////////// FUNCTIONS ////////////////


    // Utility functions (mainly for product added to bundle)

    function openNextStepPopup() {
    // Next step popup comes in
    nextStepEl.classList.add("is--open");
    popupBg.classList.add("is--open");
    body.style.overflow = "hidden";
    }
  
    function closeNextStepPopup() {
    popupBg.classList.remove("is--open");
    body.style.overflow = "auto";
    nextStepEl.classList.remove("is--open");
    }
  
    function getClosestProductBlock(element) {
      const commonAncestor = element.closest("[find-product-block]");
      return commonAncestor
        ? commonAncestor.querySelectorAll("[product-block]")
        : [];
    }
  
    function getBundleProductsInsideBundleItem() {
  
    // depending on if we are in edit mode or not, get the step number 
    const targetStep = state.editingStep !== null ? (state.editingStep) : state.currentStep;
  
    // get the index and find that bundle item of that index
    const bundleItem = bundleStepsItems[targetStep];
    
    // get all the [bundle-product] inside that bundle item 
    return bundleItem.querySelectorAll("[bundle-product]");
    }
  
    function isProductAddedForStep(stepIndex) {
      // Assuming step is the index or identifier for the bundle step
      const stepElement = document.querySelector(`[bundle-step="${stepIndex + 1}"]`);
      
      if (stepElement) {
        const bundleStepsProductElement = stepElement.querySelector('.bundle_steps_product');
        
        if (bundleStepsProductElement) {
          return bundleStepsProductElement.classList.contains('is--selected');
        }
      }
    
      return false; // Return false if the step element or .bundle_steps_product element doesn't exist
    }


    
    // Logic function

    function getProductIDFromBlock(productBlock) {
      const idEl = productBlock.querySelector("[data-id]");
      return idEl ? parseInt(idEl.getAttribute("data-id"), 10) : null;
    }

    function upsertProductInBundle(bundle, step, idNumber, isLastStep = false) {
      const stepIndex = bundle.findIndex((item) => item.step === step);
      
      if (stepIndex !== -1) {
        // If it's the last step and the product ID is not already in the array, add it
        if (isLastStep && !bundle[stepIndex].productIds.includes(idNumber)) {
          bundle[stepIndex].productIds.push(idNumber);
        } else {
          // For any other step, or if it's not the last step, replace the product IDs
          bundle[stepIndex].productIds = [idNumber];
        }
      } else {
        // Add a new step with a new product ids array
        bundle.push({ step, productIds: [idNumber] });
      }
      
      return bundle; // Return the new state of the bundle
    }

    function processProductBlocks(productBlocks, currentStep, editingStep) {
      let updatedBundle = [...state.bundle];
      const isLastStep = (editingStep ?? currentStep) === 6; // Define LAST_STEP_NUMBER accordingly
    
      productBlocks.forEach((productBlock) => {
        const step = editingStep ?? currentStep;
        const idNumber = getProductIDFromBlock(productBlock);
        if (idNumber !== null) {
          updatedBundle = upsertProductInBundle(updatedBundle, step, idNumber, isLastStep);
        }
      });
    
      return updatedBundle;
    }
    
    function markMilestonesAsComplete(currentStep) {
      // Go through each milestone and set it to true up to the current step
      for (const milestone in stepsTracker.milestones) {
        if (stepsTracker.milestones.hasOwnProperty(milestone)) {
          const milestoneStep = parseInt(milestone.replace(/[^\d]/g, '')); // Extract step number from milestone name
          if (milestoneStep <= currentStep + 1) { // +1 because steps are 1-indexed in milestones and 0-indexed in currentStep
            stepsTracker.milestones[milestone] = true;
          }
        }
      }
    }

    function resetMilestonesFromStep(step) {
      // Reset the milestones from the current step onward
      for (const milestone in stepsTracker.milestones) {
        if (stepsTracker.milestones.hasOwnProperty(milestone)) {
          const milestoneStep = parseInt(milestone.replace(/[^\d]/g, '')); // Extract step number from milestone name
          if (milestoneStep >= step + 1) { // +1 because steps are 1-indexed in milestones and 0-indexed in step
            stepsTracker.milestones[milestone] = false;
          }
        }
      }
    }

    // UI Functions (mainly for add to bundle action) // 
    
    // 1. Animate the product into the cart
    function animateAddedProductToCart(productBlocks) {
      const animations = [];
  
      productBlocks.forEach((productBlock, index) => {
        const clonedProductBlock = productBlock.cloneNode(true);
        const rect = productBlock.getBoundingClientRect();
        clonedProductBlock.style.position = "fixed";
        clonedProductBlock.style.top = rect.top + "px";
        clonedProductBlock.style.left = rect.left + "px";
        clonedProductBlock.style.width = rect.width + "px";
        clonedProductBlock.style.zIndex = 1000 + index;
  
        // Add the cloned product card to the body
        body.appendChild(clonedProductBlock);
  
        // Retrieve all [bundle-product] inside the current [bundle-item]
        // If the editingStep is set (in edit mode), then we use that steps bundle-product as a target
        const bundleProducts = getBundleProductsInsideBundleItem();
  
        // Use the index to get the specific [bundle-product] for animation
        const targetElement = bundleProducts[index];
        const targetRect = targetElement.getBoundingClientRect();
  
        // Calculate the translation values
        const translateYValue = targetRect.top - rect.top;
        const translateXValue = targetRect.left - rect.left;
  
        // Animate them to the bundle
        const animationForThisProduct = [
          [
            clonedProductBlock,
            {
              transform: [
                "translate(0%, 0%) scale(1)",
                "translate(5%, -20%) scale(1)",
                `translate(${translateXValue}px, ${translateYValue}px) scale(0.1)`
              ],
              opacity: [1, 0]
            },
            { duration: 0.5 }
          ]
        ];
  
        // Add this animation to the array
        animations.push(...animationForThisProduct);
      });
  
      // If we're on mobile this will be the animation
      if (isMobile()) {
        const mobileAnimations = [
          [
            bundleComponent,
            { transform: "translateY(0%)" },
            { duration: 0.2, easing: "ease-in-out" }
          ],
          [
            ".bundle_cart-trigger",
            {
              transform: [
                "translateY(0%)",
                "translateY(-10%)",
                "translateY(0%)",
                "translateY(-10%)",
                "translateY(0%)"
              ]
            },
            { duration: 0.64, easing: "ease-in-out" }
          ],
          [bundleComponent, { opacity: 0 }, { duration: 0.3 }],
          [".bundle_map-wrap", { opacity: 0 }, { duration: 0.3, at: "<" }]
        ];
  
        // Add animation to aray
        animations.push(...mobileAnimations);
      }
  
      const addToBundleAnim = Motion.timeline(animations, {
        defaultEasing: "ease-in-out"
      });
  
      // After the animation is finished then scroll bundle to the next step 
      // - Delete cloned blocks
  
      addToBundleAnim.finished.then(() => {
        // Scrolling the bundle down when a product is added
        const targetPosition = bundleStepsItems[state.currentStep].offsetTop;
  
        // Adjust for the height of the "your bundle" sticky header
        const stickyHeaderOffset = 50; // Adjust this value to your needs
        const finalScrollPosition = targetPosition - stickyHeaderOffset;
  
        // Smoothly scroll to the final position
        bundleOverflow.scrollTo({
          top: finalScrollPosition,
          behavior: "smooth"
        });
  
        // Remove clones
        productBlocks.forEach((_, index) => {
          const clonedProductBlock = document.querySelector(
            `[data-cloned-index="${index}"]`
          );
          clonedProductBlock?.remove();
        });
      });
    }
  
    // 2. Add the product data to the bundle
    // Refactored to handle both adding and removing product data
    function populateBundleProduct(productBlocks) {

      const productContainers = getBundleProductsInsideBundleItem();
    
      Array.from(productBlocks).forEach((productBlock, index) => {
        if (!productContainers[index]) {
          console.warn(`No [bundle-product] found for index ${index}`);
          return;
        }
        
        // Populate data
        const imgSrc = productBlock.querySelector("[data-img]").src;
        const title = productBlock.querySelector("[data-title]").textContent;
        const price = productBlock.querySelector("[data-price]").textContent;
        
        const targetProductContainer = productContainers[index];
        targetProductContainer.querySelector("[data-img]").src = imgSrc;
        targetProductContainer.querySelector("[data-img]").srcset = imgSrc;
        targetProductContainer.querySelector("[data-title]").textContent = title;
        targetProductContainer.querySelector("[data-price]").textContent = price;
      });
    }
    
    // 3. Remove the title cover
    function clearTitleOverlay(bundleStepsItems) {
      const targetBundleItem = state.editingStep !== null ? bundleStepsItems[state.editingStep - 1] : bundleStepsItems[state.currentStep];
      if (!targetBundleItem) return;
  
      const titleCoveredElements = targetBundleItem.querySelectorAll(
        ".title-covered"
      );
      titleCoveredElements.forEach((element) => {
        element.classList.add("is--cleared");
        const bundleProductText = element.querySelector(".bundle-product-text");
        if (bundleProductText) {
          bundleProductText.style.opacity = 1;
        }
      });
    }
    
    // 4 Update position of the indicator
    function updateIndicatorPosition(currentStep, totalSteps) {
      const indicatorThumbs = document.querySelectorAll(
        ".bundle_indicator-thumb"
      );
      const stepPercentage = ((currentStep) / totalSteps) * 100 + 10;
  
      indicatorThumbs.forEach((indicatorThumb) => {
        if (indicatorThumb.classList.contains("is--map")) {
          // Horizontal progress for mobile top indicator
          indicatorThumb.style.transform = `translateX(${stepPercentage - 100}%)`;
        } else {
          // Vertical progress for the bundle indicator
          indicatorThumb.style.transform = `translateY(${stepPercentage - 100}%)`;
        }
      });
    }

    // 5. Update the next step popup
    function updatePopup(stepElement) {
    
      const nextStepPopup = document.querySelector("[next-step-popup]");
    
      nextStepPopup?.style.setProperty(
        "--popup-bg-color",
        stepElement.dataset.nextStepBgColour
      );
      nextStepPopup?.style.setProperty(
        "--popup-text-color",
        stepElement.dataset.nextStepTextColour
      );
    
      const nextStepHeadingEl = nextStepEl.querySelector(
        "[data-next-step-heading]"
      );
      const nextStepParagraphEl = nextStepEl.querySelector(
        "[data-next-step-paragraph]"
      );
      const nextStepImgEl = nextStepEl.querySelector("[data-next-step-img]");
    
      const nextStepBtnTextEl = nextStepEl.querySelector(
        "[data-next-step-btn-text]"
      );
    
      if (nextStepHeadingEl) {
        nextStepHeadingEl.textContent = stepElement.dataset.nextStepHeading;
      }
    
      if (nextStepParagraphEl) {
        nextStepParagraphEl.textContent = stepElement.dataset.nextStepParagraph;
      }
    
      if (nextStepImgEl) {
        nextStepImgEl.src = stepElement.dataset.nextStepImg;
        nextStepImgEl.srcset = stepElement.dataset.nextStepImg;
      }
    
      if (nextStepBtnTextEl) {
        nextStepBtnTextEl.textContent = stepElement.dataset.nextStepBtnText;
      }
    
      let stepData;
    
      // Determine which stepData to use
      if (state.editingStep !== null && !isProductAddedForStep(state.currentStep)) {
        // If in edit mode and no product is added for the current step, use the current step
        stepData = getCurrentStepData(state.currentStep);
      } else if (isProductAddedForStep(state.currentStep)) {
        // If a product is added for the current step, use the next step
        stepData = getCurrentStepData(state.currentStep + 1);
      } else {
        // Otherwise, use the next step
        stepData = getCurrentStepData(state.currentStep + 1);
      }
    
      // Update the popup background
      if (nextStepPopup && stepData) {
        nextStepPopup.style.background = `linear-gradient(to bottom, var(--popup-bg-color) 45%, transparent), url(${stepData.dataset.stepBgImg}) 50% / cover no-repeat`;
      }
    
    }
  
    // 6. Sets the is--selected class to the current step.
    function colourSignifyingTheProductIsAdded(stepItems) {
    const colourBundleProduct = stepItems.querySelector(
      "[bundle-product-added]"
    );
    colourBundleProduct?.classList.add("is--selected");
    }

    function openBundleItem(stepItems) {
      const bundleItemEl = stepItems.querySelector("[bundle-item]");
      bundleItemEl?.classList.add("is--active");
    }

    function activateStepImage(stepItems) {
      const stepImageEl = stepItems.querySelector(
        "[step-image]"
      );
      stepImageEl ?.classList.add("is--active");    
    }

    function deactivateStepImage(stepItems) {
      const stepImageEl = stepItems.querySelector(
        "[step-image]"
      );
      stepImageEl ?.classList.remove("is--active");
    }

    function makeStepImageSelected (stepItems) {
      const stepImageEl = stepItems.querySelector(
        "[step-image]"
      );
      stepImageEl ?.classList.add("is--selected");
    }

    function showCheckout() {
      popupCheckoutWrap.classList.add("is--active");
      checkoutBtn.forEach((btn) =>{
        btn.classList.add("is--active");
        btn.classList.remove("is--disabled");
      });
    }

    function hideCheckout() {
      popupCheckoutWrap.classList.remove("is--active");
      checkoutBtn.forEach((btn) =>{
        btn.classList.remove("is--active");
        btn.classList.add("is--disabled");
      });
    }



///////////////////////////////////// Bundle Functionality (Next step click) ///////////////////////////////////////
  

    // Utility Functions (mainly used for next step click)
    
    function isPrizeStep(step) {
      const prizeSteps = [2, 4, 6];
      return prizeSteps.includes(step);
    }
    
    function deactivatePrizeElements() {
      const seaEl = document.querySelector("[sea-el]");
      const skyEl = document.querySelector("[sky-el]");
      const meadowEl = document.querySelector("[meadow-el]");
    
      seaEl.classList.remove("is--active");
      skyEl.classList.remove("is--active");
      meadowEl.classList.remove("is--active");
    }
    
    function activatePrizes(step) {
      const seaEl = document.querySelector("[sea-el]");
      const skyEl = document.querySelector("[sky-el]");
      const meadowEl = document.querySelector("[meadow-el]");
    
      if (step === 2) {
        products.classList.remove("is--active");
        seaEl.classList.add("is--active");
      } else if (step === 4) {
        products.classList.remove("is--active");
        skyEl.classList.add("is--active");
      } else if (step === 6) {
        products.classList.remove("is--active");
        meadowEl.classList.add("is--active");
      }
    }
    
    function getCurrentStepData(stepIndex) {
      // Finds the step data based on the stepIndex provided
      const adjustedStep = stepIndex + 1; // Since your data-step-name starts from 1 instead of 0
      return document.querySelector(`.step[data-step-name="${adjustedStep}"]`);
    }
    
    // UI Functions (mainly for next step click)

    
    
    function updateMobileBundleStepInfo(stepElement) {
      if (isMobile()) {
        const mobileIndicator = document.querySelector(
          "[bundle-mobile-indicator]"
        );
        const iconImgEl = mobileIndicator.querySelector("[data-step-icon-img]");
        const locationEl = mobileIndicator.querySelector("[data-step-location]");
    
        if (iconImgEl) {
          iconImgEl.src = stepElement.dataset.stepIconImg;
          iconImgEl.srcset = stepElement.dataset.stepIconImg;
        }
    
        if (locationEl) {
          locationEl.textContent = stepElement.dataset.stepLocation;
        }
      }
    }
    
    function updateProductArea(stepElement) {
      if (stepElement.dataset.stepPrize !== "true") {
        // Get the target elements inside the products area
        const productImgEl = products.querySelector("[data-step-img]");
        const productLocationEl = products.querySelector("[data-step-location]");
        const productBgImgEl = products.querySelector("[data-step-bg-img]");
        const productHeadingEl = products.querySelector("[data-step-heading]");
        const productParagraphEl = products.querySelector(
          "[data-step-paragraph]"
        );
        const bannerElement = products.querySelector("[banner]");
        const nextStepCharacterEl = products.querySelector(
          "[data-step-character]"
        );
        console.log(nextStepCharacterEl);
    
        if (nextStepCharacterEl) {
          nextStepCharacterEl.src = stepElement.dataset.stepCharacter;
          nextStepCharacterEl.srcset = stepElement.dataset.stepCharacter;
        }
    
        if (bannerElement) {
          if (stepElement.dataset.stepBannerBgColour) {
            bannerElement.style.setProperty(
              "--banner-bg-color",
              stepElement.dataset.stepBannerBgColour
            );
          }
          if (stepElement.dataset.stepBannerColour) {
            bannerElement.style.setProperty(
              "--banner-color",
              stepElement.dataset.stepBannerColour
            );
          }
        }
    
        if (bannerElement) {
          if (stepElement.dataset.stepBannerBtnIdleBgColour) {
            bannerElement.style.setProperty(
              "--banner-btn-idle-bg-color",
              stepElement.dataset.stepBannerBtnIdleBgColour
            );
          }
          if (stepElement.dataset.stepBannerBtnActiveBgColour) {
            bannerElement.style.setProperty(
              "--banner-btn-active-bg-color",
              stepElement.dataset.stepBannerBtnActiveBgColour
            );
          }
          if (stepElement.dataset.stepBannerBtnIdleTextColour) {
            bannerElement.style.setProperty(
              "--banner-btn-idle-text-color",
              stepElement.dataset.stepBannerBtnIdleTextColour
            );
          }
          if (stepElement.dataset.stepBannerBtnActiveTextColour) {
            bannerElement.style.setProperty(
              "--banner-btn-active-text-color",
              stepElement.dataset.stepBannerBtnActiveTextColour
            );
          }
        }
    
        bundleGuide.style.setProperty(
          "--banner-btn-active-text-color",
          stepElement.dataset.stepBannerBtnActiveTextColour
        );
    
        bundleGuide.style.setProperty(
          "--banner-btn-active-bg-color",
          stepElement.dataset.stepBannerBtnActiveBgColour
        );
    
    
        // Background and text colors would be applied directly to the `products` element
        const productBgColour = stepElement.dataset.stepBgColour;
    
        if (productBgColour) {
          products.style.backgroundColor = productBgColour;
        }
    
        // Update the properties of the target elements
        if (productImgEl) {
          productImgEl.src = stepElement.dataset.stepImg;
          productImgEl.srcset = stepElement.dataset.stepImg;
        }
    
        if (productLocationEl) {
          productLocationEl.textContent = stepElement.dataset.stepLocation;
        }
    
        if (productBgImgEl) {
          productBgImgEl.src = stepElement.dataset.stepBgImg;
          productBgImgEl.srcset = stepElement.dataset.stepBgImg;
        }
    
        if (productHeadingEl) {
          productHeadingEl.textContent = stepElement.dataset.stepHeading;
        }
    
        if (productParagraphEl) {
          productParagraphEl.textContent = stepElement.dataset.stepParagraph;
        }
      }
    }

    // Main logic
    function handlePopupBtnClick() {
      nextStepEl.classList.remove("is--open");
      if (isPrizeStep(state.currentStep - 1)) {
        products.classList.add("is--active");
        deactivatePrizeElements();
      }
      popupBg.classList.remove("is--open");
      body.style.overflow = "auto";
    }
    
    function backToNoPopup() {
      const initialState = [
        [bundleComponent, { opacity: 1 }, { duration: 0.3 }],
        [".bundle_map-wrap", { opacity: 1 }, { duration: 0.3, at: "<" }]
      ];
      Motion.timeline(initialState);
    
      // Scroll to the top
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
      }
    
    }


    ///////////////////////////////////// Bundle Functionality (Remove Product) ///////////////////////////////////////

    function applyTitleOverlay(bundleItem) {
      const titleCoveredElements = bundleItem.querySelectorAll(".title-covered");
      titleCoveredElements.forEach((element) => {
        element.classList.remove("is--cleared"); // Remove the class that was previously added
        const bundleProductText = element.querySelector(".bundle-product-text");
        if (bundleProductText) {
          bundleProductText.style.opacity = 0; // Reset opacity to show the overlay
        }
      });
    }
    
    function removeBundleProduct(bundleProduct) {

      console.log("inside remove", bundleProduct);
      // Clear data
      bundleProduct.querySelector("[data-img]").src = bundleProductImg;
      bundleProduct.querySelector("[data-img]").srcset = bundleProductImg;
      bundleProduct.querySelector("[data-title]").textContent = 'Product Title';
      bundleProduct.querySelector("[data-price]").textContent = '~~~~~~~~';
    }

    function deactivateStepUI(stepItems) {
     // Previous Bundle Image Gets is--active removed
        const stepImageEl = stepItems.querySelector(
          "[step-image]"
        );
        stepImageEl?.classList.remove("is--active");
        stepImageEl?.classList.remove("is--selected");
    }


























    ////////// MENU FUNCTINALITY /////////

    // BUNDLE MAP STEPS ABSOLUTE
    function applyStyles() {
      // Handle styles for items inside .bundle_intro
      const introCmsItems = document.querySelectorAll(
        ".bundle_intro [data-left][data-bottom]"
      );
      introCmsItems.forEach((item) => {
        item.style.position = "absolute";
        item.style.left = item.getAttribute("data-left") + "%";
        item.style.bottom = item.getAttribute("data-bottom") + "%";
      });

      // Handle styles for items inside [map]
      const mapCmsItems = document.querySelectorAll(
        "[map] [data-left][data-bottom]"
      );
      mapCmsItems.forEach((item) => {
        if (isMobile()) {
          if (map.classList.contains("is--open")) {
            item.style.position = "absolute";
            item.style.left = item.getAttribute("data-left") + "%";
            item.style.bottom = item.getAttribute("data-bottom") + "%";
          } else {
            item.style.position = "relative";
            item.style.left = "";
            item.style.bottom = "";
          }
        } else {
          // Desktop
          item.style.position = "absolute";
          item.style.left = item.getAttribute("data-left") + "%";
          item.style.bottom = item.getAttribute("data-bottom") + "%";
        }
      });
    }

    applyStyles();

    // CLOSING MENU --
    function closeAllMenus() {
      map.classList.remove("is--open");
      mapImg.classList.remove("is--open");
      bundleCart.classList.remove("is--open");
      body.style.overflow = "";
      popupBg.style.pointerEvents = "none";
      popupBg.classList.remove("is--open");
      if (isMobile) {
        popupBg.style.zIndex = "3";
      }
      mapText.innerText = "View Map";
      indicatorMap.style.display = ""; // Show the indicator when all menus are closed
      bundleCartIndicator.innerText = "Open"; // Set the bundle cart indicator text
      applyStyles();
    }

    function togglePopupBackground() {
      const isOpen =
        map.classList.contains("is--open") ||
        bundleCart.classList.contains("is--open");

      if (isOpen) {
        popupBg.classList.add("is--open");
        popupBg.style.pointerEvents = "auto";
        body.style.overflow = "hidden";
        if (bundleCart.classList.contains("is--open") && isMobile()) {
          popupBg.style.zIndex = "3"; // Set z-index to a higher value
        } else {
          popupBg.style.zIndex = "2"; // Reset z-index to its original value
        }
      } else {
        popupBg.classList.remove("is--open");
        popupBg.style.pointerEvents = "none";
        body.style.overflow = "";
        if (isMobile()) {
          popupBg.style.zIndex = "3"; // Reset z-index to its original value
        }
      }
    }

    function toggleElement(element, openClass, textElement, openText, closeText) {
      element.classList.toggle(openClass);

      if (textElement) {
        textElement.innerText = element.classList.contains(openClass)
          ? openText
          : closeText;
      }

      if (element === bundleCart) {
        // Specifically for the bundleCart
        bundleCartIndicator.innerText = element.classList.contains(openClass)
          ? "Close"
          : "Open";
      }

      togglePopupBackground();
      applyStyles();
    }

    document.querySelectorAll("[view-map-btn]").forEach((button) => {
      button.addEventListener("click", function () {
        toggleElement(map, "is--open", mapText, "Close Map", "View Map");
        mapImg.classList.toggle("is--open");
        if (isMobile()) {
          indicatorMap.style.display = map.classList.contains("is--open")
            ? "none"
            : "";
        }
      });
    });

    if (isMobile()) {
      document
        .querySelector("[bundle-cart-btn]")
        .addEventListener("click", function () {
          // If map is open, close it when bundle cart is toggled
          if (map.classList.contains("is--open")) {
            map.classList.remove("is--open");
            mapImg.classList.remove("is--open");
            mapText.innerText = "View Map";
            indicatorMap.style.display = ""; // Show the indicator when map is closed
          }

          toggleElement(bundleCart, "is--open");
          bundleCartIndicator.classList.toggle("is--open");
        });
    }

    popupBg.addEventListener("click", closeAllMenus);
    window.addEventListener("resize", applyStyles);
    

    // -- End

    // SCROLLING UP OR DOWN
    let lastScrollPosition = 0,
      requestPending = false;

    const viewMapButtons = document.querySelectorAll("[view-map-btn]");
    const bundleComponent = document.querySelector(".bundle_component");

    function handleScrollDirection(scrollDirection) {
      if (scrollDirection === "down") {
        // Hide the view-map-btn when scrolling down
        viewMapButtons.forEach((button) => {
          button.style.opacity = "0";
          button.style.pointerEvents = "none";
        });
        bundleComponent.style.transform = "translateY(150%)";
      } else {
        // Show the view-map-btn when scrolling up
        viewMapButtons.forEach((button) => {
          button.style.opacity = "1";
          button.style.pointerEvents = "auto";
        });
        bundleComponent.style.transform = "translateY(0%)";
      }
    }

    window.addEventListener(
      "scroll",
      function () {
        if (isMobile()) {
          const currentScrollPosition =
            window.pageYOffset || document.documentElement.scrollTop;

          if (!requestPending) {
            window.requestAnimationFrame(function () {
              if (Math.abs(currentScrollPosition - lastScrollPosition) >= 20) {
                if (currentScrollPosition > lastScrollPosition) {
                  handleScrollDirection("down");
                } else {
                  handleScrollDirection("up");
                }
                lastScrollPosition =
                  currentScrollPosition <= 0 ? 0 : currentScrollPosition;
              }
              requestPending = false;
            });
            requestPending = true;
          }
        }
      },
      {
        passive: true
      }
    );

  });