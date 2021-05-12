import dotenv from "dotenv";
import Cli from "core-cli";
dotenv.config();
new Cli(process.argv.slice(2));