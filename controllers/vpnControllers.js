import fs from "fs";
import path from "path";
import { log } from "console";

const __dirname = path.resolve();

export const getVPNConfigs = (req, res) => {
  try {
    log("Request URL:", req.originalUrl);

    const configDir = path.join(__dirname, "configs");
    const files = fs.readdirSync(configDir).filter(file => file.endsWith(".conf"));

    const configs = files.map(file => {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      // remove ".conf" from file name
      const cleanName = file.replace(".conf", "");

      return {
        name: cleanName, // e.g. tokyo, netherlands
        content: content
      };
    });

    res.json({ servers: configs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load configs" });
  }
};
