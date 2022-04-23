/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
export interface Media {
    id: number;
    content_id: number
    user_name: string;
    file: string;
    title: string;
    num_hits: number
    is_image: boolean;
    thumb?: string;
    profile?: string;
    slide?: string;
    full?: string;
    original?: string;
    mp4?: string;
}
export interface MediaQuery {
  content_id: number | null,
  media_id?: number | null,
  start: number,
  searchTerm?: string | null,
  fromDate?: Date | null,
  toDate?: Date | null,
  limit: number
}

export interface MediaResults {
  results: Media[];
  total: number;
  loading: boolean;
}

export interface MediaScrollerState {
  query: MediaQuery;
  results: Media[];
  total: number;
  loading: boolean;
}

export interface PostCaption {
  caption: string;
  media_id?: number;
}