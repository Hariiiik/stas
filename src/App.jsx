import React, { useState, useEffect } from "react";
import { analyzeSentiment } from "./utils";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  Download,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Filter,
} from "lucide-react";

const STAS_Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("7days");
  const [filterCategory, setFilterCategory] = useState("all");

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    channel: "email",
    product: "general",
  });

  // --- 1. ЛОГІКА SENTIMENT ANALYSIS ---
  const analyzeSentiment = (text) => {
    if (!text) return "0.00";

    const tokens = text.toLowerCase().match(/\w+|[^\w\s]/g) || [];

    const dictionary = {
      abusive: -3,
      admirable: 3,
      amazing: 4,
      awesome: 4,
      awful: -3,
      bad: -3,
      beautiful: 3,
      best: 3,
      blocked: -2,
      broken: -3,
      bug: -2,
      cant: -2,
      crash: -3,
      critical: -3,
      damn: -4,
      dead: -3,
      difficult: -1,
      disaster: -4,
      down: -2,
      easy: 2,
      effective: 2,
      error: -2,
      excellent: 4,
      fail: -2,
      fantastic: 4,
      fast: 2,
      fault: -2,
      fine: 1,
      fix: 1,
      frustrating: -2,
      garbage: -3,
      glad: 3,
      good: 3,
      great: 3,
      happy: 3,
      hate: -3,
      help: 2,
      horrible: -3,
      hurt: -2,
      impressive: 3,
      issue: -2,
      like: 2,
      love: 3,
      lovely: 3,
      mad: -3,
      mistake: -2,
      nice: 3,
      outstanding: 5,
      perfect: 3,
      please: 1,
      problem: -2,
      regret: -2,
      resolved: 2,
      sad: -2,
      satisfied: 2,
      shit: -4,
      slow: -2,
      solution: 2,
      sorry: -1,
      stop: -1,
      success: 3,
      superb: 5,
      thanks: 2,
      terrible: -3,
      trouble: -2,
      unhappy: -2,
      useless: -2,
      warning: -3,
      wonderful: 4,
      worst: -3,
      wrong: -2,
      yes: 1,
    };

    const emojis = {
      "😀": 2,
      "😃": 2,
      "😄": 2,
      "😁": 2,
      "😊": 2,
      "🙂": 1,
      "😍": 3,
      "🤩": 3,
      "😡": -3,
      "🤬": -4,
      "😠": -2,
      "😞": -2,
      "😢": -2,
      "😭": -3,
      "👎": -2,
      "👍": 2,
      "🔥": 2,
      "❤️": 3,
      "💔": -3,
    };

    const negators = ["not", "no", "never", "dont", "cant", "wont", "isnt"];
    const intensifiers = [
      "very",
      "really",
      "extremely",
      "absolutely",
      "totally",
      "so",
    ];

    let score = 0;
    let wordCount = 0;

    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      let itemScore = dictionary[word] || emojis[word] || 0;

      if (itemScore !== 0) {
        if (i > 0) {
          const prevWord = tokens[i - 1];
          if (negators.includes(prevWord)) {
            itemScore = -itemScore;
          }
          if (intensifiers.includes(prevWord)) {
            itemScore = itemScore > 0 ? itemScore + 1 : itemScore - 1;
          }
        }
        score += itemScore;
        wordCount++;
      }
    }

    const normalizedScore =
      wordCount > 0 ? Math.min(Math.max(score / (wordCount * 3), -1), 1) : 0;
    return normalizedScore.toFixed(2);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // const loadTickets = async () => {
  //   try {
  //     const stored = await window.storage.list("ticket:");
  //     if (stored && stored.keys && stored.keys.length > 0) {
  //       const loadedTickets = [];
  //       for (const key of stored.keys) {
  //         const result = await window.storage.get(key);
  //         if (result) {
  //           loadedTickets.push(JSON.parse(result.value));
  //         }
  //       }
  //       setTickets(
  //         loadedTickets.sort(
  //           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //         )
  //       );
  //     } else {
  //       generateInitialTickets();
  //     }
  //   } catch (error) {
  //     console.log("Creating new data structure");
  //     generateInitialTickets();
  //   }
  // };

