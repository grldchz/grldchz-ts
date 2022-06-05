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
export interface Comment {
  comment: string;
  description: string;
  first_name: string;
  id: number;
  image: string;
  img_file: string;
  last_name: string;
  num_photos: number;
  num_videos: number;
  post_date_time: Date;
  replies: Comment[];
  parent_id?: number;
  share_id?: number;
  shared?: number;
  user_date_time: Date;
  user_name: string;
  open_public: number;
  image_title: string;
}
export interface CommentQuery {
  content_id?: string | null,
  start: number,
  searchTerm?: string | null,
  fromDate?: string | null,
  toDate?: string | null,
  limit: number
}

export interface PostComment {
  comment: string;
  editId?: number;
  parentId?: number;
  shareId?: number;
  dateTime?: string;
  openPublic?: boolean;
}

export interface PostSearch {
  searchTerm?: string,
  fromDate?: string,
  toDate?: string
}