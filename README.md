<img width="660" height="316" alt="image" src="https://github.com/user-attachments/assets/0114c139-f7ff-4707-86e5-10e74a5692a9" />

# 🧠 PNS-bot atau Pharosname-bot

_PNS-bot_ atau [pharosname.com](https://test.pharosname.com/) adalah bot CLI modular berbasis Node.js yang dirancang untuk mengotomatisasi proses tertentu pada domain atau ekosistem crypto. Dibuat oleh [shenrx](https://github.com/shenrx), bot ini menggabungkan tampilan terminal yang keren dengan kekuatan scripting modern.

---
## 🥰 Daftar di Testnet PharosNetwork
Link Join : [klik ME!](https://testnet.pharosnetwork.xyz/experience?inviteCode=7pw16G7oAD1Itte0)

ref Code : 
```bash
7pw16G7oAD1Itte0
```
---

## ⚙️ Struktur File

- `config.mjs` – Konfigurasi utama bot.
- `index.mjs` – Entry point dan inti dari proses bot.
- `package.json` – Daftar dependencies dan informasi modul.
- `pk.txt` – Data atau kunci tertentu (misalnya: wallet privat, API keys, dll).

---

## 🚀 Fitur Utama

- Terminal UI dengan tampilan ASCII dan logBox (via `blessed`, `figlet`, `chalk`)
- Interaksi crypto & blockchain via `ethers.js`
- Fetching data terstruktur dengan `node-fetch` dan pengelolaan task limit dengan `p-limit`
- Scripting modular berbasis ESM (`type: module`)

---

## 📦 Dependencies

Pastikan sistem Anda telah menginstal:
- **Node.js v18+**
- Internet access (untuk fetch dan API interaction)

## 🛠️ Cara Instalasi
1. Clone repo:
  ```bash
  git clone https://github.com/shenrx/PNS-bot.git
  cd PNS-bot
```

2. Instal dependencies:
  ```bash
  npm install
```

3. Jalankan bot:
  ```bash
  node index.mjs
```

## ⚠️ Perhatian!
- Jangan bagikan pk.txt jika berisi kunci privat atau data sensitif.
- Gunakan terminal yang mendukung warna dan karakter ASCII untuk pengalaman terbaik.
- Pastikan environment Anda mendukung ESM (ECMAScript Module).
- Bot ini hanya untuk tujuan edukasi dan eksperimen. Gunakan dengan tanggung jawab.

## ☕ Donasi
Jika bot ini bermanfaat dan ingin mendukung pengembangannya:
- Binance UID : 139725117
- Bybit UID : 26748682
Atau dukung langsung ke profil : [shenrx](https://github.com/shenrx)

## 📄 Lisensi
Bot ini bersifat open source. Silakan fork, modifikasi, dan gunakan sesuai etika open source. Sertakan atribusi ke pembuat asli jika digunakan secara publik.
