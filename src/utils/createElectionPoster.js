const sharp = require("sharp");
// const gcsUploader = require("./gcsUpload");
const fs = require("fs");

const svgText = `<svg
    width="100%"
    height="100%"
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="800" height="600" fill="#3498db" />
    <g>
      <rect x="0" y="0" width="800" height="50" fill="#2ecc71" />
      <rect x="0" y="550" width="800" height="50" fill="#2ecc71" />
    </g>
    <text
      x="400"
      y="150"
      font-family="Arial, sans-serif"
      font-size="60"
      font-weight="bold"
      text-anchor="middle"
      fill="#ffffff"
    >
      VOTE FOR
    </text>
    <text
      x="400"
      y="250"
      font-family="Arial, sans-serif"
      font-size="80"
      font-weight="bold"
      text-anchor="middle"
      fill="#ffffff"
    >
      JANE DOE
    </text>
    <text
      x="400"
      y="320"
      font-family="Arial, sans-serif"
      font-size="30"
      font-style="italic"
      text-anchor="middle"
      fill="#2ecc71"
    >
      "A Brighter Future for All"
    </text>
    <path
      d="M400 360 L413 400 L455 400 L421 425 L434 465 L400 440 L366 465 L379 425 L345 400 L387 400 Z"
      fill="#2ecc71"
    />
    <text
      x="400"
      y="520"
      font-family="Arial, sans-serif"
      font-size="40"
      font-weight="bold"
      text-anchor="middle"
      fill="#ffffff"
    >
      NOVEMBER 5, 2024
    </text>
  </svg>`;

async function createElectionPoster() {
  try {
    // Convert SVG to PNG using Sharp
    const buffer = await sharp(Buffer.from(svgText))
      .resize(800, 600) // Ensure the correct dimensions
      .png()
      .toBuffer();

    // Define the output file name
    const fileName = "election_poster.png";

    // Save locally (optional)
    fs.writeFileSync(fileName, buffer);

    console.log(
      `Election poster uploaded successfully to ${bucketName}/${fileName}`
    );
  } catch (error) {
    console.error("Error creating or uploading election poster:", error);
  }
}

createElectionPoster();
