import axios from 'axios';
import Notiflix from 'notiflix';
import { refs } from './refs.js';
  

// Ключи для получения доступа к API и первая страница
  const API = 'https://pixabay.com/api';
  const API_KEY = '28070761-d620d5c137a0a40b3f0efb4d6';
  const PER_PAGE = 40;
  let page = 1;
  

// Функция для кнопки "Показать еще". При странице "1" прячет кнопку.
  function mainPage() {
    if (page === 1) {
      refs.continueButton.classList.add('is-hidden');
    }
  }
  
  mainPage();
  

// Слушатель на кнопку "Показать еще" и кнопку "Найти"
  refs.mainForm.addEventListener('submit', addGallery);
  refs.continueButton.addEventListener('click', loadMore);
  

// Функция для слушателя на кнопку "Найти"
  function addGallery(event) {
    if (!refs.continueButton.classList.contains('is-hidden') && page > 1) {
      refs.continueButton.classList.add('is-hidden');
    }
  
    resetPageCount();
    clearMarkup();
    getImages(event);
  }
  

// Функция для слушателя на кнопку "Показать еще"
  function loadMore(event) {
    getImages(event);
  }
  

// Получение картинок
  function getImages(event) {
    event.preventDefault();
  
    const requestValue = refs.input.value;
  
    getData(requestValue)
      .then(response => {
        data(response);
      })
      .catch(error => console.log(error.message));
  }
  
  function data(response) {
    const pics = response.data.hits;
    renderGallery(pics);
  }
  
  const axios = require('axios');
  
  async function getData(searchword) {
    const search = searchword.trim();
    try {
      if (search === '') {
        Notiflix.Notify.warning('Please type in the field what you want to find');
        clearMarkup();
        return;
      }
      const response = await axios.get(
        `${API}/?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`
      );
  
      if (page === 1 && response.data.totalHits > 0) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images`
        );
        refs.continueButton.classList.remove('is-hidden');
      }
  
      if (
        page >= response.data.totalHits / PER_PAGE &&
        response.data.totalHits > 0
      ) {
        Notiflix.Notify.warning(
          'We have already reached the end of the collection'
        );
        refs.continueButton.classList.add('is-hidden');
      }
  
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again'
        );
        return;
      }
  
      page += 1;
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  

// Функция для сброса счетчика страниц
  function resetPageCount() {
    page = 1;
  }


// Рэндеринг картинок(галереи)
  function renderGallery(pictureArray) {
    const imgMarkup = pictureArray
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
          <div class="photo-card">
          <a class="gallery-item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__image"/>  
    <div class="info">
      <p class="info-item">
        <b>Likes : ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div> </a>
  `;
        }
      )
      .join('');
    refs.gallery.insertAdjacentHTML('beforeend', imgMarkup);
  }


// Очистка галереи
  function clearMarkup() {
    refs.gallery.innerHTML = '';
  }