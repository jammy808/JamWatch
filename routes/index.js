var express = require('express');
var router = express.Router();
//const adminModel = require('./users');
//const studentModel = require('./student');
//const eventModel = require('./event');
const clientModel = require('./client');
const contentModel = require('./content');
const carouselModel = require('./carousel');
const topModel = require('./top');
const upload = require('./multer');


const passport = require('passport');
const localStratergy = require('passport-local');
passport.use(new localStratergy(clientModel.authenticate()));
//passport.use(new localStratergy(clientModel.authenticate()));

const { MongoClient } = require('mongodb');  //
const { GridFSBucket } = require('mongodb');
const { createReadStream } = require('fs');
//const Datauri = require('datauri');
const { Readable } = require('stream');

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect();
    const database = client.db('mamu');
    const bucket = new GridFSBucket(database);


/* GET home page. */
 router.get('/', function(req, res, next) { // gets the main page 

  if(req.isAuthenticated()){
    res.render('index',{t:0}); 
  }
  res.render('index',{t:1});
}
 //res.render('movie',{data : null,t:0});
);

router.get('/hi',async function(req, res, next) {
  const top = await topModel.find();
  const car = await carouselModel.find();
  console.log(top,car);
});




//anime handling

router.get('/anime',async function(req,res,next){ // gets the anime page 
  const car = await carouselModel.find();
  res.render('anime',{info : null,t:1,data : null, dam : car});
})

router.post('/animeSearch',async function(req,res,next){ // gets the anime data based on the search
  console.log(req.body.title);
  const title = req.body.title;

  const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '705b5aca63mshf454daf5bc4a7f5p1a6374jsn4a041afbac23',
        'X-RapidAPI-Host': 'myanimelist.p.rapidapi.com'
      }
    };

    const url = `https://myanimelist.p.rapidapi.com/v2/anime/search?q=${title}&n=50`;

    let response = await fetch(url,options);
    let data = await response.json();
    console.log(data);
    const arr = data;

    const car = await carouselModel.find();

  res.render('anime',{info : arr, t : 1, data: null , dam : car});
})

router.post('/animeGenre',async function(req,res,next){ // gets the anime data based on the genres
  const genres = req.body.genres;

  const url = `https://kitsu.io/api/edge/anime?filter[categories]=${genres}`;

    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    const arr = data.data;

    const car = await carouselModel.find();

    res.render('anime',{data : arr, t : 0, dam : car});

})


//movies handling

router.get('/movie',async function(req,res,next){ // gets the movie page
  const car = await carouselModel.find();
  res.render('movie',{data : null, t : 0, dam : car});
})

router.post('/movieGenre',async function(req,res,next){ // gets the movie data based on genre
  const genre = req.body.genre;

  const url = `https://moviesverse1.p.rapidapi.com/get-by-genre?genre=${genre}`;
  const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '705b5aca63mshf454daf5bc4a7f5p1a6374jsn4a041afbac23',
        'X-RapidAPI-Host': 'moviesverse1.p.rapidapi.com'
      }
    };

  let response = await fetch(url,options);
  let data = await response.json();
  //console.log(data);
  const arr = data.movies;

  const car = await carouselModel.find();

  res.render('movie',{data : arr ,t: 0 , dam : car});
})

