// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import fs from "fs/promises";
// import path from "path";

// const app = express();
// const PORT = 3001;
// const DATA_FILE = "./tickets.json";

// app.use(cors());
// app.use(bodyParser.json());

// // Ініціалізація файлу даних
// async function initDataFile() {
//   try {
//     await fs.access(DATA_FILE);
//   } catch {
//     await fs.writeFile(DATA_FILE, JSON.stringify([]));
//   }
// }

// // Отримати всі тікети
// app.get("/api/tickets", async (req, res) => {
//   try {
//     const data = await fs.readFile(DATA_FILE, "utf-8");
//     res.json(JSON.parse(data));
//   } catch (error) {
//     res.status(500).json({ error: "Failed to read tickets" });
//   }
// });

// // Додати новий тікет
// app.post("/api/tickets", async (req, res) => {
//   try {
//     const data = await fs.readFile(DATA_FILE, "utf-8");
//     const tickets = JSON.parse(data);

//     const newTicket = {
//       id: `TKT-${Date.now()}`,
//       ...req.body,
//       createdAt: new Date().toISOString(),
//       status: "open",
//     };

//     tickets.push(newTicket);
//     await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2));

//     res.status(201).json(newTicket);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create ticket" });
//   }
// });

// // Оновити тікет
// app.put("/api/tickets/:id", async (req, res) => {
//   try {
//     const data = await fs.readFile(DATA_FILE, "utf-8");
//     const tickets = JSON.parse(data);

//     const index = tickets.findIndex((t) => t.id === req.params.id);
//     if (index === -1) {
//       return res.status(404).json({ error: "Ticket not found" });
//     }

//     tickets[index] = { ...tickets[index], ...req.body };
//     await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2));

//     res.json(tickets[index]);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update ticket" });
//   }
// });

// // Видалити тікет
// app.delete("/api/tickets/:id", async (req, res) => {
//   try {
//     const data = await fs.readFile(DATA_FILE, "utf-8");
//     let tickets = JSON.parse(data);

//     tickets = tickets.filter((t) => t.id !== req.params.id);
//     await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2));

//     res.json({ message: "Ticket deleted" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete ticket" });
//   }
// });

// app.listen(PORT, async () => {
//   await initDataFile();
//   console.log(`✅ STAS Backend Server running on http://localhost:${PORT}`);
// });
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url"; // 1. Додали цей імпорт для роботи шляхів

// 2. Налаштування шляхів (це потрібно, бо ми використовуємо "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = "./tickets.json";

app.use(cors());
app.use(bodyParser.json());

// 3. 👇 ГОЛОВНА ЗМІНА: Вказуємо серверу роздавати файли з папки 'dist'
app.use(express.static(path.join(__dirname, "dist")));

// Ініціалізація файлу даних
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// --- ТВОЇ СТАРІ API ROUTES (Вони без змін) ---

// Отримати всі тікети
app.get("/api/tickets", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read tickets" });
  }
});

// Додати новий тікет
app.post("/api/tickets", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const tickets = JSON.parse(data);

    const newTicket = {
      id: `TKT-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      status: "open",
    };

    tickets.push(newTicket);
    await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2));

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Оновити тікет
app.put("/api/tickets/:id", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const tickets = JSON.parse(data);

    const index = tickets.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    tickets[index] = { ...tickets[index], ...req.body };
    await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2));

    res.json(tickets[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

// Видалити тікет
app.delete("/api/tickets/:id", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    let tickets = JSON.parse(data);

    tickets = tickets.filter((t) => t.id !== req.params.id);
    await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2));

    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

// 4. 👇 ЩЕ ОДНА ЗМІНА В КІНЦІ:
// Якщо запит не потрапив в API, віддаємо головну сторінку сайту
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, async () => {
  await initDataFile();
  console.log(`✅ Server running on http://localhost:${PORT}`);
});