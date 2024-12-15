class UsernameGenerator {
  async generateUsername(email = "", options = {}) {
    const defaultOptions = {
      maxLength: 5,
      includeRandomNumber: true,
    };

    const { maxLength, includeRandomNumber } = {
      ...defaultOptions,
      ...options,
    };

    // Base username: remove all spaces
    let baseUsername = email.split("@")[0].toLowerCase();

    baseUsername = baseUsername.substring(0, maxLength);
    let username = baseUsername;

    if (includeRandomNumber) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
      username = `${baseUsername}${randomSuffix}`;
    } else {
      throw new Error(
        "Unable to generate a unique username. Try increasing maxLength or allowing random numbers."
      );
    }
    return username;
  }
}

module.exports = UsernameGenerator;
