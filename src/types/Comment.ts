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
  share_id?: string;
  shared?: number;
  user_date_time: Date;
  user_name: string;
}
export interface CommentQuery {
  content_id?: string | null,
  start: number,
  searchTerm?: string | null,
  fromDate?: Date | null,
  toDate?: Date | null,
  limit: number
}

export interface PostComment {
  comment: string;
  editId?: number;
  parentId?: number;
  shareId?: number;
  dateTime?: string;
}
