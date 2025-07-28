const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "your-secret-key";
const expiresIn = "1h";

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

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
function generateUniqueId(users) {
  // Find the maximum ID in the database
  const maxId = users.reduce((max, user) => {
    // Convert ID to number if it's a string
    const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    return userId > max ? userId : max;
  }, 0);
  return maxId + 1;
}

// Register endpoint
server.post("/api/v1/auth/register", (req, res) => {
  console.log("Register endpoint called; request body:");
  console.log(req.body);

  const { email, phone, name, password, confirmPassword } = req.body;

  if (!email || !phone || !password || !confirmPassword) {
    const status = 400;
    const message = "Email, phone, password and confirm password are required";
    res.status(status).json({ status, message });
    return;
  }

  if (password !== confirmPassword) {
    const status = 400;
    const message = "Passwords do not match";
    res.status(status).json({ status, message });
    return;
  }

  // Check if user already exists
  const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
  const existingUser = userdb.users.find((user) => user.email === email);

  if (existingUser) {
    const status = 409;
    const message = "User already exists";
    res.status(status).json({ status, message });
    return;
  }

  // Create new user with unique ID
  const newUser = {
    id: generateUniqueId(userdb.users),
    email,
    phone,
    password,
    name: name || email.split("@")[0], // Use provided name or generate from email
    role: "user",
    createdAt: new Date().toISOString(),
  };

  // Add user to database
  userdb.users.push(newUser);
  fs.writeFileSync("./db.json", JSON.stringify(userdb, null, 2));

  // Create token
  const access_token = createToken({
    email,
    role: newUser.role,
    id: newUser.id,
  });

  console.log("Access Token:" + access_token);

  const userResponse = {
    id: newUser.id,
    email: newUser.email,
    phone: newUser.phone,
    name: newUser.name,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };

  res.status(201).json({ access_token, user: userResponse });
});

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

// Use default router for all JSON Server routes
server.use("/api/v1", router);

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
});
