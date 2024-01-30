import { ObjectId } from 'mongodb';

interface BlogPostType {
  _id?: string;
  user_id: ObjectId;
  title: string;
  description_detail: string;
  insert_date?: Date;
  update_date?: Date;
  deflag?: boolean;
}

export default class BlogPost {
  _id?: string;
  user_id: ObjectId;
  title: string;
  description_detail: string;
  insert_date: Date;
  update_date: Date;
  deflag: boolean;
  constructor(blogPost: BlogPostType) {
    this._id = blogPost._id;
    this.title = blogPost.title;
    this.description_detail = blogPost.description_detail;
    this.insert_date = blogPost.insert_date || new Date();
    this.update_date = blogPost.update_date || new Date();
    this.deflag = blogPost.deflag || false;
    this.user_id = blogPost.user_id;
  }
}
