function loginRequired(req, res) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

export { loginRequired };
