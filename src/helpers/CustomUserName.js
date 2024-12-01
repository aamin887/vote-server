const Username = require("../model/username.model");

class UsernameGenerator {
  async generateUsername(name, email = "", options = {}) {
    const defaultOptions = {
      maxLength: 10,
      includeRandomNumber: true,
    };

    const { maxLength, includeRandomNumber } = {
      ...defaultOptions,
      ...options,
    };

    // Base username: remove all spaces
    let baseUsername = name.replace(/\s+/g, "").toLowerCase();
    if (!baseUsername && email) {
      baseUsername = email.split("@")[0].toLowerCase(); // Use email prefix if name is unavailable
    }
    baseUsername = baseUsername.substring(0, maxLength);
    let username = baseUsername;

    // Ensure uniqueness by checking the database
    while (await this.isUsernameInUse(username)) {
      if (includeRandomNumber) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
        username = `${baseUsername}${randomSuffix}`;
      } else {
        throw new Error(
          "Unable to generate a unique username. Try increasing maxLength or allowing random numbers."
        );
      }
    }

    // Save the generated username to the database
    await this.saveUsername(username);
    return username;
  }

  async isUsernameInUse(username) {
    const existing = await Username.findOne({ username });
    return !!existing; // Return true if a username is found
  }

  async saveUsername(username) {
    const newUsername = new Username({ username });
    await newUsername.save();
  }
}

module.exports = UsernameGenerator;
