import './css/styles.css';
import debounce from 'lodash.debounce';
import searchCountry from '../src/fetchCountries';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  searchCountry.fetchCountries(inputEl.value).then(renderCountryList).catch(onFetchError);
}
function renderCountryList(countries) {
  listEl.innerHTML = '';
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countries.length === 1) {
    return listEl.insertAdjacentHTML('beforeend', oneCountryMarkup(countries[0]));
  }

  return listEl.insertAdjacentHTML('beforeend', manyCountriesMarkup(countries));
}

function oneCountryMarkup(country) {
  const { name, capital, population, flags, languages } = country;
  return `<li class ="country-descr">
      <h1 class="country-name">
        <img class="country-flag" src="${flags.svg}" alt="${name.official}"/> ${name.official}
      </h1>
    </li>
    <li class="country-elem">Capital:
      <p class="country-text" > ${capital}</p>
    </li>
    <li class="country-elem">Population:
      <p class="country-text"> ${population}</p>
    </li>
    <li class="country-elem">Languages:
      <p class="country-text"> ${Object.values(languages)}</p>
    </li>
  `;
}

function manyCountriesMarkup(countries) {
  return countries
    .map(
      ({ name, flags }) => `
        <li class="countries-elem"> <img class="countries-flag" src="${flags.svg}" alt="${name}">
        <p class="countries-text"> ${name.official}</p>
        </li>`,
    )
    .join('');
}

function onFetchError(error) {
  console.log(error);
  Notify.failure('Oops, there is no country with that name');
  if (inputEl.value === '') {
    listEl.innerHTML = '';
  }
}