router.post('/movieSearch',async function(req,res,next){ // gets the movie dta based on search
  const title = req.body.title;
  console.log(title);

  const car = await carouselModel.find();

  const url = `https://movies-tv-shows-database.p.rapidapi.com/?title=${title}`;
            const options = {
                method: 'GET',
                headers: {
                    Type: 'get-movies-by-title',
                    'X-RapidAPI-Key': '705b5aca63mshf454daf5bc4a7f5p1a6374jsn4a041afbac23',
                    'X-RapidAPI-Host': 'movies-tv-shows-database.p.rapidapi.com'
                }
            };


            let response = await fetch(url,options);
            let data = await response.json();
            console.log(data);
            const arr = data.movie_results;

            
            const promises = [];
            const maxRequestsPerSecond = 5; // Adjust this value based on the API's rate limit
            let requestCounter = 0;

            arr.forEach((ele, index) => {
                let id = ele.imdb_id; 

                const url = `https://imdb-com.p.rapidapi.com/title/details?tconst=${id}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '20d7e74e2fmsh860fb5dc5a24770p127d70jsn69ac5f87d2f5',
                        'X-RapidAPI-Host': 'imdb-com.p.rapidapi.com'
                    }
                };

                const fetchPromise = () => {
                    return fetch(url, options)
                        .then(response => response.json())
                        .then(res => {
                          console.log(res);
                            if (res.data && res.data.aboveTheFoldData.primaryImage && res.data.aboveTheFoldData.primaryImage.url && res.data.aboveTheFoldData.plot && res.data.aboveTheFoldData.runtime){
                            let man = {
                                title: res.data.aboveTheFoldData.originalTitleText.text,
                                url: res.data.aboveTheFoldData.primaryImage.url,
                                plot: res.data.aboveTheFoldData.plot.plotText.plainText,
                                year: res.data.aboveTheFoldData.releaseYear.year,
                                time: res.data.aboveTheFoldData.runtime.displayableProperty.value.plainText
                            };
                            return man;
                            }
                            else{
                            return null;
                            }
                        });
                };

                const executeRequest = () => {
                    requestCounter++;
                    return fetchPromise().finally(() => {
                        requestCounter--;
                    });
                };

                promises.push(new Promise((resolve, reject) => {
                    const delay = index * (1000 / maxRequestsPerSecond);
                    setTimeout(() => {
                        resolve(executeRequest());
                    }, delay);
                }));
            });

            Promise.all(promises).then(data => {
                console.log(data);
            
                res.render('movie',{info : data, t :1 , dam : car});
            });

 
})


// tv shows

router.get('/tvShow',async function(req,res,next){ // gets the tv shows page
  const car = await carouselModel.find();
  res.render('tvShow',{info : null, t: 1, dam : car});
})

router.post('/showsGenre',async function(req,res,next){ // gets the shows data based on genre
  const genre = req.body.genre;

  const url = `https://ott-details.p.rapidapi.com/advancedsearch?min_imdb=7&max_imdb=10&genre=${genre}&language=english&type=show&sort=latest&page=1`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '705b5aca63mshf454daf5bc4a7f5p1a6374jsn4a041afbac23',
                    'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
                }
            };

            let response = await fetch(url,options);
            let data = await response.json();
            console.log(data);
            const arr = data.results;

  const car = await carouselModel.find();

  res.render('tvShow',{data : arr ,t: 0 , dam : car});
})

