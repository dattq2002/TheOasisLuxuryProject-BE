import { ObjectId } from 'mongodb';

interface BlogPostType {
  _id?: ObjectId;
  user_id: ObjectId;
  title: string;
  description_detail: string;
  insert_date?: Date;
  update_date?: Date;
  deflag?: boolean;
  url_image?: string;
}

export default class BlogPost {
  _id?: ObjectId;
  user_id: ObjectId;
  title: string;
  description_detail: string;
  insert_date: Date;
  update_date: Date;
  deflag: boolean;
  url_image: string;

  constructor(blogPost: BlogPostType) {
    this._id = blogPost._id;
    this.title = blogPost.title;
    this.description_detail = blogPost.description_detail;
    this.insert_date = blogPost.insert_date || new Date();
    this.update_date = blogPost.update_date || new Date();
    this.deflag = blogPost.deflag || false;
    this.user_id = blogPost.user_id;
    this.url_image = blogPost.url_image || '';
  }
}
