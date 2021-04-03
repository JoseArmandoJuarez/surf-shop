require('dotenv').config();

const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
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


        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location, // location to pass
                limit: 1         // only one result
            })
            .send();

        console.log('RESPONSE: ', response.body.features[0].geometry.coordinates);
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        console.log('2nd Response: ', req.body.post.coordinates)
        //use req.body to create a new Post
        let post = await Post.create(req.body.post);
        console.log(post);
        console.log(post.coordinates);

        req.session.success = 'Post Created Successfully';

        res.redirect(`/posts/${post.id}`);
    },

    // Post Show
    async postShow(req, res, next){
        // findById() is a method provided by mongoose to find id
        let post = await Post.findById(req.params.id).populate({
            path:'reviews',
            options: { sort: { '_id': -1 } },
            populate: {
                path: 'author',
                model: 'User'
            }
        });
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
        // find the post by id
        let post = await Post.findById(req.params.id);
        // check if there's any images for deletion
        if(req.body.deleteImages && req.body.deleteImages.length){
            //array of images (only the id)
            let deleteImages = req.body.deleteImages;
            for(const public_id of deleteImages){
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // delete images from post.images
                for(const image of post.images){
                    if(image.public_id === public_id){
                        let index = post.images.indexOf(image);
                        post.images.splice(index, 1); // remove that image
                    }
                }
            }
        }
        // check if there are any new images for upload
        if(req.files){
            // upload images
            for(const file of req.files){
                let image = await cloudinary.v2.uploader.upload(file.path);
                post.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                })
            }
        }

        // check if location was updated
        if (req.body.post.location !== post.location){
            let response = await geocodingClient
                .forwardGeocode({
                    query: req.body.post.location, // location to pass
                    limit: 1         // only one result
                })
                .send();
        
            post.coordinates = response.body.features[0].geometry.coordinates;
            post.location = req.body.post.location;
            console.log(post.coordinates);
        }

        //update the post witht the new any new properties
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        
        // save the update post into the db
        post.save();
        //redirect to show page
        res.redirect(`/posts/${post.id}`);
    },

    // Destroy post
    async postDestroy(req, res, next){
        let post = await Post.findById(req.params.id);
        for(const image of post.images){
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        res.redirect('/posts');
    }
}