router.post('/showsSearch',async function(req,res,next){
  const title = req.body.title;

  const car = await carouselModel.find();

  const url = `https://movies-tv-shows-database.p.rapidapi.com/?title=${title}`;
            const options = {
                method: 'GET',
                headers: {
                    Type: 'get-shows-by-title',
                    'X-RapidAPI-Key': '705b5aca63mshf454daf5bc4a7f5p1a6374jsn4a041afbac23',
                    'X-RapidAPI-Host': 'movies-tv-shows-database.p.rapidapi.com'
                }
            };

            let response = await fetch(url,options);
            let data = await response.json();
            console.log(data);
            const arr = data.tv_results;

            
            const promises = [];
            const maxRequestsPerSecond = 5; // Adjust this value based on the API's rate limit
            let requestCounter = 0;

            arr.forEach((ele, index) => {
                let id = ele.imdb_id; 

                const url = `https://imdb-com.p.rapidapi.com/title/details?tconst=${id}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '20d7e74e2fmsh860fb5dc5a24770p127d70jsn69ac5f87d2f5',
                        'X-RapidAPI-Host': 'imdb-com.p.rapidapi.com'
                    }
                };

                const fetchPromise = () => {
                    return fetch(url, options)
                        .then(response => response.json())
                        .then(res => {
                          if (res.data && res.data.aboveTheFoldData.primaryImage && res.data.aboveTheFoldData.primaryImage.url && res.data.aboveTheFoldData.plot && res.data.aboveTheFoldData.runtime){
                            let man = {
                                title: res.data.aboveTheFoldData.originalTitleText.text,
                                url: res.data.aboveTheFoldData.primaryImage.url,
                                plot: res.data.aboveTheFoldData.plot.plotText.plainText,
                                year: res.data.aboveTheFoldData.releaseYear.year,
                                time: res.data.aboveTheFoldData.runtime.displayableProperty.value.plainText
                            };
                            return man;
                            }
                            else{
                            return null;
                            }
                        });
                };

                const executeRequest = () => {
                    requestCounter++;
                    return fetchPromise().finally(() => {
                        requestCounter--;
                    });
                };

                promises.push(new Promise((resolve, reject) => {
                    const delay = index * (1000 / maxRequestsPerSecond);
                    setTimeout(() => {
                        resolve(executeRequest());
                    }, delay);
                }));
            });

            Promise.all(promises).then(data => {
                console.log(data);
                res.render('tvShow',{info : data, t :1 ,data: null , dam : car});
            });
       
})

// About User

router.post('/register',function(req,res,next){

  var clientData = new clientModel({
    username : req.body.username  })
    clientModel.register(clientData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res , function(){
      res.redirect('/');
    })
  })
  
})

router.post('/login', passport.authenticate("local" , {
  successRedirect : "/",
  failureRedirect : "/login"
}) ,function(req,res,next){

})
router.get('/demo',function(req,res,next){ //a fix for hiding list without login
  res.render('index',{t:0});
})


router.post('/add', isLoggedIn ,async function(req,res,next){ // adds the content to watchlist

  const Client = await clientModel.findOne({ username: req.session.passport.user });
  // console.log(req.body);
  // console.log(client);
  
  const Content = await contentModel.create({
    client : Client._id,
    title  : req.body.title,
    imageLink : req.body.picture_url
  })

  Client.content.push(Content._id);
  await Client.save();

  res.redirect('/list');
})

router.get('/list', isLoggedIn ,async function(req,res,next){ //displaying the watchlist
  const Client = await clientModel.findOne({username : 'a'}).populate('content'); 
  console.log(Client.content);

  res.render('list',{info : Client.content});
})

router.post('/delete',async function(req,res,next){ //displaying the watchlist
  const id = req.body.id;
  const Client = await clientModel.findOneAndUpdate({username : 'a'},{$pull : {content : {_id :id }}},{new : true});
  await Client.save();
  await contentModel.deleteOne({ _id: id });
  console.log();

  res.redirect('/list');
})

router.post('/show',function(req,res,next){ // display particular content on click
 
  const data = {
    title : req.body.title,
    pictureUrl : req.body.picture_url,
    year :  req.body.year,
    plot :  req.body.plot,
    rate :  req.body.rate,
    time :  req.body.time
  }
  console.log(req.body);

  // Render the EJS template and pass the data as variables
  res.render('showAnime', { info: data});
  
})

router.post('/show2',function(req,res,next){ // display particular content on click
 
  const data = {
    title : req.body.title,
    pictureUrl : req.body.picture_url,
    id : req.body.id
  }
  console.log(req.body);

  // Render the EJS template and pass the data as variables
  res.render('show2', { info: data});
  
})


router.get('/login',function(req,res,next){
  res.render('login');
})

router.get('/register',function(req,res,next){
  res.render('register');
})



/*-------------------------------------------------------------------------*/
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
    res.redirect("/login"); 
}

router.get('/p',isLoggedIn ,async function(req,res,next){
  

  res.render('p')
})
router.get('/cesha' , isLoggedIn, async function(req,res,next){
  const posts = await eventModel.find().populate('admin');

  const postsWithImages = await Promise.all(posts.map(async (post) => {
    const downloadStream = bucket.openDownloadStreamByName(post.image);
    
    let imageBase64 = '';
    downloadStream.on('data', (chunk) => {
      imageBase64 += chunk.toString('base64');
    });

    await new Promise((resolve) => {
      downloadStream.on('end', () => {
        post.imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        //console.log(`Image Base64 for ${post.title}: ${post.imageBase64}`);
        resolve();
      });
    });
    
    return post;
  }));
  res.render('cesha',{postsWithImages, nav : true });
})

router.post('/adminReg',async function(req,res,next){

  var adminData = new adminModel({
    username : req.body.username  })
    adminModel.register(adminData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res , function(){
      res.render('p');
    })
  })
  //adminModel.register(adminData, req.body.password)
})

router.post('/adminLog',passport.authenticate("local" , {
  successRedirect : "/p",
  failureRedirect : "/"
}) , function(req, res, next){});

router.post('/createEvent', async function(req, res, next) { //
  try {

    const admin = await adminModel.findOne({ username: 'a' });

    const uploadedFile = req.files.Img;
    

    const fileBuffer = Buffer.from(uploadedFile.data);

    const uploadStream = bucket.openUploadStream(uploadedFile.name);
    const readStream = Readable.from(fileBuffer);
    

    readStream.pipe(uploadStream);

    uploadStream.on('finish', async () => {
      const event = await eventModel.create({
        admin: admin._id,
        title: req.body.title,
        description: req.body.description,
        image: uploadedFile.name,
      });

      res.redirect('/');
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 

});



router.post('/studentReg',async function(req,res,next){

  var studentData = new studentModel({
    username : req.body.username  })
    studentModel.register(studentData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res , function(){
      res.redirect('/cesha');
    })
  })
  //adminModel.register(adminData, req.body.password)
})

router.post('/studentLog', passport.authenticate("local" , {
  successRedirect : "/cesha",
  failureRedirect : "/"
}) , function(req, res, next){});


router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
router.post('/go',async function(req,res,next){
  const event = await eventModel.findOne({ _id: req.body.id });
  console.log(req.session.passport);
  event.public.push( req.session.passport.user);
      await event.save();
    res.redirect('/cesha');
})

module.exports = router;
