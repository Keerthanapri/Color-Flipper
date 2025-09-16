const btn = document.getElementById("flip-btn");
const copyBtn = document.getElementById("copy-btn");
const modeBtn = document.getElementById("mode-btn");
const saveBtn = document.getElementById("save-btn");
const colorCode = document.getElementById("color-code");
const colorName = document.getElementById("color-name");
const copyMsg = document.getElementById("copy-msg");
const favoritesContainer = document.getElementById("favorites");

let mode = "HEX"; // Default mode

// ✅ CSS color names with HEX (shortened list, can expand to all 140)
const cssColors = {
  "AliceBlue": "#F0F8FF",
  "AntiqueWhite": "#FAEBD7",
  "Aqua": "#00FFFF",
  "Aquamarine": "#7FFFD4",
  "Azure": "#F0FFFF",
  "Beige": "#F5F5DC",
  "Black": "#000000",
  "Blue": "#0000FF",
  "Brown": "#A52A2A",
  "Chartreuse": "#7FFF00",
  "Chocolate": "#D2691E",
  "Coral": "#FF7F50",
  "CornflowerBlue": "#6495ED",
  "Crimson": "#DC143C",
  "Cyan": "#00FFFF",
  "DarkBlue": "#00008B",
  "DarkCyan": "#008B8B",
  "DarkGoldenRod": "#B8860B",
  "DarkGray": "#A9A9A9",
  "DarkGreen": "#006400",
  "DarkMagenta": "#8B008B",
  "DarkOliveGreen": "#556B2F",
  "DarkOrange": "#FF8C00",
  "DarkOrchid": "#9932CC",
  "DarkRed": "#8B0000",
  "DarkSlateGray": "#2F4F4F",
  "DarkTurquoise": "#00CED1",
  "DarkViolet": "#9400D3",
  "DeepPink": "#FF1493",
  "DeepSkyBlue": "#00BFFF",
  "DimGray": "#696969",
  "DodgerBlue": "#1E90FF",
  "FireBrick": "#B22222",
  "ForestGreen": "#228B22",
  "Fuchsia": "#FF00FF",
  "Gold": "#FFD700",
  "GoldenRod": "#DAA520",
  "Gray": "#808080",
  "Green": "#008000",
  "HotPink": "#FF69B4",
  "IndianRed": "#CD5C5C",
  "Indigo": "#4B0082",
  "Khaki": "#F0E68C",
  "Lavender": "#E6E6FA",
  "LightBlue": "#ADD8E6",
  "LightCoral": "#F08080",
  "LightCyan": "#E0FFFF",
  "LightGreen": "#90EE90",
  "LightPink": "#FFB6C1",
  "LightSalmon": "#FFA07A",
  "LightSeaGreen": "#20B2AA",
  "LightSkyBlue": "#87CEFA",
  "LightSlateGray": "#778899",
  "LightSteelBlue": "#B0C4DE",
  "Lime": "#00FF00",
  "Magenta": "#FF00FF",
  "Maroon": "#800000",
  "MediumAquaMarine": "#66CDAA",
  "MediumBlue": "#0000CD",
  "MediumOrchid": "#BA55D3",
  "MediumPurple": "#9370DB",
  "MediumSeaGreen": "#3CB371",
  "MediumSlateBlue": "#7B68EE",
  "MediumSpringGreen": "#00FA9A",
  "MediumTurquoise": "#48D1CC",
  "MediumVioletRed": "#C71585",
  "MidnightBlue": "#191970",
  "Navy": "#000080",
  "Olive": "#808000",
  "Orange": "#FFA500",
  "OrangeRed": "#FF4500",
  "Orchid": "#DA70D6",
  "PaleGreen": "#98FB98",
  "PaleTurquoise": "#AFEEEE",
  "PaleVioletRed": "#DB7093",
  "Peru": "#CD853F",
  "Pink": "#FFC0CB",
  "Plum": "#DDA0DD",
  "PowderBlue": "#B0E0E6",
  "Purple": "#800080",
  "Red": "#FF0000",
  "RosyBrown": "#BC8F8F",
  "RoyalBlue": "#4169E1",
  "Salmon": "#FA8072",
  "SandyBrown": "#F4A460",
  "SeaGreen": "#2E8B57",
  "Silver": "#C0C0C0",
  "SkyBlue": "#87CEEB",
  "SlateBlue": "#6A5ACD",
  "SlateGray": "#708090",
  "SpringGreen": "#00FF7F",
  "SteelBlue": "#4682B4",
  "Tan": "#D2B48C",
  "Teal": "#008080",
  "Thistle": "#D8BFD8",
  "Tomato": "#FF6347",
  "Turquoise": "#40E0D0",
  "Violet": "#EE82EE",
  "Wheat": "#F5DEB3",
  "White": "#FFFFFF",
  "Yellow": "#FFFF00",
  "YellowGreen": "#9ACD32"
};

// Convert RGB → HEX
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

// Generate random HEX
function getRandomColorHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color.toUpperCase();
}

// HEX → RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

// ✅ Find exact color name if available
// ✅ Find closest CSS color name
function getColorName(hex) {
  // Convert hex to RGB
  const bigint = parseInt(hex.slice(1), 16);
  const r1 = (bigint >> 16) & 255;
  const g1 = (bigint >> 8) & 255;
  const b1 = bigint & 255;

  let closestColor = "Custom Color";
  let minDistance = Infinity;

  for (let name in cssColors) {
    const hex2 = cssColors[name];
    const bigint2 = parseInt(hex2.slice(1), 16);
    const r2 = (bigint2 >> 16) & 255;
    const g2 = (bigint2 >> 8) & 255;
    const b2 = bigint2 & 255;

    const distance = Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  }

  return closestColor;
}
// 🎨 Flip color
btn.addEventListener("click", () => {
  const newColor = getRandomColorHex();
  document.body.style.backgroundColor = newColor;
  colorCode.textContent = mode === "HEX" ? newColor : hexToRgb(newColor);
  colorName.textContent = getColorName(newColor);
  copyMsg.textContent = "";
});
// 📋 Copy code
copyBtn.addEventListener("click", () => {
  const textToCopy = colorCode.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
    copyMsg.textContent = "✅ Copied: " + textToCopy;
    setTimeout(() => (copyMsg.textContent = ""), 2000);
  });
});

// 🔄 Mode switch
modeBtn.addEventListener("click", () => {
  mode = mode === "HEX" ? "RGB" : "HEX";
  modeBtn.textContent = `Mode: ${mode}`;
  const currentBg = window.getComputedStyle(document.body).backgroundColor;

  if (mode === "HEX") {
    const rgb = currentBg.match(/\d+/g).map(Number);
    colorCode.textContent = rgbToHex(rgb[0], rgb[1], rgb[2]);
  } else {
    colorCode.textContent = currentBg;
  }
});

// ⭐ Save favorite
saveBtn.addEventListener("click", () => {
  const colorValue = colorCode.textContent;
  const bgColor =
    mode === "HEX"
      ? colorValue
      : rgbToHex(...colorValue.match(/\d+/g).map(Number));
  const fav = document.createElement("div");
  fav.classList.add("favorite");
  fav.style.backgroundColor = bgColor;
  fav.textContent = "";
  fav.title = bgColor;

  fav.addEventListener("click", () => {
    navigator.clipboard.writeText(bgColor).then(() => {
      copyMsg.textContent = "⭐ Copied Favorite: " + bgColor;
      setTimeout(() => (copyMsg.textContent = ""), 2000);
    });
  });

  favoritesContainer.appendChild(fav);
});