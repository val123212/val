import axios from 'axios';
import { config } from '../config/config';

class AnimeService {
  private API_URL = `${config.API_URL}/title`;

  async getUpdates(limit: number = 20): Promise<any[]> {
    try {
      console.log('Fetching updates from:', `${this.API_URL}/updates`);
      const response = await axios.get(`${this.API_URL}/updates`, {
        params: {
          limit: limit,
          playlist_type: 'array'
        },
        paramsSerializer: (params) => {
          return Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getUpdates:', error);
      throw error;
    }
  }

  async getAnimeById(id: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getAnimeById:', error);
      throw error;
    }
  }

  async searchAnime(query: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_URL}/search`, {
        params: {
          search: query,
          limit: 10
        },
        paramsSerializer: (params) => {
          return Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in searchAnime:', error);
      throw error;
    }
  }
}

export const animeService = new AnimeService();