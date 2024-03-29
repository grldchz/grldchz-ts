/**
	This is a part of the grilledcheeseoftheday.com

	Copyright (C) 2022 grilledcheeseoftheday.com

    grilledcheeseoftheday.com is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    grilledcheeseoftheday.com is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
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