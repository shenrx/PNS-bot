/**
 * 🌐 PHAROS Registrar Bot
 * 🛠 Dibuat oleh: https://github.com/shenrx
 */

import chalk from "chalk";
import figlet from "figlet";
import blessed from "blessed";
import { JsonRpcProvider, Contract, formatEther } from "ethers";
import { Wallet } from "ethers/wallet";
import crypto from "crypto";
import fs from "fs/promises";
import pLimit from "p-limit";
import config from "./config.mjs";

// ──────────────────────────────────────────
// 🎨 UI: ASCII Header + Log Box
// ──────────────────────────────────────────
const screen = blessed.screen({ smartCSR: true, title: "PNS Bot by SHENRX" });
const screenHeight = screen.height;

const headerBox = blessed.box({
  top: 0,
  left: "center",
  width: "100%",
  height: Math.max(6, Math.floor(screenHeight * 0.15)),
  tags: true,
  style: { fg: "yellow", bg: "default" }
});

const logBox = blessed.log({
  label: " Transaction Logs - testnet.pharosname.com",
  top: headerBox.height,
  left: "center",
  width: "100%",
  height: "100%-" + headerBox.height,
  border: { type: "line" },
  scrollable: true,
  alwaysScroll: true,
  mouse: true,
  keys: true,
  vi: true,
  tags: true,
  scrollbar: { ch: " ", inverse: true, style: { bg: "cyan" } },
  style: { border: { fg: "magenta" }, bg: "default" },
  padding: { left: 1 },
  wrap: true
});

screen.append(headerBox);
screen.append(logBox);

// 🔧 Render queue untuk header
let renderQueue = [];
let isRendering = false;
let isHeaderRendered = false;

function safeRender() {
  renderQueue.push(true);
  if (isRendering) return;
  isRendering = true;

  setTimeout(() => {
    if (!isHeaderRendered) {
      figlet.text("SHENRX", { font: "Standard" }, (err, data) => {
        const output = err || !data
          ? "{center}{bold}SHENRX{/bold}{/center}"
          : `{center}{cyan-fg}${data}{/cyan-fg}{/center}`;
        headerBox.setContent(output);
        isHeaderRendered = true;
        screen.render();
        renderQueue.shift();
        isRendering = false;
        if (renderQueue.length > 0) safeRender();
      });
      return;
    }

    screen.render();
    renderQueue.shift();
    isRendering = false;
    if (renderQueue.length > 0) safeRender();
  }, 100);
}

function appendLog(text) {
  logBox.log(text);
  screen.render();
}

safeRender();

// ──────────────────────────────────────────
// ⚙️ Proses Registrasi Domain
// ──────────────────────────────────────────
const controllerAbi = [
  "function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) view returns (bytes32)",
  "function commit(bytes32 commitment)",
  "function rentPrice(string name, uint256 duration) view returns (tuple(uint256 base, uint256 premium))",
  "function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) payable"
];

// Sensor alamat address
function getDisplayAddress(address) {
  return config.SHOW_FULL_ADDRESS
    ? address
    : address.slice(0, 3) + "..." + address.slice(-2);
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function extractError(err) {
  return err?.info?.error?.message || err?.message || "Unknown error";
}

function randomName(len = 9) {
  return [...Array(len)].map(() =>
    "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
  ).join("");
}

async function registerDomain(privateKey, index, regIndex) {
  const provider = new JsonRpcProvider(config.RPC_URL);
  const wallet = new Wallet(privateKey).connect(provider);
  const controller = new Contract(config.CONTROLLER_ADDRESS, controllerAbi, wallet);

  const owner = wallet.address;
  const name = randomName();
  const secret = `0x${crypto.randomBytes(32).toString("hex")}`;

appendLog(`[Wallet #${index + 1} | Attempt ${regIndex}] ${getDisplayAddress(owner)} → ${name}.phrs`);

  for (let retry = 0; retry < 2; retry++) {
    try {
      const commitment = await controller.makeCommitment(
        name, owner, config.DURATION, secret,
        config.RESOLVER, config.DATA, config.REVERSE_RECORD,
        config.OWNER_CONTROLLED_FUSES
      );

      await controller.commit(commitment);
      appendLog(chalk.yellow(`📝 [Wallet #${index + 1} Attempt ${regIndex}] -> Commitment sent -> ⏳ Sleeping for 65 seconds...`));
      await delay(65000);

      const price = await controller.rentPrice(name, config.DURATION);
      const value = price.base + price.premium;
      const balance = await provider.getBalance(owner);

      appendLog(chalk.white(`[${getDisplayAddress(owner)}] 💰 Price: ${formatEther(value)} | 💳 Balance: ${formatEther(balance)}`));

      const tx = await controller.register(
        name, owner, config.DURATION, secret,
        config.RESOLVER, config.DATA, config.REVERSE_RECORD,
        config.OWNER_CONTROLLED_FUSES,
        { value }
      );
      await tx.wait();
      appendLog(chalk.bgGreen(`[Wallet #${index + 1} | Attempt ${regIndex}] ✅ Registration successful!`));

      const randomDelay = Math.floor(Math.random() * 5000) + 5000;
      appendLog(chalk.italic.white(`⏳ [Wallet #${index + 1}] - Waiting ${randomDelay / 1000}s before continuing...`));
      await delay(randomDelay);
      return;
    } catch (err) {
      const msg = extractError(err);
      appendLog(chalk.red(`❌ [Wallet #${index + 1}] - Retry ${retry + 1}: ${msg}`));
      if (retry < 2) {
        appendLog(chalk.yellow(`🔄 Retrying in 60s...`));
        await delay(60000);
      }
    }
  }
}

async function main() {
  const content = await fs.readFile("pk.txt", "utf-8");
  const keys = content.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const limit = pLimit(config.MAX_CONCURRENCY);
  const tasks = [];

  keys.forEach((pk, idx) => {
    tasks.push(limit(async () => {
      for (let j = 0; j < config.REG_PER_KEY; j++) {
        await registerDomain(pk, idx, j + 1);
      }
    }));
  });

  await Promise.all(tasks);
  appendLog(chalk.bgGreen("🏁 All tasks completed!"));
}

async function mainWrapper() {
  while (true) {
    try {
      await main();
      appendLog(chalk.bgRed("🔁 Restarting in 5 minutes..."));
      await delay(300000);
    } catch (err) {
      appendLog(chalk.red(`🔥 Fatal: ${extractError(err)}`));
      await delay(60000);
    }
  }
}

process.on("unhandledRejection", reason => {
  appendLog(chalk.red(`💥 Unhandled: ${extractError(reason)}`));
  setTimeout(() => mainWrapper(), 60000);
});

process.on("uncaughtException", err => {
  appendLog(chalk.red(`💥 Exception: ${extractError(err)}`));
  setTimeout(() => mainWrapper(), 60000);
});

mainWrapper();
