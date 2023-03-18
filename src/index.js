import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

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
  e.preventDefault();

  const input = e.target;
  const searchQuery = input.value.trim();

  if (searchQuery) {
    fetchCountries(searchQuery).then(renderMarkup).catch(onFetchError);
  } else {
    // динамічне видалення розмітки
    refs.countryList.innerHTML = '';
    refs.countryBox.innerHTML = '';
  }
}

// Створення розмітки
function renderMarkup(result) {
  if (result.length > 10) {
    refs.countryList.innerHTML = ''; // динамічне видалення розмітки

    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (result.length <= 10 && result.length != 1) {
    refs.countryBox.innerHTML = ''; // динамічне видалення розмітки

    const markupCoutryItem = createCountryItemTpl(result); // створення розмітки
    refs.countryList.innerHTML = markupCoutryItem; // динамічне додавання розмітки
  } else {
    refs.countryList.innerHTML = ''; // динамічне видалення розмітки

    const markupCountryCard = createCountryCardTpl(result); // створення розмітки
    refs.countryBox.innerHTML = markupCountryCard; // динамічне додавання розмітки
  }
}

// Створення списку країн
function createCountryItemTpl(array) {
  return array
    .map(
      ({ name, flags }) =>
        `<li class="country-item"><img class="country-flag" width="30" height="24" src="${flags.svg}" alt="${flags.alt}">${name.official}</li>`
    )
    .join('');
}

// Створення карточки країни
function createCountryCardTpl(array) {
  const cardMarkup = array
    .map(({ name, capital, population, flags, languages }) => {
      // languages - це обʼєкт, який мість: ключі (коди мов) та їх значення (назви мови)
      // витягуємо назву кожної мови з обʼєкта
      const keys = Object.keys(languages);
      const languageArray = [];

      for (const key of keys) {
        languageArray.push(`<li class="langueges-item">${languages[key]}</li>`);
      }

      const languageItems = languageArray.join('');

      return `<h1 class="country-name"><img class="country-flag" width="30" height="24" src="${flags.svg}" alt="${flags.alt}">${name.official}</h1><ul class="description-list list"><li class="description-item"><h2 class="description-title">Capital: </h2><span>${capital}</span></li><li class="description-item"><h2 class="description-title">Population: </h2><span>${population}</span></li><li class="description-item"><h2 class="description-title">Languages: </h2><ul class="language-list">${languageItems}</ul></li></ul>`;
    })
    .join('');

  return cardMarkup;
}

function onFetchError() {
  Notify.failure('Oops, there is no country with that name');
}
