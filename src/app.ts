// Importa o framework Express, que facilita a criação de servidores web e gerenciamento de rotas.
import express from 'express'; 

// Importa a biblioteca mysql2 para trabalhar com MySQL de forma assíncrona usando Promises.
import * as mysql from 'mysql2/promise'; 

// Importa a biblioteca bcrypt, que é utilizada para encriptação de senhas de forma segura.
import bcrypt from 'bcrypt'; 

// Função para criar uma conexão com o banco de dados MySQL.
function createConnection() {
  // Retorna a conexão com o banco de dados MySQL usando as configurações fornecidas.
  return mysql.createConnection({
    host: 'localhost',  // O servidor do banco de dados está rodando na máquina local.
    user: 'root',       // Usuário do banco de dados (geralmente 'root' para desenvolvimento).
    password: 'root',   // Senha do banco de dados, definida como 'root'.
    database: 'tickets', // Nome do banco de dados a ser usado.
    port: 33060,         // Porta para conectar ao banco de dados (não é a porta padrão do MySQL).
  });
}

// Cria uma instância do Express para criar o servidor.
const app = express();  

// Configura o Express para interpretar corpos de requisição no formato JSON.
app.use(express.json());

// Define uma rota GET para o caminho raiz ('/') do servidor.
app.get('/', (req, res) => {
  // Retorna uma resposta em formato JSON com uma mensagem simples.
  res.json({ message: 'Hello World!' });
});

// Define uma rota POST para o caminho '/auth/login' do servidor.
app.post('/auth/login', (req, res) => {
    // Desestrutura os valores 'email' e 'password' do corpo da requisição.
    const { email, password } = req.body;
    
    // Exibe no console os valores recebidos para fins de depuração.
    console.log(email, password);
    
    // Envia uma resposta vazia, indicando que a requisição foi recebida.
    res.send();
});


// informações do parceiro
app.post('/partners', async (req, res) => { 
    // Cria uma rota HTTP POST no caminho "/partners". Sempre que uma requisição POST for feita para esse endpoint, a função será executada.

    const { name, email, password, company_name } = req.body;
    // Extrai os valores 'name', 'email', 'password' e 'company_name' do corpo da requisição (dados enviados pelo cliente).

    const connection = await createConnection();
    // Estabelece uma conexão com o banco de dados usando a função createConnection().

    try {
        const createdAt = new Date();
        // Cria uma variável 'createdAt' com a data e hora atuais, para registrar quando o parceiro foi criado.

        const hashPassword = await bcrypt.hash(password, 10);
        // Criptografa a senha do parceiro usando o algoritmo bcrypt com um custo de 10.

        const [userResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)', 
            [name, email, hashPassword, createdAt]
        );
        // Insere os dados do parceiro na tabela 'users' no banco de dados.
        // Os valores (name, email, hashPassword, createdAt) são usados nos placeholders `?` da query.
        // Retorna o resultado da inserção, que contém o ID do registro criado.

        const userId = userResult.insertId;
        // Pega o ID do usuário recém-criado no banco de dados e armazena em 'userId'.

        const [partnersResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)', 
            [userId, company_name, createdAt]
        );
        // Insere os dados do parceiro na tabela 'partners' no banco de dados.
        // Relaciona o parceiro com o usuário criado anteriormente usando 'user_id'.
        // Também salva o nome da empresa e a data de criação.

        res.status(201).json({ 
            id: partnersResult.insertId, // ID do registro recém-criado na tabela 'partners'.
            name,                        // Nome do parceiro.
            email,                       // E-mail do parceiro.
            company_name,                // Nome da empresa do parceiro.
            createdAt                    // Data e hora da criação do registro.
        });
        // Retorna uma resposta com status 201 (Criado) e um objeto JSON contendo os dados do parceiro cadastrado.

    } finally {
        await connection.end();
        // Fecha a conexão com o banco de dados, garantindo que ela seja encerrada mesmo em caso de erro.
    }
});


// informações do cliente (customer )
app.post('/customers', async (req, res) => { // Define uma rota HTTP do tipo POST para o caminho "/customers". Quando uma requisição POST for feita nesse endpoint, a função será executada.
    const { name, email, password, address, phone } = req.body; // Extrai os campos "name", "email", "password", "address" e "phone" do corpo da requisição.

    const connection = await createConnection(); // Cria uma conexão com o banco de dados usando a função createConnection() (deve estar definida em outro lugar no código).

    try {
        const createdAt = new Date(); // Cria um objeto de data e hora atual para registrar quando o usuário foi criado.

        const hashPassword = await bcrypt.hash(password, 10); // Criptografa a senha do usuário usando o algoritmo bcrypt com custo 10.

        // Executa um comando SQL para inserir um novo usuário na tabela "users".
        // Os valores (?, ?, ?, ?) são placeholders que serão substituídos por [name, email, hashPassword, createdAt].
        const [userResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)', 
            [name, email, hashPassword, createdAt]
        );

        const userId = userResult.insertId; // Pega o ID do usuário recém-criado no banco de dados.

        // Executa um comando SQL para inserir um novo registro na tabela "customers", relacionando com o usuário recém-criado.
        const [customersResult] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)', 
            [userId, address, phone, createdAt]
        );

        // Retorna uma resposta JSON com status 201 (Criado), contendo os dados do cliente cadastrado.
        res.status(201).json({ 
            id: customersResult.insertId, // ID do cliente recém-criado.
            name,                         // Nome do usuário.
            user_id: userId,              // ID do usuário recém-criado.
            address,                      // Endereço do cliente.
            phone,                        // Telefone do cliente.
            created_at: createdAt         // Data e hora da criação.
        });
    } finally {
        await connection.end(); // Fecha a conexão com o banco de dados, independentemente de ocorrer erro ou sucesso.
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

app.get('/events', (req, res) => {
   
});

// listar eventos por id (events)
app.get('/events/:eventId', (req, res) => {
    const { eventId } = req.params;
    res.send();
    console.log(eventId);
});

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