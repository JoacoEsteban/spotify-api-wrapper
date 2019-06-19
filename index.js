const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var request = require("request");
const app = express();

var token;
const SPOTIFY_API_ADDRESS = 'https://api.spotify.com/v1'


app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/', (req, res) => res.render('pages/index'))

app.get('/artist/:name', (req, res, next) => 
{
  const requestArtist = () => 
  {
    const {name} = req.params;

    request(
    {//maskes a spotify API Call with the artist name coming from the get request
      url:`${SPOTIFY_API_ADDRESS}/search?q=${name}&type=artist&limit=1`,
      headers: { Authorization: `Bearer ${token}` }
    }, (error, response, body) => 
    {
      if(error) return next(error);

      res.json(JSON.parse(body));
    });
  }

  requestArtist();

});





var options = 
{ 
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: 
    { 
        'Authorization': 'Basic  ODMzYmJmNDcxOGIzNDRiM2E5MTUxM2ViNmUwMGFmNzE6ODk0M2U4OGE5ODFmNGMzY2E3MTI4N2NjODM4ZTUzMmQ=' 
    },
    form: 
    {
        'grant_type': 'client_credentials'
    } 
};

//Requests New token
request(options, function (error, response, body) 
{
  if (error) throw new Error(error);
  body = JSON.parse(body)
  token = body.access_token;
  console.log(token);
});

//Sets an interval in order to get a new token when the old one expires
setInterval(() => {
  
  request(options, function (error, response, body) 
  {
    if (error) throw new Error(error);
    body = JSON.parse(body)
    token = body.access_token;
    console.log(token);
  });
}, 3600*1000);