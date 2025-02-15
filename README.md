# 🎟️ Projeto Ticket de Venda de Ingressos

## 🚀 Stack Tecnológico

- 🟦 **Typescript**
- ⚡ **Express**

---

## 📌 Requisitos do Sistema

O sistema será uma **API REST** projetada para permitir a criação, gerenciamento e venda de ingressos para eventos por meio de parceiros. Ele será **escalável** para lidar com milhares de acessos simultâneos.

---

## 🔥 Regras de Negócio

### 1️⃣ Gerenciamento de Tickets

- Apenas o **parceiro criador do evento** pode gerenciar os tickets associados.
- Tickets são criados **em lote** e começam com o status `disponível`.

### 2️⃣ Compra de Tickets

- Um cliente pode comprar **vários tickets** de diferentes eventos em uma única compra.
- Somente **um cliente por vez** pode comprar um ticket específico (**controle de concorrência**).
- Se a compra falhar, os dados devem ser **registrados** com o motivo da falha.

### 3️⃣ Cancelamento de Compras

- Um cliente pode cancelar sua compra, **liberando os tickets para venda novamente**.
- O **histórico de alterações de status** deve ser mantido.

### 4️⃣ Escalabilidade

- O sistema deve **suportar altas cargas** de acessos simultâneos.

### 5️⃣ Parceiros

- Parceiros serão **registrados no sistema** e terão acesso a um **painel de controle**.
- Poderão **criar eventos** e **gerenciar os tickets associados**.
- Poderão **visualizar as vendas** de seus eventos (**futuro desenvolvimento**).

### 6️⃣ Clientes

- Clientes serão **registrados no sistema** e poderão **comprar tickets para eventos**.
- Poderão **visualizar os eventos disponíveis** e comprar tickets.
- Poderão **cancelar compras e visualizar o histórico** (**possível implementação futura**).

---

## 📦 Entidades Principais

### 🏢 1. Parceiros

Representam os **criadores de eventos e tickets**.

| Campo           | Descrição                            |
|----------------|------------------------------------|
| `id`           | Identificador único (UUID ou numérico) |
| `nome`         | Nome completo do parceiro         |
| `email`        | E-mail para login e contato       |
| `senha`        | Senha criptografada               |
| `nome_empresa` | Nome da empresa associada        |

### 🧑‍💻 2. Clientes

Representam os **compradores de ingressos**.

| Campo       | Descrição                           |
|------------|-----------------------------------|
| `id`       | Identificador único               |
| `nome`     | Nome completo do cliente          |
| `email`    | E-mail para login e contato       |
| `senha`    | Senha criptografada               |
| `endereco` | Endereço do cliente               |
| `telefone` | Telefone para contato             |

### 🎭 3. Eventos

Representam os **eventos criados pelos parceiros**.

| Campo       | Descrição                                |
|------------|----------------------------------------|
| `id`       | Identificador único                    |
| `nome`     | Nome do evento                         |
| `descricao` | Breve descrição do evento             |
| `data`     | Data e hora do evento                 |
| `local`    | Local onde será realizado o evento    |
| `parceiro_id` | ID do parceiro que criou o evento (FK) |

### 🎫 4. Tickets

Representam os **ingressos disponíveis** para cada evento.

| Campo       | Descrição                                   |
|------------|-------------------------------------------|
| `id`       | Identificador único                       |
| `evento_id` | ID do evento associado (FK)             |
| `local`    | Identificador do assento (e.g., A1, B2)  |
| `preco`    | Preço do ticket                          |
| `status`   | Disponível, vendido                      |

---

## 📌 Conclusão

Este projeto foi planejado para garantir **escalabilidade, segurança e uma experiência otimizada** para parceiros e clientes. A implementação será feita **seguindo boas práticas de desenvolvimento** e utilizando tecnologias modernas como **Typescript e Express** para garantir robustez e manutenibilidade ao sistema.

💡 *Sugestões e melhorias são sempre bem-vindas!* ✨

