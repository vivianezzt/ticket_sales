import express from 'express'; 
import * as mysql from 'mysql2/promise'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'

function createConnection() {
  return mysql.createConnection({
    host: 'localhost',  
    user: 'root',      
    password: 'root',   
    database: 'tickets', 
    port: 33060,        
  });
}
// MVC (Model View Controller - Aquitetura em camadas
// Middleware - pequenos controllers até chegar a rota, executado e passado para o proximo (Onion Styles)
const app = express(); 
app.use(express.json());
const unprotectedRoutes = [
    {method: "POST", path: "/auth/login"},
    {method: "POST", path: "/customers/ register"},
    {method: "POST", path: "/partners/register"},
    {method: "GET", path: "/events"},
]
app.use(async(req, res, next) => {
    const isUnprotectedRoute = unprotectedRoutes.some( 
        route => route.method == req.method && req.path.startsWith(route.path)
    )
    if(isUnprotectedRoute){
        return next();
    }
    const token = req.headers['authorization']?.split(" ")[1]
    if(!token){
        res.status(401).json({message: "No token provider"})
        return;
    }
    try{
        const payload = jwt.verify(token, '123456') as {id: number, email: string}
        const connection = await createConnection()
        const [rows]: any = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [payload.id]);
        const user = rows.length ? rows[0] : null
        if(!user){
            res.status(401).json({message: "Failed to authenticate token"})
            return;
        }
        req.user = user as { id: number, email:string };
        next();
    }catch(error){
        res.status(401).json({message: "Failed to authenticate token"})
    }
})
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Define uma rota POST para o caminho '/auth/login' do servidor.
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const connection = await createConnection();
    try {
        const [rows]: any = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        const user = rows.length ? rows[0] : null;
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, "123456", { expiresIn: "1h" });
            res.json({ token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } finally {
        await connection.end();
    }
});

// informações do parceiro
app.post('/partners/register', async (req, res) => {
    const { name, email, password, company_name } = req.body;
    const connection = await createConnection();
    try {
        const createdAt = new Date();
        const hashPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
            [name, email, hashPassword, createdAt]
        );
        const userId = userResult.insertId;
        const [partnersResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)',
            [userId, company_name, createdAt]
        );
        res.status(201).json({
            id: partnersResult.insertId,
            user_id: userId,
            company_name,
            created_at: createdAt
        });

    } finally {
        await connection.end();
    }
});

// informações do cliente (customer )
app.post('/customers/register', async (req, res) => { 
    const { name, email, password, address, phone } = req.body; 
    const connection = await createConnection(); 
    try {
        const createdAt = new Date(); 
        const hashPassword = await bcrypt.hash(password, 10); 
        const [userResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)', 
            [name, email, hashPassword, createdAt]
        );
        const userId = userResult.insertId;
        const [customersResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)', 
            [userId, address, phone, createdAt]
        );
        res.status(201).json({ 
            id: customersResult.insertId, 
            name,                        
            user_id: userId,             
            address,                     
            phone,                        
            created_at: createdAt         
        });
    } finally {
        await connection.end(); 
    }
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

// Rota para listar todos os eventos 
app.get('/events', (req, res) => {
   
});

// Rota para listar eventos por ID, identificados pelo eventId
app.get('/events/:eventId', (req, res) => {
    const { eventId } = req.params;
    res.send();
    console.log(eventId);
});

// Inicializa o servidor na porta 3000
app.listen(3000, async () => {
    const connection = await createConnection();
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    await connection.execute("TRUNCATE TABLE users");
    await connection.execute("TRUNCATE TABLE partners");
    await connection.execute("TRUNCATE TABLE events");
    await connection.execute("TRUNCATE TABLE customers");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log('Server is running in http://localhost:3000');
});
