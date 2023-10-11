/*===================================
  Ingredient Modal script logic
/*===================================*/

const style = getComputedStyle(document.body);
const mainBgColor = style.getPropertyValue('--cfm-main-bg-color');
const componentBgColor = style.getPropertyValue('--cfm-component-bg-color');
const viewIngLinkTextColor = style.getPropertyValue('--cfm-main-button-text-color');
const poweredByLogoBorder = style.getPropertyValue('--cfm-main-text-color');
const sideDrawerDirection = style.getPropertyValue('--cfm-side-drawer-sliding-direction');
const attributeIcons = style.getPropertyValue('--cfm-attributes-with-icons')?.trim() === 'no' ? 'no' : 'yes';
let activeAcc, count = 0;
let storeUrl, categoryId, previousCategory, bottomPanelText = '';
let inverseCrossSell, toggleDisabled, isCrossSellEnabled, showCrossSell = false;
let clickedIng, activeIndex, listParent, crossSellData, ingredientData, productCategories, retainFeedbackIcon, upcVal, searchedIngResults;

// Add Customized Link Text Color After Window Loads
window.addEventListener("load", function () {
  if (viewIngLinkTextColor && viewIngLinkTextColor.trim() !== '') {
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.classList.add('cfm-custom-link-color');
  }
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('clearforme') && urlParams.get('clearforme') === 'true') {
    const skuVal = document.getElementById('cfm-sku').innerText;
    handleButtonClick(skuVal)
  }
});

//handle Ing Click
document.addEventListener('click', function (e) {
  if (e.target && e.target.getAttribute('data-id') === 'cfm-ing-list') {
    e.preventDefault();

    inverseCrossSell = false;
    count = 0;
    previousCategory = '';
    categoryId = '';
    showCrossSell = false;
    clickedIng = e;
    const parent = e.target.parentElement.parentElement;
    listParent = e.target.parentElement;

    activeIndex = [...parent.children].indexOf(e.target.parentElement);

    let displayedAcc = false;
    const nextSiblingNode = e.target.nextElementSibling;

    if (nextSiblingNode) {
      displayedAcc = nextSiblingNode.classList.contains('cfm-acc-content');
    }

    if (activeIndex === activeAcc - 1 && displayedAcc) {
      displayAccContent(null, null, e.target);
    } else fetchIngredientsDetails(e, activeIndex, listParent);

    document.querySelector('.cfm-ingredient-componet-container:nth-of-type(1) > .cfm-function-group-container:nth-of-type(1) .cfm-ing-list > li')?.classList.add('cfm__stop-animation');
  }
});

// Listener for cross sell toggle change
document.addEventListener('change', e => {
  const loader = document.getElementsByClassName('cfm-loader')[0];
  if(e.target && e.target.getAttribute('data-name') === 'cfm-crossSell-toggle-input' && loader.classList.contains('cfm-hide-loader')) {
    e.preventDefault();
    inverseCrossSell = e.target.checked;
    e.target.disabled = true;

    const sideDrawer = document.getElementById('cfm-side-drawer-content-container');
    showLoader(loader, sideDrawer)
    
    crossSellHandles(ingredientData.productIngredientId)
    .then(res => {
      crossSellStructure(ingredientData, res)
    }).catch(err => {
      loader.classList.add('cfm-hide-loader')
      sideDrawer.style.overflowY = 'scroll';
    })

    toggleDisabled = false;
  }
});

/* Product Categories Function Starts Here */

// Function to Open the Category Dropdown when clicked
document.addEventListener('click', e => {
  const optionsContainer = document.querySelector(".cfm-options-container");
  if(e.target && e.target.getAttribute('data-name') === 'cfm-category-filter') {
    optionsContainer.classList.toggle("cfm-active");
  } else {
    optionsContainer?.classList?.remove("cfm-active");
  }
})

// Function to Open the Category Dropdown when clicked
document.addEventListener('click', e => {
  const clickedIngId = clickedIng?.target.getAttribute('cfmi-id');
  const productIngId = clickedIng?.target.getAttribute('cfm-product-ingredient-id');

  if(e.target && e.target.getAttribute('data-name') === "cfm-thumbs-up" && !e.target.classList.contains('cfm-active')) {
    document.querySelector('.cfm-helpful .cfm-help-icons > svg.cfm-active')?.classList.remove('cfm-active','cfm-pop-animate');
    retainFeedbackIcon[clickedIngId] = { like: true, dislike: false };
    postFeedback(upcVal, productIngId, true)
    e.target.classList.add('cfm-active','cfm-pop-animate');
  } else if(e.target && e.target.getAttribute('data-name') === "cfm-thumbs-down" && !e.target.classList.contains('cfm-active')) {
    document.querySelector('.cfm-helpful .cfm-help-icons > svg.cfm-active')?.classList.remove('cfm-active', 'cfm-pop-animate');
    retainFeedbackIcon[clickedIngId] = { like: false, dislike: true };
    postFeedback(upcVal, productIngId, false)
    e.target.classList.add('cfm-active','cfm-pop-animate');
  }
})

// Function to set the category filter for the dropdown when clicked on any category
document.addEventListener('click', e => {
  const loader = document.getElementsByClassName('cfm-loader')[0];
  if(e.target && e.target.getAttribute('data-name') === 'cfm-category-option' && !e.target.classList.contains('cfm-pre-selected') && loader.classList.contains('cfm-hide-loader')) {
    const selected = document.querySelector(".cfm-modal-content .cfm-product-filter .cfm-selected");
    const optionsContainer = document.querySelector(".cfm-modal-content .cfm-product-filter .cfm-select-box .cfm-options-container");
    const sideDrawer = document.getElementById('cfm-side-drawer-content-container');

    selected.innerHTML = e.target.innerText;
    optionsContainer.classList.remove("cfm-active");
    categoryId = e.target.getAttribute('data-category-id');
    previousCategory = e.target.innerText;

    showLoader(loader, sideDrawer)

    crossSellHandles(ingredientData.productIngredientId)
    .then(res => {
      crossSellStructure(ingredientData, res)
    })
    .catch(err => {
      loader.classList.add('cfm-hide-loader')
      sideDrawer.style.overflowY = 'scroll';
    });

    toggleDisabled = false;
  }
})
/* Product Categories Function Ends Here */

