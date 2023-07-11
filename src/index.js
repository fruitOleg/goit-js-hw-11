import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetImageAPI from './js/images.js';

const getimageApiInstance = new GetImageAPI();
const lightboxGallery = new SimpleLightbox('.gallery a');

const searchInputFormEl = document.querySelector('.search-form');
const createGalleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

searchInputFormEl.addEventListener('submit', heandleSearchBtn);

function heandleSearchBtn(event) {
  event.preventDefault();

  loadMoreBtnEl.classList.remove('is-hidden');

  getimageApiInstance.query = event.target.elements.searchQuery.value.trim();

  if (getimageApiInstance.query === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  getimageApiInstance.resetPage();

  createGalleryEl.innerHTML = '';

  getimageApiInstance
    .getImage()
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtnEl.classList.remove('is-hidden');
        return;
      }

      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      const murkup = createGalleryCard(data.hits);
      createGalleryEl.insertAdjacentHTML('beforeend', murkup);
      lightboxGallery.refresh();
      loadMoreBtnEl.classList.add('is-hidden');
    })
    .catch(() => {
      Notify.failure('Bad request');
    });
}

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function handleLoadMoreBtnClick() {
  getimageApiInstance.incrementPage();
  getimageApiInstance
    .getImage()
    .then(data => {
      if (getimageApiInstance.page >= data.totalHits / 40) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );

        loadMoreBtnEl.classList.remove('is-hidden');
        return;
      }

      murkup = createGalleryCard(data.hits);
      createGalleryEl.insertAdjacentHTML('beforeend', murkup);
      lightboxGallery.refresh();
    })
    .catch(() => {});
}

function createGalleryCard(murkup) {
  return murkup
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
  <a class="photo-link" href="${largeImageURL}">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
  <p class="info-item">
   <b>Likes</b>${likes}
    </p>
  <p class="info-item">
    <b>Views</b>${views}
  </p>
  <p class="info-item">
   <b>Comments</b>${comments}
  </p>
  <p class="info-item">
   <b>Downloads</b>${downloads}
  </p>
    </div>
  </a>
  </div>`;
      }
    )
    .join('');
}
