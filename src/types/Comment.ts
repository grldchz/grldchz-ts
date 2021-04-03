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