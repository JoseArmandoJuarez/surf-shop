const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'd3v0ps',
    api_key: '315725247641264',
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {

    //post index
    async postIndex(req, res, next) {
        let posts = await Post.find({}); // .find({}) - gets all post collections
        res.render('posts/index', { posts });
    },

    // new Post
    postNew(req, res, next){
        res.render('posts/new');
    },

    //Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = []; // adding an array to post object
        for(const file of req.files){
            //uploading to cloudnary
            // when return the promise we get an object from cloudinary
            let image = await cloudinary.v2.uploader.upload(file.path);
            // pusing the url and id from the object we got back from cloudinary
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            })
        }

        //use req.body to create a new Post
        let post = await Post.create(req.body.post);
        res.redirect(`/posts/${post.id}`);
    },

    // Post Show
    async postShow(req, res, next){
        // findById() is a method provided by mongoose to find id
        let post = await Post.findById(req.params.id)
        res.render('posts/show', { post })
    },

    // Post edit
    async postEdit(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    },

    // Post Update
    /**Taking the info from the PUT request and going to find the post by its id
     * and then going to update it by using the info from the form 
     */
    async postUpdate(req, res, next){
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
        res.redirect(`/posts/${post.id}`);
    },

    // Destroy post
    async postDestroy(req, res, next){
        await Post.findByIdAndRemove(req.params.id);
        res.redirect('/posts');
    }
}