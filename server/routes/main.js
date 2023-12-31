const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Subscriber = require('../models/Subscriber');
/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
    try {
        const locals = {
        title: "EnlightenMe",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const latestPage = parseInt(page)-1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      latestPage: latestPage,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Categ
*/
router.get('/categ', (req, res) => {
  res.render('categ', {
    currentRoute: '/categ'
  });
});
// GET /categ
// router.get('/categ', async (req, res) => {
//   try {
//     const selectedCategory = req.query.name;
//     const data = await Post.find({ category: selectedCategory }).sort({ createdAt: -1 });
//     res.render('categoryPage', { data });
//   } catch (error) {
//     console.log(error);
//   }
// });

// GET /categoryPage
router.get('/categoryPage', async (req, res) => {
  try {
    const selectedCategory = req.query.name; // Retrieve the selected category from query parameter
    const data = await Post.find({ category: selectedCategory }).sort({ createdAt: -1 });
    res.render('categoryPage', { data, selectedCategory,
      currentRoute: '/categoryPage' }); // Pass the selectedCategory to the template
  } catch (error) {
    console.log(error);
  }
});



/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

/**
 * GET /
 * Contact
*/
router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();

router.post('/post/:id/upvote', async (req, res) => {
  try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }
      post.upvotes++;
      await post.save();
      res.status(200).json({ message: 'Upvote successful', upvotes: post.upvotes });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/post/:id/downvote', async (req, res) => {
  try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }
      post.downvotes++;
      await post.save();
      res.status(200).json({ message: 'Downvote successful', downvotes: post.downvotes });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /post/:id
 * View a single blog post
 */
router.get('/post/:id', async (req, res) => {
  try {
      let slug = req.params.id;

      const data = await Post.findById({ _id: slug });

      const locals = {
          title: data.title,
          description: "Simple Blog created with NodeJs, Express & MongoDb.",
          // Pass req.originalUrl to the EJS view
          originalUrl: req.protocol + '://' + req.get('host') + req.originalUrl // Add this line
      }

      res.render('post', { 
          locals,
          data,
          currentRoute: `/post/${slug}`
      });
  } catch (error) {
      console.log(error);
  }
});

router.post('/subscribe', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate name and email fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required fields.' });
    }

    // Check if the email is valid using the regular expression defined in the model
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Create a new subscriber object and save it to the database
    const subscriber = new Subscriber({ name, email });
    await subscriber.save();

    // Return success response
    return res.status(200).json({ message: 'Subscription successful.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;