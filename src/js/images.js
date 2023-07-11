import axios from 'axios';

export default class GetImageAPI {
  BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async getImage() {
    const response = await axios.get(`${this.BASE_URL}`, {
      params: {
        key: '38200365-78da0163b7645a21191d777ec',
        q: `${this.searchQuery}`,
        imageType: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        perPage: `${this.perPage}`,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
