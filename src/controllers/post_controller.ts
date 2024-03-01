import Post from '../models/post_model';
import baseController from './base_controller';
import { IPost } from '../models/post_model';

class PostController extends baseController<IPost>{
    constructor(){
        super(Post);
    }
}

export default new PostController();