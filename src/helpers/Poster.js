const sharp = require("sharp");
const gcsUploader = require("./gcsUpload");

// Create a customizable election poster
async function createElectionPoster(electionName, creator, description) {
  try {
    // Define the dimensions and create a blank canvas
    const width = 900;
    const height = 1000;

    // Background color (blueish gradient)
    const background = sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 50, g: 100, b: 200, alpha: 1 }, // Blue background
      },
    });

    // Overlay text using SVG
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          .title { font-size: 70px; fill: #fff; font-weight: bold; font-family: Arial, sans-serif; }
          .candidate { font-size: 50px; fill: #ffcc00; font-weight: bold; font-family: Arial, sans-serif; }
          .details { font-size: 40px; fill: #fff; font-family: Arial, sans-serif; }
        </style>
        <text x="50%" y="20%" text-anchor="middle" class="title">${electionName}</text>
        <text x="50%" y="50%" text-anchor="middle" class="candidate">${creator}</text>
        <text x="50%" y="70%" text-anchor="middle" class="details">${description}</text>
      </svg>
    `;

    // Convert the SVG into a buffer
    const textImage = Buffer.from(svgText);

    // Combine background and text using sharp
    const outputBuffer = await background
      .composite([{ input: textImage, top: 0, left: 0 }]) // Overlay text
      .png() // Output as PNG
      .toBuffer();

    const poster = await gcsUploader(outputBuffer, electionName + ".png");

    return poster;
  } catch (error) {
    throw new Error("Error creating election poster:", error);
  }
}

module.exports = createElectionPoster;