/*Function to fetch search ingredient results*/
document.addEventListener('input', async e => {
  if(e.target && e.target.getAttribute('data-name') === 'cfm-search-ing-input') {
    const searchFilter = document.querySelector('.cfm-search-filter');
    const searchDownArrow = document.querySelector('.cfm-search-down-icon');
    const searchResetIcon = document.querySelector('.cfm-search-reset-icon');
    const searchDropdown = document.querySelector('.cfm-search-ing-list');
    const searchedResults = document.querySelectorAll('.cfm-search-ing-list > li');

    const isEmpty = e.target.value.length === 0;

    if(isEmpty) {
      searchFilter?.classList.remove('cfm-active-loader')
      // Calling resetIngStructure function to reset back the whole ingredient list structure
      resetIngStructure();
      searchDropdown.innerHTML = "<p>The searched ingredient is not found in this product.</p>";
    }

    // Conditions to toggle classes based on search string is empty or not
    searchDownArrow.classList.toggle('cfm-hide', !isEmpty);
    searchResetIcon.classList.toggle('cfm-hide', isEmpty);
    searchDropdown.classList.toggle('cfm-hide', isEmpty);

    const searchIngUrl = `https://clickable-api.clearforme.com/api/app/products/ingredients/search?ingredientName=${encodeURIComponent(e.target.value)}&upc=${upcVal}`;
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${validationToken}`,
      "X-Client-Shopify": true
    };

    // Show ellipses loader while fetching search results
    if(!isEmpty) {
      !searchedResults?.length && searchFilter?.classList.add('cfm-active-loader');

      // fetching Level-1 product categories data
      searchedIngResults = await fetch(searchIngUrl, { headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(res => {
        // if data has length then trim the array to 100 results and display
        if(res?.length > 0 && e.target.value.length) {
          searchedIngResults = '';
          res.slice(0, 100).forEach(elem => {
            searchedIngResults += `
              <li data-cfmi-id="${elem._id}" data-name="cfm-search-list-ing" title="${elem.ingredientName}">
                <span title="${elem.ingredientName}" data-cfmi-id="${elem._id}" data-name="cfm-search-list-ing">${elem.ingredientName}</span>
              </li>`
          })
          searchDropdown.innerHTML = searchedIngResults;
        } else {
          searchDropdown.innerHTML = "<p>The searched ingredient is not found in this product.</p>";
        }
      }).catch(err => console.log(err));
      // Remove loader after searched results are fetched
      searchFilter?.classList.remove('cfm-active-loader');
    }
  }
})

/* Function to show and hide ingredients based on the search */
document.addEventListener('click', e => {
  if(e.target && e.target.getAttribute('data-name') === 'cfm-search-list-ing') {
    const allIngredients = document.querySelectorAll('.cfm-modal-content .cfm-ing-name');
    const searchInput = document.querySelector('.cfm-search-ing-input');
    const searchDropdown = document.querySelector('.cfm-search-ing-list');
    const ingCompContainer = document.querySelectorAll('.cfm-modal-content .cfm-ingredient-componet-container');
    const ingInfoContainer = document.querySelector('.cfm-modal-content .cfm-ingredient-info-container');
    const tapToLearnMore = document.querySelector('.cfm-tap-to-learn-more');
    let allIngVisibility = false;

    // Calling resetIngStructure function to reset back the whole ingredient list structure
    resetIngStructure();
    
    searchDropdown?.classList.add('cfm-hide')
    searchInput.value = e.target.innerText.trim();

    // hiding ingredient which does not matched search string
    allIngredients?.length && allIngredients?.forEach(elem => {
      if(elem?.getAttribute('cfmi-id') !== e.target.getAttribute('data-cfmi-id')) {
        elem.parentElement.style.display = 'none';
      }
    });

    /* Logic to Hide or Show the Component & Ingredient Header Starts Here */
    ingCompContainer?.length && ingCompContainer.forEach((elem) => {
      let showHideVal = false;
      [...elem.querySelectorAll('.cfm-function-group-container')].forEach((item) => {
        const ingListLength = [...item.querySelectorAll('.cfm-ing-list > li')].every(list => list.style.display === 'none');

        // Logic to hide or show component sub headers
        if(ingListLength) {
          item.querySelector('.cfm-info-heading').style.display = 'none';
        } else {
          allIngVisibility = true;
          showHideVal = true;
        }
      });

      // if showHideVal = true hide the component name
      if(!showHideVal) {
        elem.querySelector(`.cfm-info-heading`).style.display = 'none';
      }
    });
    /* Logic to Hide or Show the Component & Ingredient Header Ends Here */

    // Condition to Hide or Show Tap to Learn More Text & No Results Text
    if(!allIngVisibility) {
      tapToLearnMore.style.display = 'none';
      ingInfoContainer?.classList.add('cfm-no-data');
    } else {
      tapToLearnMore.style.display = 'block';
      ingInfoContainer?.classList.remove('cfm-no-data');
    }
  }
});

/* Function to reset ingredient search filter */
document.addEventListener('click', e => {
  if(e.target && e.target.getAttribute('data-name') === 'cfm-search-reset-icon') {
    const searchDownArrow = document.querySelector('.cfm-search-down-icon');
    const searchDropdown = document.querySelector('.cfm-search-ing-list');
    const searchInput = document.querySelector('.cfm-search-ing-input');
    const resetSearchIcon = document.querySelector('.cfm-search-reset-icon');

    resetSearchIcon?.classList.add('cfm-hide');
    searchDownArrow?.classList.remove('cfm-hide');
    searchDropdown?.classList.add('cfm-hide');
    searchInput.value = '';
    resetIngStructure();
  }
});

document.addEventListener('click', e => {
  const loader = !!document.querySelector('.cfm-hide-loader');
  if (e.target && e.target.classList.contains('cfm-tab') && loader) {
    const tabContents = document.querySelectorAll('.cfm-tab-content');
    const tabs = document.querySelectorAll('.cfm-tab');
    const targetDataName = e.target.getAttribute('data-name');
  
    tabContents.forEach(elem => elem.style.display = 'none');
    tabs.forEach(elem => elem.classList.remove('active'));

    if (targetDataName === 'cfm-ingredients-tab') {
      document.querySelector('.cfm-tab-ing-list').style.display = 'initial';
    } else if (targetDataName === 'cfm-prod-attributes-tab') {
      document.querySelector('.cfm-tab-prod-attr').style.display = 'initial';
    } else if (targetDataName === 'cfm-packaging-attr-tab') {
      document.querySelector('.cfm-tab-package-attr').style.display = 'initial';
    }
    e.target.classList.add('active');
  }  
});

// Event listener function to reset back the whole ingredient list structure on click of reset icon
function resetIngStructure() {
  const allIngredients = document.querySelectorAll('.cfm-modal-content .cfm-ing-name');
  const infoHeading = document.querySelectorAll('.cfm-info-heading');
  const ingInfoContainer = document.querySelector('.cfm-modal-content .cfm-ingredient-info-container');
  const tapToLearnMore = document.querySelector('.cfm-tap-to-learn-more');
  const accIngParent = document.querySelector('.cfm-ingredient-info-container');

  allIngredients?.length && allIngredients?.forEach(elem => elem.parentElement.style.display = 'block');
  infoHeading?.length && infoHeading?.forEach(elem => elem.style.display = 'block');
  tapToLearnMore.style.display = 'block';
  ingInfoContainer?.classList.remove('cfm-no-data');
  accIngParent.querySelector('.cfm-acc-content')?.remove();
  accIngParent.querySelector('a.cfm-active')?.classList.remove('cfm-active');
}

// Functionality to show loader for cross sell section
function showLoader(loader, sideDrawer) {
  const rect = document.querySelector('.cfm-crossSell')?.getBoundingClientRect();
  if(!!rect) {
    loader.classList.remove('cfm-hide-loader')
    let styles = `
      width: 40px;
      height: 40px;
      top: ${Math.floor(rect.top)}px;
      margin-top: 30px;
      left: ${(rect.width/2)+46}px;
    `;

    sideDrawer.style.overflowY = 'hidden';
    loader.setAttribute("style", styles);
  } else {
    loader.classList.remove('cfm-hide-loader')
    sideDrawer.style.overflowY = 'hidden';
  }
}

/* Function for the structure of error modal */
function errorModal(mssg) {
  return `
  <div id="cfm-error-modal">
    <div class="cfm-backdrop">
      <div class="cfm-error-modal">
        <div class="cfm-error-content">
          <span class="cfm-error-title">Error</span>
          <p>${mssg || 'Something went wrong.'}</p>
        </div>
        <div onclick="closeErrorModal()" class="cfm-error-dismiss">Dismiss</div>
      </div>
    </div>
  </div>`
};

function isInViewport(el) {
  const rect = el?.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // Check if at least a part of the element is visible
  const isElementVisibleVertically = rect.top <= windowHeight && rect.bottom >= 0;
  const isElementVisibleHorizontally = rect.left <= windowWidth && rect.right >= 0;

  return isElementVisibleVertically && isElementVisibleHorizontally;
}

// POST Api for feedback options Like & Dislike
function postFeedback(upc, ingredientId, response) {
  fetch('https://clickable-api.clearforme.com/api/app/feedback', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validationToken}`,
      "X-Client-Shopify": true
    },
    method: 'POST',
    body: JSON.stringify({
      upc,
      ingredientId,
      response,
    })
  }).then(response => {
    if (response.ok) {
      return;
    }
    throw response
  })
  .catch(async err => {
    const bodyTag = document.getElementsByTagName('body');
    bodyTag[0].insertAdjacentHTML('afterbegin', errorModal('Something went wrong. Please try again later.'))
    document.querySelector('.cfm-help-icons > svg.cfm-active')?.classList.remove('cfm-active','cfm-pop-animate');
  });
}

