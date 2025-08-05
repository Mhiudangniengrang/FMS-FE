const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "your-secret-key";
const expiresIn = "1h";

// Activity log types
const LOG_TYPES = {
  LOGIN: "login",
  LOGOUT: "logout",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  VIEW: "view",
};

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Protected routes middleware - chỉ bảo vệ những route cần authentication
server.use(/^(?!\/api\/v1\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Error in authorization format";
    res.status(status).json({ status, message });
    return;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verifyToken(token);

    if (decoded) {
      req.userData = decoded;
      next();
    } else {
      const status = 401;
      const message = "Invalid token";
      res.status(status).json({ status, message });
    }
  } catch (err) {
    const status = 401;
    const message = "Error token is revoked";
    res.status(status).json({ status, message });
  }
});

// Helper function to create JWT token
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Helper function to verify JWT token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

// Helper function to check if user exists
function isAuthenticated({ email, password }) {
  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  return (
    userdb.users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
}

// Helper function to get user by email
function getUserByEmail(email) {
  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  return userdb.users.find((user) => user.email === email);
}

// Helper function to generate a unique ID
function generateUniqueId(items) {
  // Find the maximum ID in the database
  const maxId = items.reduce((max, item) => {
    // Convert ID to number if it's a string
    const itemId =
      typeof item.id === "string" ? parseInt(item.id, 10) : item.id;
    return itemId > max ? itemId : max;
  }, 0);
  return maxId + 1;
}

// Helper function to log user activity
function logUserActivity(
  userId,
  username,
  action,
  details,
  targetId = null,
  role = null
) {
  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));

  // Initialize userLogs array if it doesn't exist
  if (!userdb.userLogs) {
    userdb.userLogs = [];
  }

  const logEntry = {
    id: generateUniqueId(userdb.userLogs),
    userId,
    username,
    action,
    details,
    targetId,
    role,
    timestamp: new Date().toISOString(),
  };

  userdb.userLogs.push(logEntry);
  fs.writeFileSync("./db.json", JSON.stringify(userdb, null, 2));

  return logEntry;
}

// Login endpoint
server.post("/api/v1/auth/login", (req, res) => {
  console.log("Login endpoint called; request body:");
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    const status = 400;
    const message = "Email and password are required";
    res.status(status).json({ status, message });
    return;
  }

  if (!isAuthenticated({ email, password })) {
    const status = 401;
    const message = "Incorrect email or password";
    res.status(status).json({ status, message });
    return;
  }

  const user = getUserByEmail(email);
  const access_token = createToken({ email, role: user.role, id: user.id });

  console.log("Access Token:" + access_token);

  // Log user login activity
  logUserActivity(
    user.id,
    user.name,
    LOG_TYPES.LOGIN,
    `User ${user.name} logged in`,
    null,
    "auth"
  );

  const userResponse = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };

  res.status(200).json({ access_token, user: userResponse });
});

// Get user info endpoint
server.get("/api/v1/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 401,
      message: "Authorization header is required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = getUserByEmail(decoded.email);
      if (user) {
        const userResponse = {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        };
        res.status(200).json({ user: userResponse });
      } else {
        res.status(404).json({ status: 404, message: "User not found" });
      }
    } else {
      res.status(401).json({ status: 401, message: "Invalid token" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: "Invalid token" });
  }
});

// Assets endpoints
server.get("/api/v1/assets", (req, res) => {
  console.log("Get assets endpoint called");

  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  res.status(200).json(userdb.assets);
});

server.get("/api/v1/assets/:id", (req, res) => {
  console.log("Get asset by ID endpoint called");

  const assetId = parseInt(req.params.id);
  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  const asset = userdb.assets.find((a) => a.id === assetId);

  if (!asset) {
    res.status(404).json({ message: "Asset not found" });
    return;
  }

  res.status(200).json(asset);
});

// Maintenance endpoints
server.get("/api/v1/maintenance", (req, res) => {
  console.log("Get maintenance requests endpoint called");

  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  res.status(200).json(userdb.maintenance);
});

server.post("/api/v1/maintenance", (req, res) => {
  console.log("Create maintenance request endpoint called");
  console.log(req.body);

  const { assetId, title, description, priority } = req.body;

  if (!assetId || !title || !description || !priority) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));

  // Find asset
  const asset = userdb.assets.find((a) => a.id === assetId);
  if (!asset) {
    res.status(404).json({ message: "Asset not found" });
    return;
  }

  // Get user from token (simplified)
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Authorization header required" });
    return;
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  const user = userdb.users.find((u) => u.email === decoded.email);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Create new maintenance request
  const newRequest = {
    id: Math.max(...userdb.maintenance.map((m) => m.id), 0) + 1,
    assetId,
    assetName: asset.name,
    assetCode: asset.code,
    requestedBy: user.id,
    requestedByName: user.name,
    title,
    description,
    priority,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  userdb.maintenance.push(newRequest);
  fs.writeFileSync("./db.json", JSON.stringify(userdb, null, 2));

  res.status(201).json(newRequest);
});

