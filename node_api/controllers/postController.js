const express = require('express');
const fs = require('fs');
const lodash = require('lodash');
// const formidable = require('formidable');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
});

const upload = multer({ storage: storage });

const Post = require('../models/postModel');

exports.postById = async (req, res, next, id) => {

  await Post.findById(id)
    .populate('postedBy', '_id name')
    // .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .exec((err, currPost) => {
      if(err || !currPost) {
        return res.status(400).json({
          error: err
        });
      }

      req.post = currPost;
      next();

  });
}; 

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
    .populate('postedBy', '_id name')
    // .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .sort({created: -1});

    res.status(200).json(posts);
  } catch(err) {
    res.status(404).json({
        status: 'Fail',
        error: err.message
    });
  }
};

exports.uploadPhoto = upload.single('photo');

exports.createPost = async (req, res, next) => {

  try {
    // console.log(req.file);

    let post = new Post({
      title: req.body.title,
      body: req.body.body,
      photo: req.file.path
    });

    req.profile.password = undefined;
    post.postedBy = req.profile._id;

    await post.save((err, newPost) => {
      if(err) {
        return res.status(400).json({
          error: err.message
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          newPost
        }
      });
    });

  } catch (err) {
    res.status(400).json({
      error: 'Image could not be uploaded..!!',
      err_msg: err
    });
  }

    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;
    //
    // form.parse(req, (err, fields, files) => {
    //  
    //   console.log(fields);
    //
    //     if(err) {
    //       console.log(err);
    //       return res.status(400).json({
    //         status: 'Image could not be uploaded..!!'
    //       });
    //     }
    //
    //     let post = new Post(fields);
    //
    //     req.profile.hashed_password = undefined;
    //     req.profile.salt = undefined;
    //     post.postedBy = req.profile;
    //
    //     if(files.photo) {
    //       post.photo.data = fs.readFileSync(files.photo.path);
    //       post.photo.contentType = files.photo.type;
    //     }
    //
    //     post.save((err, result) => {
    //       if(err) {
    //         return res.status(400).json({
    //           message: err
    //         });
    //       }
    //
    //       res.status(200).json({
    //         status: 'success',
    //         data: {
    //           result
    //         }
    //       });
    //
    //    });
    //
    // });
};

exports.postsByUser = async (req, res, next) => {
  await Post.find({ postedBy: req.profile._id })
    .populate('postedBy', '_id name')
    .select('_id title body photo created likes')
    .sort('_created')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {

  const isPost = (req.post && req.auth && (req.post.postedBy._id.toString() == req.auth._id.toString())) ;

  if(!isPost) {
    return res.status(403).json({
      error: 'User is not authorized...!!'
    });
  }
  next();

};

exports.updatePost = async (req, res, next) => {
  let post = req.post;
  post = lodash.extend(post, req.body);

  await post.save((err) => {
    if(err) {
      return res.status(400).json({
        error: 'You are not authorized to perform this action....!!!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });

  });
};

exports.deletePost = async (req, res, next) => {
  let post = req.post;
  await post.remove(err => {
    if(err) {
      return res.status(400).json({
        error: err.message
      });
    }

    res.status(200).json({
      status: 'Post successfully deleted...!!'
    });
  });
};

exports.singlePost= (req, res, next) =>{
  if(req.post) {
    console.log(req.post);
    return res.json(req.post);
  }
  next();
};

exports.like = async (req, res, next) => {
  await Post.findByIdAndUpdate(
    req.body.postId, 
    {$push: {likes: req.body.userId}}, 
    {new: true}
  ).exec((err, result) => {
    if(err) {
      return res.status(200).json({
        error: err
      });
    }

    res.json(result);
  });
};

exports.unlike = async (req, res, next) => {
  await Post.findByIdAndUpdate(
    req.body.postId, 
    {$pull: {likes: req.body.userId}}, 
    {new: true}
  ).exec((err, result) => {
    if(err) {
      return res.status(200).json({
        error: err
      });
    }

    res.json(result);
  });
};

exports.comment = async (req, res, next) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  await Post.findByIdAndUpdate(
    req.body.postId, 
    {$push: {comments: comment}}, 
    {new: true}
  )
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .exec((err, result) => {
    if(err) {
      return res.status(200).json({
        error: err
      });
    }

    res.json(result);
  });
};

exports.uncomment = async (req, res, next) => {
  let comment = req.body.comment;
 
  await Post.findByIdAndUpdate(
    req.body.postId, 
    {$pull: {comments: {_id: comment._id}}}, 
    {new: true}
  )
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .exec((err, result) => {
    if(err) {
      return res.status(200).json({
        error: err
      });
    }

    res.json(result);
  });
};