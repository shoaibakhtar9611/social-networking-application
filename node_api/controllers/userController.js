const lodash = require('lodash');
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

const User = require('../models/userModel');

exports.userById = async (req, res, next, id) => {
  // populate the following and followers array

  await User.findById(id)
  .populate('following', '_id name')
  .populate('followers', '_id name')
  .exec((err, user) => {

    if(err || !user) {
      return res.status(404).json({
        error: 'User not found..!!'
      });
    }

    req.profile = user;
    //console.log(user);
    next();

  });
};

exports.hasAuthorization = (req, res, next) => {

  const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
  if(!authorized) {
    return res.status(403).json({
      error: 'User is not authorized..!!'
    });
  }
  next();
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email created");

    res.status(200).json(users);
  } catch(err) {
    res.status(404).json({
      status: 'Fail',
      error: err.message
    });
  }
};

exports.getUser = (req, res, next) => {

  if(!req.profile) {
    return res.status(404).json({
      error: "User with that ID does not exist..."
    });
  }

  const user = req.profile;

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });

};

// exports.updateUser = async (req, res, next) => {
//   let user = req.profile;
//   user = lodash.extend(user, req.body);     // extend - Mutate the source object
//   user.updated = Date.now();

//   await user.save( err => {
//     if(err) {
//       return res.status(400).json({
//         error: "You are not authorized to perform this action.....!!"
//       });
//     }

//     user.password = undefined;

//     res.status(200).json({
//       status: 'success',
//       data: {
//         user
//       }
//     });
//   });

// };

exports.uploadPhoto = upload.single('photo');

exports.updateUser = async (req, res, next) => {
  let user = req.profile;
  user = lodash.extend(user, req.body);

  if(req.file)
  user.photo = req.file.path;
  
  user.updated = Date.now();
  // console.log(user);

  await user.save( (err, result) => {
    if(err) {
      return res.status(400).json({
        error: "Photo could not be uploaded.....!!"
      });
    }

    user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  });

};

exports.userPhoto = (req, res, next) => {
  if(req.profile.photo) {
    const user=req.profile;
    user.followers=undefined;
    user.following=undefined;
    user.password=undefined;
    user.email=undefined;
    // console.log(user);

    return res.json(user);
  }
  next();
};
 
exports.deleteUser = async (req, res, next) => {
  let user = req.profile;
  await user.remove(err => {
    if(err) {
      return res.status(400).json({
        error: err.message
      });
    }

    res.status(200).json({
      status: 'Successfully deleted...'
    });
  });

};

exports.addFollowing = async (req, res, next) => {
  await User.findByIdAndUpdate(req.body.userId, 
    { $push : {following: req.body.followId} },
    (err, result) => {
      if(err) {
        return res.status(400).json({
          error: err
        });
      }
      next();  
    }
  );
};

exports.addFollower = async (req, res, next) => {
  await User.findByIdAndUpdate(req.body.followId, 
    { $push : {followers: req.body.userId} },
    { new: true}    // returns the new updated document
  )
  .populate('following', '_id name')
  .populate('followers', '_id name')
  .exec((err, result) => {
    if(err) {
      return res.status(400).json({
        error: err
      });
    }

    result.password = undefined;    
    res.status(200).json(result);
  });
};

exports.removeFollowing = async (req, res, next) => {
  await User.findByIdAndUpdate(req.body.userId, 
    { $pull : {following: req.body.unfollowId} },
    (err, result) => {
      if(err) {
        return res.status(400).json({
          error: err
        });
      }
      next();
    }
  );
};

exports.removeFollower = async (req, res, next) => {
  await User.findByIdAndUpdate(req.body.unfollowId, 
    { $pull : {followers: req.body.userId} },
    { new: true}
  )
  .populate('following', '_id name')
  .populate('followers', '_id name')
  .exec((err, result) => {
    if(err) {
      return res.status(400).json({
        error: err
      });
    }

    result.password = undefined;
    res.status(200).json(result);
  });
};

exports.findPeople = async (req, res, next) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  await User.find({_id: {$nin: following}}, (err, users) => {
    if(err) {
      return res.status(400).json({
        error: err
      });
    }
    res.status(200).json(users);
  });
};