// Fetch Ingredients Details On Ing Click
async function fetchIngredientsDetails(e, activeIndex, listParent) {
  const cfmiId = e.target.getAttribute('cfmi-id');
  const productIngredientId = e.target.getAttribute('cfm-product-ingredient-id');

  if (!(cfmiId && productIngredientId)) {
    bodyTag[0].insertAdjacentHTML('afterbegin', errorModal('Please try again'))
    return;
  }

  const loader = document.getElementsByClassName('cfm-loader');

  if (!loader[0].classList.contains('cfm-hide-loader')) return;
  loader[0].classList.remove('cfm-hide-loader');

  await fetch(
    `https://clickable-api.clearforme.com/api/app/ingredients/definition/v2?clientname=${clientName}&productIngredientId=${productIngredientId}&cfmIngredientId=${cfmiId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validationToken}`,
        "X-Client-Shopify": true
      },
    }
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(data => {
      ingredientData = data;
      createAccContent(e, data, activeIndex, listParent);
      // Disabling toggling until cross sell data is being fetched
    })
    .catch(async err => {
      loader[0].classList.add('cfm-hide-loader');
      const errorData = await err.json();
      bodyTag[0].insertAdjacentHTML('afterbegin', errorModal(errorData?.error))
    });
}

// Functionality to Create Accordion Structure
async function createAccContent(e, data, activeIndex, listParent) {
  const activeElement = e.target;
  const loader = document.getElementsByClassName('cfm-loader');
  const catergoriesUrl = `https://clickable-api.clearforme.com/api/app/retailers/categories?upc=${upcVal}`;
  crossSellData = [];

  // Call Cross Sell Api Only If isCrossSellEnabled is true
  if (isCrossSellEnabled && storeUrl !== '') {
    loader[0].classList.remove('cfm-hide-loader');
    await crossSellHandles(data.productIngredientId)
    .then(res => {
      count === 0 ? showCrossSell = !!crossSellData.length : null
      crossSellData = res;
    }).catch(err => err);

    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${validationToken}`,
      "X-Client-Shopify": true
    };
    // fetching Level-1 product categories data
    productCategories = await fetch(catergoriesUrl, { headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(res => {
      previousCategory = res?.productCategory?.categoryName;
      return res
    }).catch(err => console.log(err));
  }

  loader[0].classList.add('cfm-hide-loader');

  // check if data cfmiId matches with click ing cfmiId
  if (data.cfmIngredientId === activeElement.getAttribute('cfmi-id')) {
    // create accordion structure
    const accContentStructure = `
      <div class="cfm-acc-content">
        <div class="cfm-acc-content-top-panel">
          ${data.isKeyIngredient
          ? `<figure>
              <img src="https://snippet-st1.clearforme.com/v2/assets/images/key-ingredient.svg" alt="Key Ingredient Icon" />
            </figure>`
          : ''}
          <div class="cfm-acc-content-top-right">
            <h4>${data.ingredientName}</h4>
            <ul class="cfm-inci-container">
              ${data.inci?.length
              ? `<li>
                  <span>INCI Name: </span>
                  <span>${data.inci[0]}</span>
                </li>`:''}
              ${data.commonNames?.length && data.inci?.length ? `<li class="cfm-separator">Separator</li>` : ''}
              ${data.commonNames?.length
              ? `<li>
                  <span>Common Name: </span>
                  <span>${data.commonNames[0]}</span>
                </li>`:''}
            </ul>
          </div>
        </div>
        ${data.definition
        ?`<div class="cfm-ing-def">
            <p><span>${definitionHeadingText ? definitionHeadingText : 'Definition'}</span>${data.definition}</p>
          </div>`
        : ''}
        ${Array.isArray(data.functions) && data.functions.length
        ?`<div class="cfm-ing-func">
            <p>
              <span>
                ${functionsHeadingText ? functionsHeadingText : 'Functions'} 
              </span>
              ${createAttributesStructure(data.functions)}
            </p>
          </div>`
        : ''}
        ${Array.isArray(data.qualities) && data.qualities.length
        ?`<div class="cfm-ing-quality">
            <p>
              <span>
              ${productIngredientAttributesHeadingText
                ? productIngredientAttributesHeadingText
                : 'Product Ingredient Attributes'}
              </span>
              ${createAttributesStructure(data.qualities)}
            </p>
          </div>`
        : ''}
        ${data.isKeyIngredient
        ? data.keyIngredientDescription && data.keyIngredientDescription !== ''
          ? `<div class="cfm-key-ing-note">
              <p>
                <span>
                  ${typeof keyIngDescLabelText !== 'undefined'
                    ? keyIngDescLabelText : 'Why this?'}*
                </span>
                ${data.keyIngredientDescription}
              </p>
            </div>` : ''
        : ''}
        ${data.customNote
        ?`<div class="cfm-ing-note">
            <p>
              <span>${customNoteHeadingText ? customNoteHeadingText : 'Custom Note'}*</span>
              ${data.customNote}
            </p>
          </div>`
        : ''}
        ${data.isKeyIngredient || data.customNote !== '' ? '<span class="cfm-acc-content-info-text">*Brand provided content.</span>':''}
        <div class="cfm-acc-footer">
          <div class="cfm-helpful">
            <p><span>Was this&nbsp</span>helpful?</p>
            <div class="cfm-help-icons">
              <svg data-name="cfm-thumbs-up"
                class="${retainFeedbackIcon[clickedIng?.target?.getAttribute('cfmi-id')]?.like ? 'cfm-active' : ''}" 
                xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 48 48" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">
                <title>Yes</title>
                <g><switch><g><path d="M2 44h8V20H2zm44-22c0-2.2-1.8-4-4-4H29.4l1.9-9.1c0-.2.1-.4.1-.6 0-.8-.3-1.6-.9-2.1L28.3 4 15.2 17.2c-.8.7-1.2 1.7-1.2 2.8v20c0 2.2 1.8 4 4 4h18c1.7 0 3.1-1 3.7-2.4l6-14.1c.2-.5.3-1 .3-1.5v-3.8z" fill="#000000" data-original="#000000"></path></g></switch></g>
              </svg>
              <svg data-name="cfm-thumbs-down"
                class="${retainFeedbackIcon[clickedIng?.target?.getAttribute('cfmi-id')]?.dislike ? 'cfm-active' : ''}"
                xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 48 48" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">
                <title>No</title>
                <g><switch><g><path d="M2 44h8V20H2zm44-22c0-2.2-1.8-4-4-4H29.4l1.9-9.1c0-.2.1-.4.1-.6 0-.8-.3-1.6-.9-2.1L28.3 4 15.2 17.2c-.8.7-1.2 1.7-1.2 2.8v20c0 2.2 1.8 4 4 4h18c1.7 0 3.1-1 3.7-2.4l6-14.1c.2-.5.3-1 .3-1.5v-3.8z" fill="#000000" data-original="#000000"></path></g></switch></g>
              </svg>
            </div>
          </div>
          <div class="cfm-powered-by">
            <span>Powered by </span>
            <a href="https://www.clearforme.com/" target ="_blank">
              <svg width="70" height="26" viewBox="0 0 81 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="80" height="25" rx="12.5" stroke="${poweredByLogoBorder}"/>
                <path
                  d="M16 11h-1a2.2 2.2 0 0 0-.9-1.4c-.2-.1-.4-.3-.7-.3a3 3 0 0 0-.8-.2c-.6 0-1 .2-1.5.4s-.7.7-1 1.2-.4 1.2-.4 2 .2 1.3.4 1.8.6 1 1 1.2 1 .4 1.5.4a3 3 0 0 0 .8 0l.7-.4.6-.6c.2-.2.3-.5.3-.8h1a3.5 3.5 0 0 1-.4 1.2l-.7.9-1 .5c-.4.3-.9.2-1.3.2-.8 0-1.4-.2-2-.5s-1-1-1.4-1.6-.5-1.4-.5-2.4.2-1.7.5-2.4.8-1.1 1.4-1.5 1.2-.5 2-.5l1.2.1c.4.1.7.4 1 .6l.8.9.5 1.2zm2.7-2.7V17h-1V8.3h1zm4.5 8.8c-.6 0-1.1-.1-1.6-.4s-.8-.7-1-1.2-.4-1-.4-1.7.1-1.3.4-1.8a2.9 2.9 0 0 1 1-1.2c.4-.3 1-.4 1.5-.4a3.1 3.1 0 0 1 1 .1 2.5 2.5 0 0 1 1 .6l.6 1c.2.4.3 1 .3 1.5v.5h-5v-.9h4c0-.4-.1-.7-.3-1a1.7 1.7 0 0 0-.6-.7l-1-.2c-.4 0-.7 0-1 .3a2 2 0 0 0-.7.7l-.2 1v.6c0 .5 0 1 .3 1.3s.4.6.7.8a2.1 2.1 0 0 0 1 .2h.8a1.5 1.5 0 0 0 .5-.4 1.6 1.6 0 0 0 .4-.6l1 .3-.6.9c-.3.3-.5.4-.9.5l-1.2.2zm6.2 0a2.7 2.7 0 0 1-1.1-.2 2 2 0 0 1-.8-.7 2 2 0 0 1-.3-1c0-.4 0-.7.2-1l.6-.5c.3-.1.5-.3.8-.3l1-.2.9-.1.5-.1.2-.4c0-.4-.1-.8-.3-1s-.6-.3-1-.3c-.6 0-1 0-1.2.3l-.6.6-1-.3.7-1c.2-.2.6-.3 1-.4l1-.1a4 4 0 0 1 .7 0 2.3 2.3 0 0 1 .8.3l.7.7c.2.3.2.8.2 1.3V17h-1v-.9a1.8 1.8 0 0 1-.4.5l-.6.4-1 .2zm.2-.8c.4 0 .7-.1 1-.3l.6-.6a1.5 1.5 0 0 0 .2-.8v-.9l-.3.2a4.8 4.8 0 0 1-.5 0l-.5.1h-.4l-.8.3c-.3 0-.4.1-.5.3l-.2.6c0 .3.1.6.4.8s.6.3 1 .3zm4.6.7v-6.5h1v1a1.9 1.9 0 0 1 1.7-1l.4-.1h.2v1a3 3 0 0 0-.2 0h-.4a1.8 1.8 0 0 0-.8.1 1.5 1.5 0 0 0-.6.6 1.5 1.5 0 0 0-.2.8V17h-1zm4.6 0V8.3h5.3v1h-4.2v2.9h3.8v.9h-3.8V17h-1zm9.1.1c-.6 0-1-.1-1.5-.4s-.8-.7-1-1.2-.4-1-.4-1.7 0-1.3.3-1.8a2.9 2.9 0 0 1 1-1.2c.5-.3 1-.4 1.6-.4s1.1.1 1.6.4a2.8 2.8 0 0 1 1 1.2c.3.5.4 1 .4 1.8 0 .6-.1 1.2-.4 1.7s-.6 1-1 1.2-1 .4-1.6.4zm0-.9c.5 0 .8 0 1.1-.3s.5-.5.7-1 .2-.7.2-1.1a3.5 3.5 0 0 0-.2-1.3 2 2 0 0 0-.7-.9c-.3-.2-.6-.3-1-.3s-.9 0-1.2.3a2 2 0 0 0-.6 1 3.5 3.5 0 0 0-.2 1.2c0 .4 0 .8.2 1.2s.3.7.6.9.7.3 1.1.3zm4.5.8v-6.5h1v1a1.9 1.9 0 0 1 1.7-1l.4-.1h.2v1a3 3 0 0 0-.2 0H55a1.8 1.8 0 0 0-.9.1 1.5 1.5 0 0 0-.5.6 1.5 1.5 0 0 0-.3.8V17h-1zM57 8.3h1.3l3 7.2 3-7.2h1.3V17h-1v-6.6L61.7 17h-1l-2.7-6.6V17h-1V8.3zM70.3 17c-.6 0-1.2-.1-1.6-.4s-.8-.7-1-1.2-.4-1-.4-1.7 0-1.3.3-1.8a2.9 2.9 0 0 1 1-1.2c.5-.3 1-.4 1.6-.4a3.1 3.1 0 0 1 1 .1c.4.2.7.3 1 .6l.6 1c.2.4.2 1 .2 1.5v.5h-5v-.9h4c0-.4 0-.7-.2-1a1.7 1.7 0 0 0-.6-.7l-1-.2c-.4 0-.7 0-1 .3a2 2 0 0 0-.7.7c-.2.4-.2.7-.2 1v.6c0 .5 0 1 .2 1.3s.4.6.7.8.7.2 1.1.2h.7c.2 0 .4-.3.6-.4a1.6 1.6 0 0 0 .4-.6l1 .3-.6.9c-.3.3-.5.4-.9.5l-1.2.2z"
                  fill="#333333"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>`;
    displayAccContent(
      accContentStructure,
      activeIndex,
      activeElement,
      listParent
    );
    crossSellStructure(data, crossSellData)
  }
}

// Function to Open & Close Accordion Structure
function displayAccContent(structure, activeIndex, activeElement, listParent) {
  const accContentStatus = activeElement.nextElementSibling;

  const accIngParent = document.querySelector('.cfm-ingredient-info-container');

  // if structure exists, open & close accordion else remove accordion only
  if (structure) {
    // if any accordion is open

    if (accIngParent.querySelector('.cfm-acc-content') !== null) {
      accIngParent.querySelector('.cfm-acc-content').remove();
      accIngParent.querySelector('a.cfm-active').classList.remove('cfm-active');

      // if clicked ing is not the same as previous
      listParent.insertAdjacentHTML('beforeend', structure);
      activeElement.classList.add('cfm-active');
    } else {
      // if all accordions are closed
      listParent.insertAdjacentHTML('beforeend', structure);
      activeElement.classList.add('cfm-active');
    }

    activeAcc = activeIndex + 1;
  } else {
    // only remove the accordion
    activeElement.classList.remove('cfm-active');
    accContentStatus.remove();
  }
}

// Function to create cross sell structure
function crossSellStructure(data, crossSellData) {
  const sideDrawer = document.getElementById('cfm-side-drawer-content-container');
  const loader = document.getElementsByClassName('cfm-loader')[0];
  const poweredBy = document.querySelector('.cfm-acc-content .cfm-acc-footer');
  const crossSell = document.querySelector('.cfm-crossSell-feature');
  count++;
  const crossSellList = `
  <div class="cfm-crossSell-feature">
  ${isCrossSellEnabled
    ? `<div class="cfm-crossSell-toggle">
        <span>Have a concern with <small>${data?.ingredientName}</small>? Toggle <small>"Yes"</small> to discover products without <small>${data?.ingredientName}</small></span>
        <div class="cfm-toggle-option">
        <label class="cfm-toggle-switch">
          <input class="cfm-switch-input" type="checkbox" id="cfm-toggle-input" data-name="cfm-crossSell-toggle-input" ${inverseCrossSell?'checked':''} />
          <span class="cfm-switch-label" data-on="Yes" data-off="No">
          </span>
          <span class="cfm-switch-handle"></span>
        </label>
        </div>
      </div>
      ${crossSellData.length || inverseCrossSell || showCrossSell
      ? `<div class="cfm-product-filter">
          <h3>Products that ${inverseCrossSell?"don't":''} contain <span>${data?.ingredientName}</span></h3>
          <div class="cfm-select-box">
            <ul class="cfm-options-container">
              ${productCategories?.categories?.map(e => `<li title="${e.name}" class="${previousCategory?.trim()?.toLowerCase() === e.name?.trim()?.toLowerCase() ?'cfm-pre-selected':''}" data-name="cfm-category-option" data-category-id="${e._id}">${e.name}</li>`).join('')}
            </ul>
            <div class="cfm-selected" data-name="cfm-category-filter" title="${previousCategory?.trim()?.length?previousCategory:''}">
              ${previousCategory?.trim()?.length ? previousCategory : (
                productCategories?.productCategory?.categoryName ? productCategories?.productCategory?.categoryName : 'Discover by category'
              )}
            </div>
          </div>
        </div>`: ''}
      `
    : ''}
  ${crossSellData.length
    ? `<div class="cfm-crossSell">
        <ul class="cfm-crossSell-list">
          ${createCrossSellList(crossSellData, storeUrl)}
        </ul>
      </div>`
    : `${inverseCrossSell?`<h4>Unfortunately, we couldn't find any products that ${inverseCrossSell?"don't":''} contain <span>${data.ingredientName}</span>. Please check back later.</h4>`:''}`}
    </div>`;

  loader.classList.add('cfm-hide-loader');
  sideDrawer.style.overflowY = 'scroll';

  if(!!crossSell) {
    crossSell.remove();
  }
  
  poweredBy.insertAdjacentHTML('beforebegin', `${crossSellList}`)
  return '';
}

// crossSellProducts()
async function crossSellHandles(clickedIngId) {
  const sku = document.getElementById('cfm-sku').innerText;
  const handlesData = [];

  const handleUrl = `https://clickable-api.clearforme.com/api/app/products?ingredientId=${clickedIngId}&sku=${sku}&clientname=${clientName}${categoryId?.trim()?.length?`&category=${categoryId}`:''}&page=1&excludeIngredient=${inverseCrossSell}&limit=6`;

  const headers = {
    'Content-type': 'application/json',
    Authorization: `Bearer ${validationToken}`,
    "X-Client-Shopify": true
  };

  // Get Handles API
  const myHandles = await fetch(handleUrl, { headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(res => res.docs)
    .catch(async err => {
      //Handle the error
      const errorData = await err.json();
      bodyTag[0].insertAdjacentHTML('afterbegin', errorModal(errorData?.error))
    });

  // If Handles has length then Fetch Product Details
  if (myHandles.length) {
    for (const handleName of myHandles) {
      const productUrl = `${storeUrl}${handleName.handle}.json`;
      try {
        await fetch(productUrl)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw response;
          })
          .then(res => handlesData.push(res))
          .catch(async err => {
            //Handle the error
            const errorData = await err.json();
            bodyTag[0].insertAdjacentHTML('afterbegin', errorModal(errorData?.error))
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  return handlesData;
}

// Function to create crossSell Structure
function createCrossSellList(crossSellData, storeUrl) {
  const loader = document.getElementsByClassName('cfm-loader');
  let crossSellStructure = '';
  crossSellData.forEach((item, i) => {
    crossSellStructure += `
      <li>
        <a href="${storeUrl}/${item.product.handle}" target="_blank">
        <figure>
          <img src=${item.product.images.length
        ? item.product.images[0].src
        : 'https://via.placeholder.com/120'
      } alt="Product ${i}" />
        </figure>
        <p>${item.product.title ? item.product.title : 'Untitled'}</p>
        <span>$${item.product.variants[0].price}</span>
        </a>
      </li>`;
  });

  loader[0].removeAttribute('style');
  return crossSellStructure;
}

//Create Attributes and functions structure
function createAttributesStructure(attributesList) {

  const list =
    Array.isArray(attributesList) &&
    attributesList.length &&
    attributesList.map(item => item.attribute).join(', ');
  return list;
}

/* Function to close the error modal */
function closeErrorModal() {
  const errorModalBackdrop = document.getElementById('cfm-error-modal');
  const errorModal = document.querySelector('.cfm-error-modal');
  if(errorModal) {
    errorModal.classList.add('cfm-hide');
    setTimeout(() => {
      errorModalBackdrop.remove();
      deleteUrlParam();
    }, 500);
  }

  const bodyTag = document.getElementsByTagName('body');
  if (bodyTag && bodyTag[0]) bodyTag[0].classList.remove('cfm-stop-scroll');
}

/*===================================
  Ingredient Modal script logic ends here
/*===================================*/

/*===================================
  Side Drawer Modal script logic
/*===================================*/

/*Function to close the modal*/
function closeModal() {
  const sideDrawer = document.getElementById('cfm-side-drawer');
  if (sideDrawer) {
    if (sideDrawerDirection.trim() === 'right') sideDrawer.classList.add('cfm-hide-right-drawer');
    else sideDrawer.classList.add('cfm-hide-left-drawer');

    setTimeout(() => sideDrawer.remove(), 300);
    deleteUrlParam();
  }
  const bodyTag = document.getElementsByTagName('body');
  if (bodyTag && bodyTag[0]) {
    bodyTag[0].classList.remove('cfm-stop-scroll');
  }
}

/* Function to delete param clearforme */
function deleteUrlParam() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('clearforme')) {
    urlParams.delete('clearforme');
    let searchString = urlParams.toString().length > 1 ? '?' + urlParams.toString() : '';
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + searchString;
    window.history.replaceState({}, '', newurl);
  }
}

/*Function to create the ingredient component HTML structure*/
function createIngStructure(ingredients) {
  let ingContainer = document.createElement('ul');

  Array.isArray(ingredients) &&
    ingredients.length &&
    ingredients.map(ingredient => {
      const {
        ingredientName,
        cfmIngredientId,
        productIngredientId,
        specialCharacter,
      } = ingredient;

      let ingList = document.createElement('li');
      let ingName = document.createElement('a');
      ingName.textContent = ingredientName;
      ingContainer.setAttribute('class', 'cfm-ing-list');
      ingName.setAttribute('data-id', 'cfm-ing-list');
      ingName.setAttribute('cfmi-id', cfmIngredientId);
      ingName.setAttribute('cfm-product-ingredient-id', productIngredientId);
      ingName.setAttribute('class', 'cfm-ing-name');
      ingName.setAttribute('href', '#');

      if (specialCharacter) {
        let specialChar = document.createElement('sup');
        specialChar.textContent = specialCharacter;

        ingName.appendChild(specialChar);
      }

      ingName.addEventListener('click', productIngredientId =>
        handleIngredientClick(productIngredientId)
      );
      ingList.appendChild(ingName);
      ingContainer.appendChild(ingList);
    });

  return ingContainer.outerHTML;
}

/*Function to fetch the product informations*/
async function fetchProductsInfo(skuVal = '') {
  const loader = document.getElementsByClassName('cfm-loader');

  let sku;

  if (loader) {
    loader[0].classList.remove('cfm-hide-loader');
  }

  if (skuVal) {
    sku = skuVal
  } else {
    sku = document.getElementById('cfm-sku').innerText;
  }

  const getIconVal = attributeIcons === 'yes' ? 'true' : 'false';
  const response = await fetch(
    `https://clickable-api.clearforme.com/api/app/products/details/v2?clientname=${clientName}&getIcons=${getIconVal}&sku=${sku}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validationToken}`,
        "X-Client-Shopify": true
      },
    }
  );

  if (loader) {
    loader[0].classList.add('cfm-hide-loader');
  }

  const ingredients = await response.json();
  if (!response.ok) {
    if(response.status === 403) throw response;
    else throw ingredients;
  }
  return ingredients;
}

/*Function to handle Ingredient CTA click and create the DOM structure if needed*/
async function handleButtonClick(skuVal = '') {
  const urlParams = new URLSearchParams(window.location.search);
  const modal = document.getElementById('cfm-side-drawer');
  const loader = document.getElementsByClassName('cfm-loader');
  retainFeedbackIcon = {};

  if (!urlParams.has('clearforme')) {
    urlParams.set('clearforme', 'true');
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams.toString();
    window.history.replaceState({}, '', newurl);
  }

  if (
    modal ||
    (loader && loader[0] && loader[0].classList.contains('cfm-hide-loader'))
  )
    return;

  let sideDrawer = document.createElement('div');
  sideDrawer.setAttribute('id', 'cfm-side-drawer');
  sideDrawer.setAttribute('class', `cfm-default-container cfm-side-drawer ${sideDrawerDirection && sideDrawerDirection.trim() !== 'left' ? 'cfm-right' : 'cfm-left'}`);

  const ingMarkup = `
    <div id="cfm-side-drawer-content-container" class="cfm-side-drawer-content">
      <div class="cfm-loader">Loader</div>
    </div>
  `;

  const bodyTag = document.getElementsByTagName('body');
  sideDrawer.innerHTML += ingMarkup;
  bodyTag[0].appendChild(sideDrawer);

  fetchProductsInfo(skuVal)
    .then(data => {
      const parentContainer = document.getElementById('cfm-side-drawer-content-container');
      let packageAttrIconListStructure = '';
      let productAttrIconListStructure = '';
      const { productDetails, productIngredients } = data;
      isCrossSellEnabled = data.isCrossSellEnabled;
      storeUrl = data.storeUrl;
      upcVal = productDetails?.upc;

      //create a main parent
      let productInfoDiv = document.createElement('div');
      productInfoDiv.setAttribute('id', 'cfm-modal-content');
      productInfoDiv.setAttribute('class', 'cfm-modal-content');

      //Create Product attribute list
      const productAttributeList =
        Array.isArray(productDetails.productAttributes) &&
        productDetails.productAttributes.length ?
        productDetails.productAttributes.map(item => {
          return {
            attr: item.attribute,
            iconUrl: item.iconUrl,
            definition: item.definition,
          }
        }) : null;

      //Create Package attribute list
      const packagingAttributeList =
        Array.isArray(productDetails.packagingAttributes) &&
        productDetails.packagingAttributes.length ?
        productDetails.packagingAttributes.map(item => {
          return {
            attr: item.attribute,
            iconUrl: item.iconUrl,
            definition: item.definition,
          }
        }) : null;

      let topPanelStructure = `
        <div class="cfm-top-panel">
          <div class="cfm-top-panel-header">
            <div class="cfm-powered-by">
              <span>Powered by </span>
              <a href="https://www.clearforme.com/" target ="_blank">
                <svg width="80" height="26" viewBox="0 0 81 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="80" height="25" rx="12.5" stroke="${poweredByLogoBorder}"/>
                  <path
                    d="M16 11h-1a2.2 2.2 0 0 0-.9-1.4c-.2-.1-.4-.3-.7-.3a3 3 0 0 0-.8-.2c-.6 0-1 .2-1.5.4s-.7.7-1 1.2-.4 1.2-.4 2 .2 1.3.4 1.8.6 1 1 1.2 1 .4 1.5.4a3 3 0 0 0 .8 0l.7-.4.6-.6c.2-.2.3-.5.3-.8h1a3.5 3.5 0 0 1-.4 1.2l-.7.9-1 .5c-.4.3-.9.2-1.3.2-.8 0-1.4-.2-2-.5s-1-1-1.4-1.6-.5-1.4-.5-2.4.2-1.7.5-2.4.8-1.1 1.4-1.5 1.2-.5 2-.5l1.2.1c.4.1.7.4 1 .6l.8.9.5 1.2zm2.7-2.7V17h-1V8.3h1zm4.5 8.8c-.6 0-1.1-.1-1.6-.4s-.8-.7-1-1.2-.4-1-.4-1.7.1-1.3.4-1.8a2.9 2.9 0 0 1 1-1.2c.4-.3 1-.4 1.5-.4a3.1 3.1 0 0 1 1 .1 2.5 2.5 0 0 1 1 .6l.6 1c.2.4.3 1 .3 1.5v.5h-5v-.9h4c0-.4-.1-.7-.3-1a1.7 1.7 0 0 0-.6-.7l-1-.2c-.4 0-.7 0-1 .3a2 2 0 0 0-.7.7l-.2 1v.6c0 .5 0 1 .3 1.3s.4.6.7.8a2.1 2.1 0 0 0 1 .2h.8a1.5 1.5 0 0 0 .5-.4 1.6 1.6 0 0 0 .4-.6l1 .3-.6.9c-.3.3-.5.4-.9.5l-1.2.2zm6.2 0a2.7 2.7 0 0 1-1.1-.2 2 2 0 0 1-.8-.7 2 2 0 0 1-.3-1c0-.4 0-.7.2-1l.6-.5c.3-.1.5-.3.8-.3l1-.2.9-.1.5-.1.2-.4c0-.4-.1-.8-.3-1s-.6-.3-1-.3c-.6 0-1 0-1.2.3l-.6.6-1-.3.7-1c.2-.2.6-.3 1-.4l1-.1a4 4 0 0 1 .7 0 2.3 2.3 0 0 1 .8.3l.7.7c.2.3.2.8.2 1.3V17h-1v-.9a1.8 1.8 0 0 1-.4.5l-.6.4-1 .2zm.2-.8c.4 0 .7-.1 1-.3l.6-.6a1.5 1.5 0 0 0 .2-.8v-.9l-.3.2a4.8 4.8 0 0 1-.5 0l-.5.1h-.4l-.8.3c-.3 0-.4.1-.5.3l-.2.6c0 .3.1.6.4.8s.6.3 1 .3zm4.6.7v-6.5h1v1a1.9 1.9 0 0 1 1.7-1l.4-.1h.2v1a3 3 0 0 0-.2 0h-.4a1.8 1.8 0 0 0-.8.1 1.5 1.5 0 0 0-.6.6 1.5 1.5 0 0 0-.2.8V17h-1zm4.6 0V8.3h5.3v1h-4.2v2.9h3.8v.9h-3.8V17h-1zm9.1.1c-.6 0-1-.1-1.5-.4s-.8-.7-1-1.2-.4-1-.4-1.7 0-1.3.3-1.8a2.9 2.9 0 0 1 1-1.2c.5-.3 1-.4 1.6-.4s1.1.1 1.6.4a2.8 2.8 0 0 1 1 1.2c.3.5.4 1 .4 1.8 0 .6-.1 1.2-.4 1.7s-.6 1-1 1.2-1 .4-1.6.4zm0-.9c.5 0 .8 0 1.1-.3s.5-.5.7-1 .2-.7.2-1.1a3.5 3.5 0 0 0-.2-1.3 2 2 0 0 0-.7-.9c-.3-.2-.6-.3-1-.3s-.9 0-1.2.3a2 2 0 0 0-.6 1 3.5 3.5 0 0 0-.2 1.2c0 .4 0 .8.2 1.2s.3.7.6.9.7.3 1.1.3zm4.5.8v-6.5h1v1a1.9 1.9 0 0 1 1.7-1l.4-.1h.2v1a3 3 0 0 0-.2 0H55a1.8 1.8 0 0 0-.9.1 1.5 1.5 0 0 0-.5.6 1.5 1.5 0 0 0-.3.8V17h-1zM57 8.3h1.3l3 7.2 3-7.2h1.3V17h-1v-6.6L61.7 17h-1l-2.7-6.6V17h-1V8.3zM70.3 17c-.6 0-1.2-.1-1.6-.4s-.8-.7-1-1.2-.4-1-.4-1.7 0-1.3.3-1.8a2.9 2.9 0 0 1 1-1.2c.5-.3 1-.4 1.6-.4a3.1 3.1 0 0 1 1 .1c.4.2.7.3 1 .6l.6 1c.2.4.2 1 .2 1.5v.5h-5v-.9h4c0-.4 0-.7-.2-1a1.7 1.7 0 0 0-.6-.7l-1-.2c-.4 0-.7 0-1 .3a2 2 0 0 0-.7.7c-.2.4-.2.7-.2 1v.6c0 .5 0 1 .2 1.3s.4.6.7.8.7.2 1.1.2h.7c.2 0 .4-.3.6-.4a1.6 1.6 0 0 0 .4-.6l1 .3-.6.9c-.3.3-.5.4-.9.5l-1.2.2z"
                    fill="#333333"
                  />
                </svg>
              </a>
            </div>
            <div class="cfm-close-icon-container">
              <span
                title="Close"
                class="cfm-close-side-drawer"
                onclick="closeModal()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
                  <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" style="stroke: #333; stroke-width: 2;"></path>
                </svg>
              </span>
            </div>
          </div>
          <h4>${productDetails.productName}</h4>
          ${productAttributeList?.length || packagingAttributeList?.length || productDetails?.customNote !== ""
            ?`<ul class="cfm-tabs-list">
                ${productIngredients?.length ? `<li><span title='Ingredients' data-name='cfm-ingredients-tab' class="active cfm-tab">Ingredients</span></li>` : ''}
                ${productAttributeList?.length
                  ?`<li>
                      <span title='Product Attributes' data-name='cfm-prod-attributes-tab' class='cfm-tab'>
                        ${typeof productAttributesHeadingText !== 'undefined'
                          ? productAttributesHeadingText : 'Product Attributes'}
                      </span>
                    </li>` : ''}
                ${packagingAttributeList?.length || productDetails?.customNote !== ""
                  ?`<li>
                      <span title='Sustainable Packaging' data-name='cfm-packaging-attr-tab' class='cfm-tab'>
                        ${typeof packagingAttributesHeadingText !== 'undefined'
                          ? packagingAttributesHeadingText : 'Sustainable Packaging'}
                      </span>
                    </li>` : ''}
              </ul>`
            : ''}
        </div>
      `;

    parentContainer.insertAdjacentHTML('beforeend', topPanelStructure);

    //Create Components List
    const showHideComponentName = productIngredients.length === 1 && productIngredients[0].component.trim().toLowerCase() === productDetails.productName.trim().toLowerCase() ? false : true;
    const productIngredientsList =
      Array.isArray(productIngredients) &&
      productIngredients.length &&
      productIngredients
        .map(item => {
          const { component, ingredientGroup } = item;
          return `
              ${item.component
              ? `<div class='cfm-ingredient-componet-container'>
                  ${showHideComponentName ? 
                    `<span class="${mainBgColor === componentBgColor?'cfm-reduce-component-margin':''} 
                      component-name cfm-info-heading ${!showHideComponentName?'cfm-hide':''}">
                      ${component}
                    </span>`: ''}
                ${Array.isArray(ingredientGroup) &&
              ingredientGroup.length &&
              ingredientGroup
                .map(ingredientGroupList => {
                  return `<div class="cfm-function-group-container">
                            <span class="cfm-info-heading">${ingredientGroupList.ingredientGroupName}</span>
                            ${createIngStructure(ingredientGroupList.ingredients)}
                          </div>`;
                }).join('')
              }
                  </div>`
              : null
            }`;
        })
        .join('');

    // Creating product attribute list icon structure if attribute is set to yes
    if(attributeIcons === 'yes') {
      productAttributeList?.forEach(elem => {
        productAttrIconListStructure += `<li title='${elem?.definition ? elem.definition : elem?.attr}'>
          <img onerror="this.src='https://snippet-st1.clearforme.com/v2/assets/images/generic-beauty-products.svg'"
            src="${elem?.iconUrl}" alt='svg' height='26' />
          <span>${elem?.attr}</span>
        </li>`;
      });

      // Creating packaging attribute list icon structure
      packagingAttributeList?.forEach(elem => {
        packageAttrIconListStructure += `<li title='${elem?.definition ? elem.definition : elem?.attr}'>
          <img onerror="this.src='https://snippet-st1.clearforme.com/v2/assets/images/generic-beauty-products.svg'"
            src="${elem?.iconUrl}" alt='svg' height='26' />
          <span>${elem?.attr}</span>
        </li>`;
      });
    }

    //add the entire markup for the side drawer
    let markup = `
      <div class="cfm-tab-ing-list cfm-tab-content">
        <div class="cfm-search-filter">
          <svg class="cfm-search-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 48 48" style="enable-background:new 0 0 512 512" xml:space="preserve">
            <g><path d="m40.285 37.46-6.486-6.486a14.738 14.738 0 0 0 3.044-8.988c0-3.97-1.546-7.701-4.353-10.508a14.763 14.763 0 0 0-10.508-4.353c-3.969 0-7.7 1.546-10.508 4.353-5.793 5.794-5.793 15.222 0 21.016a14.762 14.762 0 0 0 10.508 4.353c3.294 0 6.415-1.079 8.989-3.045l6.486 6.487c.39.39.902.586 1.414.586s1.024-.196 1.414-.586a2 2 0 0 0 0-2.829zm-25.982-7.794c-4.235-4.235-4.234-11.125 0-15.36a10.792 10.792 0 0 1 7.68-3.18 10.79 10.79 0 0 1 7.679 3.18 10.79 10.79 0 0 1 3.181 7.68c0 2.901-1.13 5.628-3.181 7.68s-4.778 3.18-7.68 3.18c-2.9 0-5.628-1.13-7.68-3.18z" fill="#666666" data-original="#000000"></path></g>
          </svg>
          <input class="cfm-search-ing-input" type="text" placeholder="Search for an ingredient" data-name="cfm-search-ing-input" />
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" class="cfm-search-down-icon" data-name="cfm-search-down-icon" width="512" height="512" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve">
            <g><path d="M64 88a3.988 3.988 0 0 1-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0L64 78.344l37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40A3.988 3.988 0 0 1 64 88z" fill="#666666" data-original="#000000"></path></g>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" data-name="cfm-search-reset-icon" class="cfm-search-reset-icon cfm-hide" width="512" height="512" x="0" y="0" viewBox="0 0 32 32" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">
            <g data-name="cfm-search-reset-icon"><path data-name="cfm-search-reset-icon" d="m17.414 16 6.293-6.293a1 1 0 0 0-1.414-1.414L16 14.586 9.707 8.293a1 1 0 0 0-1.414 1.414L14.586 16l-6.293 6.293a1 1 0 1 0 1.414 1.414L16 17.414l6.293 6.293a1 1 0 0 0 1.414-1.414z" fill="#666666" data-original="#000000"></path></g>
          </svg>
          <svg class="cfm-search-loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="27.5" cy="57.5" r="5" fill="#6a6a6a">
              <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.6s"></animate>
            </circle> <circle cx="42.5" cy="57.5" r="5" fill="#979797">
              <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.44999999999999996s"></animate>
            </circle> <circle cx="57.5" cy="57.5" r="5" fill="#bdbdbd">
              <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.3s"></animate>
            </circle> <circle cx="72.5" cy="57.5" r="5" fill="#e2e2e2">
              <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.15s"></animate>
            </circle>
          </svg>
          <ul class="cfm-search-ing-list cfm-hide">
            <p>The searched ingredient is not found in this product.</p>
          </ul>
        </div>
        <p class="cfm-tap-to-learn-more">Click or Tap an Ingredient To Learn More</p>
        <div class="cfm-ingredient-info-container">
          <p class="cfm-no-ing-error-mssg">We couldn't find the ingredient you searched for in the product. Please check your spelling or try a different ingredient.</p>
          ${productIngredientsList}
        </div>
        ${productDetails.additionalDetails
          ? `<div class="additional-details-contianer-cfm">
              <span class="cfm-info-heading">${additionalDetailsHeadingText ? additionalDetailsHeadingText : 'Additional Details'}</span>
              <div class="additional-details-content-cfm">
                ${productDetails.additionalDetails}
              </div>
          </div>
        `: ''}
      </div>
      <div class="cfm-tab-prod-attr cfm-tab-content">
        ${productAttributeList
          ? (!!attributeIcons && attributeIcons === 'yes'
            ? `<div class='cfm-product-attr-with-icons'>
                <span class='cfm-info-heading'>
                  ${typeof productAttributesHeadingText !== 'undefined'
                    ? productAttributesHeadingText : 'Product Attributes'}
                </span>
                <ul class='cfm-product-attr-icons-list'>
                  ${productAttrIconListStructure}
                </ul>
              </div>`
            : `<div class='cfm-product-attributes'>
                <span class='cfm-info-heading'>
                  ${typeof productAttributesHeadingText !== 'undefined'
                    ? productAttributesHeadingText : 'Product Attributes'}
                </span>
                <span class='cfm-product-attribute-list'>
                  ${productAttributeList.map(el => el.attr).join(', ')}
                </span>
              </div>`)
          : ''}
        </div>
        <div class="cfm-tab-package-attr cfm-tab-content">
          ${packagingAttributeList
          ? (!!attributeIcons && attributeIcons === 'yes'
            ? `<div class='cfm-packaging-attr-with-icons'>
                <span class='cfm-info-heading'>
                  ${typeof packagingAttributesHeadingText !== 'undefined'
                    ? packagingAttributesHeadingText : 'Sustainable Packaging'}
                </span>
                <ul class='cfm-packaging-attr-icons-list'>
                  ${packageAttrIconListStructure}
                </ul>
              </div>`
            : `<div class='cfm-packaging-attributes'>
                <span class='cfm-info-heading'>
                  ${typeof packagingAttributesHeadingText !== 'undefined'
                    ? packagingAttributesHeadingText : 'Sustainable Packaging'}
                </span>
                <span class='cfm-packaging-attribute-list'>
                  ${packagingAttributeList.map(el => el.attr).join(', ')}
                </span>
              </div>`)
          : ''}
          ${productDetails.customNote
            ? `<div class="additional-details-contianer-cfm">
                <div class="cfm-recycling-label">
                  <span class="cfm-info-heading">
                    ${typeof recyclingDisposalInstructionText !== 'undefined'
                      ? recyclingDisposalInstructionText : 'Recycling / Disposal Instructions'}
                  </span>
                  <small>Horizontal Seperator</small>
                </div>
                <div class="additional-details-content-cfm">
                  ${productDetails.customNote}
                </div>
            </div>
          `: ''}
        </div>`;

    productInfoDiv.innerHTML = markup;
    
    if (bodyTag && bodyTag[0]) {
      bodyTag[0].classList.add('cfm-stop-scroll');
    }

    parentContainer.appendChild(productInfoDiv);
  })
  .catch(err => {
    loader[0].classList.add('cfm-hide-loader');
    sideDrawer.remove();
    bodyTag[0].insertAdjacentHTML('afterbegin', errorModal(err?.error));
  });
}