import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { notiflixOptions } from '../index';

const BASE_URL = 'https://restcountries.com/v3.1';

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw Notify.failure(`Error! Status ${response.status}`, notiflixOptions);
    }
    return response.json();
  });
}

// export function fetchCountries(name) {
//   return fetch(
//     `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`
//   ).then(response => {
//     if (response.status === 404) {
//       Notify.failure('Oops, there is no country with that name');
//     } else {
//       return response.json();
//     }
//   });
// }
