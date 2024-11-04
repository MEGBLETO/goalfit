export const PORT = process.env.PORT || 3000;

export const services = [
  {
    route: "/auth",
    target: "http://localhost:5004",
  },
  {
    route: "/bdd",
    target: "http://localhost:5003",
  },
  {
    route: "/ai",
    target: "http://localhost:5002",
  },
  {
    route: "/mailer",
    target: "http://localhost:5005",
  },
  {
    route: "/payment",
    target: "http://localhost:5006",
  },
];

