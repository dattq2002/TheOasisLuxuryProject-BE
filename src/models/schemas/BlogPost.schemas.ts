import User from './User.schemas';

interface BlogPostType {
  _id?: string;
  title: string;
  user_id: string;
  description_detail: string;
  insert_date?: Date;
  update_date?: Date;
  deflag?: boolean;
  user?: User;
}

export default class BlogPost {
  _id?: string;
  title: string;
  user_id: string;
  description_detail: string;
  insert_date: Date;
  update_date: Date;
  deflag: boolean;
  user?: User;
  constructor(blogPost: BlogPostType) {
    this.title = blogPost.title;
    this.user_id = blogPost.user_id;
    this.description_detail = blogPost.description_detail;
    this.insert_date = blogPost.insert_date || new Date();
    this.update_date = blogPost.update_date || new Date();
    this.deflag = blogPost.deflag || false;
    this.user = blogPost.user;
  }
}
