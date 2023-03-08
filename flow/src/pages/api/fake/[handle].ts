export default function handler(req, res) {
  res.status(404).json({ code: 404, msg: '404 Not Found!' });
}
