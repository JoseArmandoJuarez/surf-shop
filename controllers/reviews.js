const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {

    //Reviews Create
    async reviewCreate(req, res, next) {
        // find the post by its id
        let post = await Post.findById(req.params.id);
        // create the review
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        console.log(review);
        // assign review to post
        post.reviews.push(review);
        // save the post
        post.save();
        console.log(post);
        // redirect to the post
        req.session.success = 'Review Created successfully!';
        res.redirect(`/posts/${post.id}`);
    },

    // Reviews Update
    async reviewUpdate(req, res, next){
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Review updated successfully!';
        res.redirect(`/posts/${req.params.id}`);
    },

    // Reviews Destroy
    async reviewDestroy(req, res, next){

    }
}