const rateLimiter = () => {
  return () => {
    return true;
  };
};

module.exports = rateLimiter;
