const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/servicios', (req, res) => {
  res.render('services');
});

app.get('/quienes-somos', (req, res) => {
  res.render('about');
});

app.get('/portafolio', (req, res) => {
  res.render('portfolio');
});

app.get('/contacto', (req, res) => {
  res.render('contact');
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
