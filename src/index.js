import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

// Налаштування сповіщень
export const notiflixOptions = {
  width: '330px',
  fontSize: '16px',
  position: 'right-top',
  timeout: 2000,
};

// Посилання на елементи
const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryBox: document.querySelector('.country-info'),
};

// Слухач подій
refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// Пошук країни
function onSearch(e) {
  removeMarkup(); // динамічне видалення розмітки

  const input = e.target;
  const searchQuery = input.value.trim();

  if (searchQuery) {
    fetchCountries(searchQuery).then(renderMarkup).catch(onFetchError);
  } else {
    removeMarkup(); // динамічне видалення розмітки
  }
}

// Створення розмітки
function renderMarkup(result) {
  if (result.length > 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.',
      notiflixOptions
    );
  } else if (result.length <= 10 && result.length != 1) {
    createCountryItemTpl(result); // створення розмітки
  } else {
    createCountryCardTpl(result); // створення розмітки
  }
}

// Створення списку країн
function createCountryItemTpl(array) {
  const markupCoutryItem = array
    .map(
      ({ name, flags }) =>
        `<li class="country-item"><img class="country-flag" width="35" height="30" src="${flags.svg}" alt="Flag of ${name.official}"><p>${name.official}</p></li>`
    )
    .join('');

  refs.countryList.innerHTML = markupCoutryItem; // динамічне додавання розмітки
}

// Створення карточки країни
function createCountryCardTpl(array) {
  // const createLanguageList = Object.values(languages).map(language=>`<li class="language-item">${language}</li>`).join('');
  // + в cardMarkup додати <ul class="language-list">${createLanguageList}</ul>

  const cardMarkup = array
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<h1 class="country-name"><img class="country-flag" width="40" height="34" src="${
          flags.svg
        }" alt="Flag of ${name.official}"><p>${
          name.official
        }</p></h1><ul class="description-list list"><li class="description-item"><h2 class="description-title">Capital: </h2><p>${capital}</p></li><li class="description-item"><h2 class="description-title">Population: </h2><p>${population}</p></li><li class="description-item"><h2 class="description-title">Languages: </h2><p class="languages-list">${Object.values(
          languages
        ).join(', ')}</p></li></ul>`
    )
    .join('');

  refs.countryBox.innerHTML = cardMarkup; // динамічне додавання розмітки
}

function removeMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryBox.innerHTML = '';
}

function onFetchError() {
  Notify.failure('Oops, there is no country with that name', notiflixOptions);
}
