import packageJson from '../../package.json';
import config from '../discovery/config';

const ACTIVATION_KEYCODE = 77; // 'M' key or 'B' key for Windows
const ACTIVATION_KEYCODE_WINDOWS = 66; // 'M' key or 'B' key for Windows
const ESC_KEYCODE = 27;
const NAV_STATE_STORAGE_KEY = `bedrock.${packageJson.name}.prototypeNavState`;

let navState = {
  isOpen: false,
  closedModules: [],
  langSelected: config.languages && config.languages.find((lang) => lang.default).id
};

const html = document.documentElement;
const prototypeNav = document.querySelector('#__prototype-nav');
const moduleLabels = prototypeNav.querySelectorAll('.br-tree-dir-title');

try {
  const savedState = JSON.parse(localStorage.getItem(NAV_STATE_STORAGE_KEY));
  navState = Object.assign({}, navState, savedState);
} catch (err) {
  console.warn('There was an error parsing the saved state for the prototype navigation.');
}

// Set up unique IDs for all module titles
moduleLabels.forEach(function (element) {
  element.setAttribute('id', element.innerText.split(' ').join('-'));
});

/**
 * Closes a module based on ID.
 */
function closeModule(moduleId) {
  document
    .getElementById(moduleId)
    .parentElement
    .classList
    .add('br-tree-dir--is-collapsed');

  if(navState.closedModules.indexOf(moduleId) === -1) {
    navState.closedModules.push(moduleId);
  }
}

/**
 * Opens a module based on ID.
 */
function openModule(moduleId) {
  document
    .getElementById(moduleId)
    .parentElement
    .classList
    .remove('br-tree-dir--is-collapsed');

  navState.closedModules = navState.closedModules.filter(
    (id) => id !== moduleId
  );
}

/**
 * Determines whether to close or open a module, and then saves the state.
 */
function toggleModule(moduleId) {
  const isClosed = document
    .getElementById(moduleId)
    .parentElement.classList.contains('br-tree-dir--is-collapsed');

  if (isClosed) {
    openModule(moduleId);
  } else {
    closeModule(moduleId);
  }
  saveNavState();
}

/**
 * Set up listener for module title clicks.
 */
moduleLabels.forEach(function (element) {
  element.addEventListener('click', function () {
    toggleModule(element.id);
  })
});

// Handle state on page load: open/close nav and close saved modules
if (navState.isOpen) {
  openNavigation();
}

if (navState.closedModules.length > 0) {
  navState.closedModules.forEach(moduleId => closeModule(moduleId));
}

function saveNavState() {
  localStorage.setItem(NAV_STATE_STORAGE_KEY, JSON.stringify(navState));
}

function openNavigation() {
  prototypeNav.classList.add('br-prototype-nav-open')
  prototypeNav.setAttribute('aria-hidden', 'false');
  html.classList.add('br-prototype-nav-is-open');
  navState.isOpen = true;
  saveNavState();
}

function closeNavigation() {
  prototypeNav.classList.remove('br-prototype-nav-open');
  html.classList.remove('br-prototype-nav-is-open');
  prototypeNav.setAttribute('aria-hidden', 'true');
  navState.isOpen = false;
  saveNavState();
}

function toggleNavigation() {
  navState.isOpen ? closeNavigation() : openNavigation();
}

document.querySelectorAll('.br-prototype-close-nav').forEach(function(element) {
  element.addEventListener('click', function(e) {
    e.preventDefault();
    closeNavigation();
  })
})

window.addEventListener('keyup', function (e) {
  if (e.keyCode === ESC_KEYCODE ) {
    closeNavigation();
  }
  else if (e.ctrlKey && (e.keyCode == ACTIVATION_KEYCODE || e.keyCode == ACTIVATION_KEYCODE_WINDOWS)) {
    toggleNavigation();
  }
});
