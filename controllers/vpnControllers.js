import fs from "fs";
import path from "path";

const __dirname = path.resolve();

// Simple server info with flags
const serverInfo = {
  "wg-US-FREE-22": { country: "United States", flag: "🇺🇸", city: "New York" },
  "wg-NL-FREE-217": { country: "Netherlands", flag: "🇳🇱", city: "Amsterdam" },
  "wg-PL-FREE-9": { country: "Poland", flag: "🇵🇱", city: "Warsaw" },
  "wg-RO-FREE-29": { country: "Romania", flag: "🇷🇴", city: "Bucharest" },
  "wg-SG-FREE-11": { country: "Singapore", flag: "🇸🇬", city: "Singapore" },
  "wg-JP-FREE-10": { country: "Japan", flag: "🇯🇵", city: "Tokyo" },
};

export const getVPNConfigs = (req, res) => {
  try {
    const configDir = path.join(__dirname, "configs");
    const files = fs.readdirSync(configDir).filter(file => 
      file.endsWith(".conf") || file.endsWith(".ovpn")
    );

    const configs = files.map(file => {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const cleanName = file.replace(/\.(conf|ovpn)$/, "");
      const info = serverInfo[cleanName] || { 
        country: "Unknown", 
        flag: "🏳️", 
        city: "Unknown" 
      };

      return {
        name: cleanName,
        content: content,
        country: info.country,
        flag: info.flag,
        city: info.city
      };
    });

    res.status(200).json({ servers: configs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load configs" });
  }
};
