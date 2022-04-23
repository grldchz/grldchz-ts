/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
export interface Friend {
  id: number;
  user_id: number;
  friend_id: number;
  hidden: number;
  accepted: number;
  user_name: string;
  first_name: string;
  img_file?: string;
  last_name: string;
  user_date_time: Date;
  description: string;
  outgoing_request: number[];
  incoming_request: number[];
}
export interface FriendQuery {
  skilletUserId?: number;
  skilletSearchTerm?: string | null;
  start: number;
  limit: number;
}

export interface PostSearch {
  skilletSearchTerm?: string;
  skilletUserId?: number;
}
