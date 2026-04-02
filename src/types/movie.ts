export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export type MovieResponse = {
    page:number,
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;     
  tagline: string;     
}

export interface Cast {
  id: number;
  name: string;
  profile_path: string | null;
  character: string; 
}

export interface Credits {
  cast: Cast[];
}