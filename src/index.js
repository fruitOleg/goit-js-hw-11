import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetImageAPI from './js/images.js';
import { createGalleryCard } from './js/create-image';

const getImageApiInstance = new GetImageAPI();
const lightboxGallery = new SimpleLightbox('.gallery a');

const searchInputFormEl = document.querySelector('.search-form');
const createGalleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const scrollToTop = document.querySelector('.stt');

searchInputFormEl.addEventListener('submit', handleSearchBtn);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

async function handleSearchBtn(event) {
  event.preventDefault();

  getImageApiInstance.query = event.target.elements.searchQuery.value.trim();

  loadMoreBtnEl.classList.remove('is-hidden');

  if (getImageApiInstance.query === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  getImageApiInstance.resetPage();

  createGalleryEl.innerHTML = '';

  const data = await getImageApiInstance.getImage();

  try {
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtnEl.classList.remove('is-hidden');
      return;
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    const markup = createGalleryCard(data.hits);
    createGalleryEl.insertAdjacentHTML('beforeend', markup);
    lightboxGallery.refresh();

    if (data.totalHits >= getImageApiInstance.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  } catch {
    Notify.failure('Bad request');
  }
}

async function handleLoadMoreBtnClick() {
  getImageApiInstance.incrementPage();
  const data = await getImageApiInstance.getImage();
  try {
    if (getImageApiInstance.page >= data.totalHits / 40) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );

      loadMoreBtnEl.classList.remove('is-hidden');
    }

    const markup = createGalleryCard(data.hits);
    createGalleryEl.insertAdjacentHTML('beforeend', markup);
    lightboxGallery.refresh();
  } catch {
    Notify.failure('Bad request end line');
  }
}

document.addEventListener('scroll', event => {
  if (window.scrollY >= 500) {
    scrollToTop.style.display = 'block';
  } else {
    scrollToTop.style.display = 'none';
  }
});

scrollToTop.addEventListener('click', event => {
  window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
});
