import express from 'express';

const app = express();  
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    res.send();
});

// informações do parceiro
app.post('/partner', (req, res) => {
    const { name, email, password, company_name } = req.body;
});
// informações do cliente (customer )
app.post('/customer', (req, res) => {
    const { name, email, password, address, phone } = req.body;
});

// registrar novos eventos (events)
app.post('/partners/events', (req, res) => {
    const { name, description, date, location } = req.body;
});

// listar eventos (events)
app.get('/partners/events', (req, res) => {
   
});

// listar eventos por id (events)
app.get('/partners/events/:eventId', (req, res) => {
    const { eventId } = req.params;
    res.send();
    console.log(eventId);
});

app.get('/events', (req, res) => {
   
});

// listar eventos por id (events)
app.get('/events/:eventId', (req, res) => {
    const { eventId } = req.params;
    res.send();
    console.log(eventId);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});