/**
	This is a part of the grilledcheeseoftheday.com

	Copyright (C) 2022 grilledcheeseoftheday.com

    GRLDCHZ is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GRLDCHZ is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
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
