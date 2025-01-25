export interface AnimeListRoot {
    list: Anime[];
    pagination?: Pagination;
  }
  
  export interface Anime {
    id: number;
    code: string;
    names: {
      ru: string;
      en: string;
    };
    description: string;
    posters: {
      medium: {
        url: string;
      };
    };
    status: {
      string: string;
    };
    type: {
      full_string: string;
    };
    genres: string[];
    player: {
      playlist: Episode[];
    };
  }
  
  export interface Episode {
    episode: number;
    hls: {
      fhd: string;
      hd: string;
      sd: string;
    };
  }
  
  export interface Pagination {
    pages: number;
    current_page: number;
    items_per_page: number;
    total_items: number;
  }
  
  export interface QueryInterface {
    limit?: number;
    playlist_type?: string;
    items_per_page?: number;
    page?: number;
  }
  
  export interface QueryTitleProps {
    code: string;
    playlist_type?: string;
  }