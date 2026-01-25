export default function isAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.redirect("/admin/login");
}
