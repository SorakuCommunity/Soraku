// api/v2/badges endpoint

// Define api version (testing not final)
const version = "v.1.0.0";

/**
 * Simple endpoint for /api/v2/badges/ in general
 * @param {*} req - request
 * @param {*} res - response
 * 
 * Returns:
 * - 200 (ok): status, message
 * - 405 (method not allowed): status, message
 */
export default function handler(req, res) {
    if (req.method === "GET") {
      res.status(200).json({ status: "ok", version: version, message: "Badges endpoint is under maintence!" });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}