// Update maintenance request (for assignment and status changes)
server.put("/api/v1/maintenance/:id", (req, res) => {
  console.log("Update maintenance request endpoint called");
  console.log(req.body);

  const requestId = parseInt(req.params.id);
  const { status, assignedTo, notes } = req.body;

  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));

  // Find the maintenance request
  const requestIndex = userdb.maintenance.findIndex((m) => m.id === requestId);
  if (requestIndex === -1) {
    res.status(404).json({ message: "Maintenance request not found" });
    return;
  }

  // Update the request
  if (status) userdb.maintenance[requestIndex].status = status;
  if (assignedTo !== undefined) {
    userdb.maintenance[requestIndex].assignedTo = assignedTo;

    // Find assigned user name
    if (assignedTo > 0) {
      const assignedUser = userdb.users.find((u) => u.id === assignedTo);
      if (assignedUser) {
        userdb.maintenance[requestIndex].assignedToName = assignedUser.name;
      }
    } else {
      userdb.maintenance[requestIndex].assignedToName = null;
    }
  }
  if (notes) userdb.maintenance[requestIndex].notes = notes;

  userdb.maintenance[requestIndex].updatedAt = new Date().toISOString();

  fs.writeFileSync("./db.json", JSON.stringify(userdb, null, 2));

  res.status(200).json(userdb.maintenance[requestIndex]);
});

// Get technicians (users with roles that can handle maintenance)
server.get("/api/v1/users/technicians", (req, res) => {
  console.log("Get technicians endpoint called");

  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  const technicians = userdb.users
    .filter((user) => ["staff", "supervisor", "manager"].includes(user.role))
    .map((user) => ({ id: user.id, name: user.name, role: user.role }));

  res.status(200).json(technicians);
});

// Get user activity logs (admin only)
server.get("/api/v1/user-logs", (req, res) => {
  // Check if user is admin
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 401,
      message: "Authorization header is required",
    });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  const user = userdb.users.find((u) => u.email === decoded.email);

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      status: 403,
      message: "Access denied. Admin privileges required.",
    });
  }

  // Get query parameters for filtering
  const {
    userId,
    action,
    startDate,
    endDate,
    limit = 100,
    page = 1,
  } = req.query;

  // Initialize logs array if it doesn't exist
  if (!userdb.userLogs) {
    userdb.userLogs = [];
  }

  // Apply filters
  let filteredLogs = [...userdb.userLogs];

  if (userId) {
    filteredLogs = filteredLogs.filter(
      (log) => log.userId === parseInt(userId)
    );
  }

  if (action) {
    filteredLogs = filteredLogs.filter((log) => log.action === action);
  }

  if (startDate) {
    const start = new Date(startDate).getTime();
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.timestamp).getTime() >= start
    );
  }

  if (endDate) {
    const end = new Date(endDate).getTime();
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.timestamp).getTime() <= end
    );
  }

  // Sort logs by timestamp (newest first)
  filteredLogs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Pagination
  const pageSize = parseInt(limit);
  const startIndex = (parseInt(page) - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  // Add role to logs
  const logsWithRole = paginatedLogs.map((log) => {
    const logUser = userdb.users.find((u) => u.id === log.userId);
    return { ...log, role: logUser ? logUser.role : null };
  });

  // Log this view action
  if (user) {
    logUserActivity(
      user.id,
      user.name,
      LOG_TYPES.VIEW,
      `Admin ${user.name} viewed user activity logs`,
      null,
      "user-logs"
    );
  }

  res.status(200).json({
    logs: logsWithRole,
    total: filteredLogs.length,
    page: parseInt(page),
    pageSize,
    totalPages: Math.ceil(filteredLogs.length / pageSize),
  });
});

// Use default router for all JSON Server routes
server.use(
  "/api/v1",
  (req, res, next) => {
    // Log user activities BEFORE json-server processes the request
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);

        if (
          decoded &&
          (req.method !== "GET" ||
            req.url.includes("/maintenance") ||
            req.url.includes("/users"))
        ) {
          const user = getUserByEmail(decoded.email);
          if (user && user.role !== "admin") {
            console.log(
              "📝 Ghi log trong json-server middleware cho user:",
              user.name,
              "- Role:",
              user.role
            );
            // Determine action type based on HTTP method
            let actionType = LOG_TYPES.VIEW;
            if (req.method === "POST") actionType = LOG_TYPES.CREATE;
            if (req.method === "PUT") actionType = LOG_TYPES.UPDATE;
            if (req.method === "DELETE") actionType = LOG_TYPES.DELETE;

            // Determine target type from URL
            const urlParts = req.url.split("/");
            const targetType = urlParts[urlParts.length - 2] || "unknown";

            // Extract target ID if available
            const targetId = !isNaN(parseInt(urlParts[urlParts.length - 1]))
              ? parseInt(urlParts[urlParts.length - 1])
              : null;

            logUserActivity(
              user.id,
              user.name,
              actionType,
              `${user.name} ${actionType} ${targetType}${
                targetId ? ` (ID: ${targetId})` : ""
              }`,
              targetId,
              targetType
            );
          } else if (user && user.role === "admin") {
            console.log(
              "🚫 Không ghi log cho admin trong json-server middleware:",
              user.name
            );
          }
        }
      } catch (error) {
        console.log("Error in activity logging:", error);
      }
    }

    next();
  },
  router
);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log("🔐 Auth endpoints:");
  console.log("POST http://localhost:" + port + "/api/v1/auth/login");
  console.log("POST http://localhost:" + port + "/api/v1/auth/register");
  console.log("GET http://localhost:" + port + "/api/v1/auth/me");
  console.log("📊 JSON Server endpoints:");
  console.log("GET http://localhost:" + port + "/api/v1/users");
  console.log("GET http://localhost:" + port + "/api/v1/assets");
  console.log("POST http://localhost:" + port + "/api/v1/maintenance");
  console.log("PUT http://localhost:" + port + "/api/v1/maintenance/:id");
  console.log("📊 Admin endpoints:");
  console.log("GET http://localhost:" + port + "/api/v1/user-logs");
});