const loadTickets = async () => {
    try {
      const response = await fetch("/api/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  const generateInitialTickets = () => {
    const categories = [
      "Billing",
      "Technical Issue",
      "Feature Request",
      "Account",
      "Bug Report",
    ];
    const channels = ["email", "chat", "phone", "social"];
    const products = ["Product A", "Product B", "Product C"];
    const statuses = ["open", "in_progress", "resolved", "closed"];
    const sampleDescriptions = {
      positive: [
        "I love this feature, it works perfectly!",
        "Great job team, thanks for the help.",
        "Very happy with the quick resolution.",
      ],
      negative: [
        "This is terrible, nothing works.",
        "I hate this update, it broke my workflow.",
        "Very bad experience, extremely slow.",
      ],
      neutral: [
        "How do I change my password?",
        "When will the next update be released?",
        "Just checking on my ticket status.",
      ],
    };

    const sampleTickets = [];
    const now = Date.now();

    for (let i = 0; i < 25; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const sentimentType =
        Math.random() > 0.6
          ? "positive"
          : Math.random() > 0.3
          ? "negative"
          : "neutral";
      const baseDesc =
        sampleDescriptions[sentimentType][
          Math.floor(Math.random() * sampleDescriptions[sentimentType].length)
        ];

      const ticket = {
        id: `TKT-${1000 + i}`,
        subject: `${category} - Issue #${i + 1}`,
        description: baseDesc,
        category,
        sentiment: analyzeSentiment(baseDesc),
        priority:
          Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        channel: channels[Math.floor(Math.random() * channels.length)],
        product: products[Math.floor(Math.random() * products.length)],
        createdAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
      };

      if (ticket.status === "resolved" || ticket.status === "closed") {
        ticket.resolvedAt = new Date(
          now - (daysAgo - 2) * 24 * 60 * 60 * 1000
        ).toISOString();
      }

      sampleTickets.push(ticket);
      saveTicket(ticket);
    }

    setTickets(
      sampleTickets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
  };

  // const saveTicket = async (ticket) => {
  //   try {
  //     await window.storage.set(`ticket:${ticket.id}`, JSON.stringify(ticket));
  //   } catch (error) {
  //     console.error("Error saving ticket:", error);
  //   }
  // };

  // Знайти saveTicket і замінити на:
const saveTicket = async (ticket) => {
  try {
    // Відправляємо POST запит на сервер
    await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });
    // Після збереження перезавантажуємо список, щоб побачити оновлення
    loadTickets(); 
  } catch (error) {
    console.error("Error saving ticket:", error);
  }
};

  // const handleStatusChange = async (ticketId, newStatus) => {
  //   const updatedTickets = tickets.map((ticket) => {
  //     if (ticket.id === ticketId) {
  //       const updatedTicket = {
  //         ...ticket,
  //         status: newStatus,
  //         resolvedAt:
  //           newStatus === "resolved" || newStatus === "closed"
  //             ? new Date().toISOString()
  //             : null,
  //       };
  //       saveTicket(updatedTicket);
  //       return updatedTicket;
  //     }
  //     return ticket;
  //   });
  //   setTickets(updatedTickets);
  // };

  const handleStatusChange = async (ticketId, newStatus) => {
  // Зберігаємо логіку розрахунку дати завершення зі старого коду
  const resolvedAt = 
    (newStatus === "resolved" || newStatus === "closed") 
      ? new Date().toISOString() 
      : null;

  try {
    await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Відправляємо на сервер і статус, і дату
        body: JSON.stringify({ 
            status: newStatus,
            resolvedAt: resolvedAt 
        })
    });
    // Перезавантажуємо таблицю, щоб побачити зміни з сервера
    loadTickets(); 
  } catch (error) {
    console.error("Error updating ticket:", error);
  }
};

  const detectPriority = (text) => {
    const urgentWords = [
      "urgent",
      "asap",
      "critical",
      "down",
      "blocked",
      "emergency",
      "immediately",
    ];
    const lowerText = text.toLowerCase();
    for (const word of urgentWords) {
      if (lowerText.includes(word)) return "high";
    }
    return Math.random() > 0.5 ? "medium" : "low";
  };

  const categorizeTicket = (text) => {
    const categories = {
      "Billing": ["payment", "invoice", "billing", "charge", "refund", "cost"],
      "Technical Issue": [
        "error",
        "bug",
        "crash",
        "broken",
        "not working",
        "fail",
      ],
      "Feature Request": [
        "feature",
        "add",
        "suggest",
        "would like",
        "enhancement",
      ],
      "Account": ["account", "login", "password", "access", "permissions"],
      "Bug Report": ["bug", "issue", "problem", "defect"],
    };
    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) return category;
      }
    }
    return "General";
  };

  const handleAddTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      alert("Please fill in subject and description");
      return;
    }

    const fullText = newTicket.subject + " " + newTicket.description;
    const ticket = {
      id: `TKT-${Date.now()}`,
      ...newTicket,
      category: categorizeTicket(fullText),
      sentiment: analyzeSentiment(newTicket.description),
      priority: detectPriority(fullText),
      status: "open",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };

    const updatedTickets = [ticket, ...tickets];
    setTickets(updatedTickets);
    await saveTicket(ticket);
    setNewTicket({
      subject: "",
      description: "",
      channel: "email",
      product: "general",
    });
    setShowAddModal(false);
  };

  // --- Filtering & Metrics ---
  const filterTicketsByPeriod = (tickets) => {
    const now = Date.now();
    const periods = {
      "today": 24 * 60 * 60 * 1000,
      "7days": 7 * 24 * 60 * 60 * 1000,
      "30days": 30 * 24 * 60 * 60 * 1000,
      "all": Infinity,
    };
    return tickets.filter(
      (t) => now - new Date(t.createdAt).getTime() < periods[filterPeriod]
    );
  };

  const filterTicketsByCategory = (tickets) => {
    if (filterCategory === "all") return tickets;
    return tickets.filter((t) => t.category === filterCategory);
  };

  const filteredTickets = filterTicketsByCategory(
    filterTicketsByPeriod(tickets)
  );

  const totalTickets = filteredTickets.length;
  const openTickets = filteredTickets.filter((t) => t.status === "open").length;
  const resolvedTickets = filteredTickets.filter(
    (t) => t.status === "resolved" || t.status === "closed"
  ).length;

  const avgSentiment =
    filteredTickets.length > 0
      ? (
          filteredTickets.reduce((sum, t) => sum + parseFloat(t.sentiment), 0) /
          filteredTickets.length
        ).toFixed(2)
      : 0;

  // --- ЛОГІКА ДЛЯ ДІАГРАМИ (Зміни тут) ---
  const getBarChartData = () => {
    if (filterCategory === "all") {
      // Стандартна логіка: Топ Категорії
      return Object.entries(
        filteredTickets.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([name, value]) => ({ name, value, fill: "#3b82f6" })) // Синій колір за замовчуванням
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    } else {
      // Нова логіка: Якщо вибрана категорія -> показуємо Sentiment Breakdown
      const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };

      filteredTickets.forEach((t) => {
        const val = parseFloat(t.sentiment);
        if (val > 0.2) sentimentCounts.Positive++;
        else if (val < -0.2) sentimentCounts.Negative++;
        else sentimentCounts.Neutral++;
      });

      return [
        { name: "Positive", value: sentimentCounts.Positive, fill: "#10b981" }, // Зелений
        { name: "Neutral", value: sentimentCounts.Neutral, fill: "#9ca3af" }, // Сірий
        { name: "Negative", value: sentimentCounts.Negative, fill: "#ef4444" }, // Червоний
      ];
    }
  };

  const chartData = getBarChartData();
  const chartTitle =
    filterCategory === "all" ? "Top Topics" : `Sentiment in ${filterCategory}`;

  const sentimentData = [
    {
      name: "Positive",
      value: filteredTickets.filter((t) => parseFloat(t.sentiment) > 0.2)
        .length,
    },
    {
      name: "Neutral",
      value: filteredTickets.filter(
        (t) => Math.abs(parseFloat(t.sentiment)) <= 0.2
      ).length,
    },
    {
      name: "Negative",
      value: filteredTickets.filter((t) => parseFloat(t.sentiment) < -0.2)
        .length,
    },
  ];

  const COLORS = ["#10b981", "#9ca3af", "#ef4444"];

  const exportReport = () => {
    const csvContent = [
      [
        "ID",
        "Subject",
        "Category",
        "Sentiment",
        "Priority",
        "Status",
        "Created At",
      ],
      ...filteredTickets.map((t) => [
        t.id,
        t.subject,
        t.category,
        t.sentiment,
        t.priority,
        t.status,
        t.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stas-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const uniqueCategories = [...new Set(tickets.map((t) => t.category))];

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            STAS Dashboard
          </h1>
          <p className='text-gray-600'>Support Ticket Analysis System</p>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow p-4 mb-6 flex gap-4 items-center flex-wrap'>
          <div className='flex items-center gap-2'>
            <Filter className='w-5 h-5 text-gray-500' />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className='border border-gray-300 rounded px-3 py-2'
            >
              <option value='today'>Today</option>
              <option value='7days'>Last 7 Days</option>
              <option value='30days'>Last 30 Days</option>
              <option value='all'>All Time</option>
            </select>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className='border border-gray-300 rounded px-3 py-2'
          >
            <option value='all'>All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className='ml-auto flex gap-2'>
            <button
              onClick={() => setShowAddModal(true)}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2'
            >
              <Plus className='w-4 h-4' />
              New Ticket
            </button>
            <button
              onClick={exportReport}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2'
            >
              <Download className='w-4 h-4' />
              Export CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Tickets</p>
                <p className='text-3xl font-bold text-gray-900'>
                  {totalTickets}
                </p>
              </div>
              <TrendingUp className='w-8 h-8 text-blue-500' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Open Tickets</p>
                <p className='text-3xl font-bold text-orange-600'>
                  {openTickets}
                </p>
              </div>
              <Clock className='w-8 h-8 text-orange-500' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Resolved</p>
                <p className='text-3xl font-bold text-green-600'>
                  {resolvedTickets}
                </p>
              </div>
              <CheckCircle className='w-8 h-8 text-green-500' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Avg Sentiment</p>
                <p
                  className={`text-3xl font-bold ${
                    avgSentiment > 0.2
                      ? "text-green-600"
                      : avgSentiment < -0.2
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {avgSentiment}
                </p>
              </div>
              <AlertCircle className='w-8 h-8 text-purple-500' />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-lg font-semibold mb-4'>{chartTitle}</h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey='value'>
                  {/* Цей блок мапить кольори для кожного стовпчика */}
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-lg font-semibold mb-4'>
              Sentiment Distribution
            </h3>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {sentimentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Recent Tickets</h3>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      ID
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Subject
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Category
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Sentiment
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Priority
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Status (Edit)
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredTickets.slice(0, 10).map((ticket) => (
                    <tr key={ticket.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-3 text-sm font-medium text-gray-900'>
                        {ticket.id}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        <div className='font-medium'>{ticket.subject}</div>
                        <div className='text-xs text-gray-500 truncate max-w-xs'>
                          {ticket.description}
                        </div>
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>
                          {ticket.category}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        <span
                          className={`font-medium ${
                            parseFloat(ticket.sentiment) > 0.2
                              ? "text-green-600"
                              : parseFloat(ticket.sentiment) < -0.2
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {ticket.sentiment}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ticket.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded text-xs border cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          <option value='open'>open</option>
                          <option value='in_progress'>in_progress</option>
                          <option value='resolved'>resolved</option>
                          <option value='closed'>closed</option>
                        </select>
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-600'>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Ticket Modal */}
        {showAddModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full p-6'>
              <h2 className='text-2xl font-bold mb-4'>Create New Ticket</h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Subject
                  </label>
                  <input
                    type='text'
                    value={newTicket.subject}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, subject: e.target.value })
                    }
                    className='w-full border border-gray-300 rounded px-3 py-2'
                    placeholder='Brief description of the issue'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        description: e.target.value,
                      })
                    }
                    className='w-full border border-gray-300 rounded px-3 py-2 h-32'
                    placeholder='Detailed description of the issue'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Channel
                    </label>
                    <select
                      value={newTicket.channel}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, channel: e.target.value })
                      }
                      className='w-full border border-gray-300 rounded px-3 py-2'
                    >
                      <option value='email'>Email</option>
                      <option value='chat'>Chat</option>
                      <option value='phone'>Phone</option>
                      <option value='social'>Social Media</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Product
                    </label>
                    <select
                      value={newTicket.product}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, product: e.target.value })
                      }
                      className='w-full border border-gray-300 rounded px-3 py-2'
                    >
                      <option value='Product A'>Product A</option>
                      <option value='Product B'>Product B</option>
                      <option value='Product C'>Product C</option>
                      <option value='general'>General</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  onClick={() => setShowAddModal(false)}
                  className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTicket}
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default STAS_Dashboard;
