(async () => {
const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const baileys = await import('@whiskeysockets/baileys');
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

// Thumbnail URL moja tu
const thumbnailUrl = "https://files.catbox.moe/w145zu.jpg";

// Newsletter context
const newsletterContext = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363382023564830@newsletter",
            newsletterName: "B.M.B TECH OFFICIAL"
        }
    }
};

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            const items = ["Safari"];
            const randomItem = items[Math.floor(Math.random() * items.length)];

            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    let rf = __dirname + `/temp/${id}/creds.json`;

                    const generateRandomText = () => {
                        const prefix = "3EB";
                        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let text = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            text += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        return text;
                    };

                    const randomText = generateRandomText();

                    try {
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "NOVA~" + string_session;
                        let code = await sock.sendMessage(sock.user.id, { text: md });

                        // Caption na links intact, thumbnail moja tu, na newsletter
                        let desc = `*✅ SESSION ID GENERATED SUCCESSFULLY ✅*
______________________________
*Join to groups:*
📢 💬
*https://chat.whatsapp.com/BKoqNbYGCkK5apBNP0nzI3*

*🔔 like comment and subscribe:*
*🔔❤️
🪄 YouTube  https://www.youtube.com/@bmb-tech

> Powered by NOVA-XMD
🌲👍
*https://github.com/novaxmd*
______________________________

> *© Powered by dev NOVA-XMD 🪀*`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            ...newsletterContext,
                            contextInfo: {
                                ...newsletterContext.contextInfo,
                                externalAdReply: {
                                    thumbnailUrl: thumbnailUrl,
                                    mediaType: 1, // pure image
                                    renderLargerThumbnail: true
                                }
                            }
                        }, { quoted: code });

                    } catch (e) {
                        let ddd = await sock.sendMessage(sock.user.id, { text: e });
                        let desc = `*Don't Share this code. Use only for deploying NOVA-XMD*`;
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            ...newsletterContext,
                            contextInfo: {
                                ...newsletterContext.contextInfo,
                                externalAdReply: {
                                    thumbnailUrl: thumbnailUrl,
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        }, { quoted: ddd });
                    }

                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} Connected ✅ Restarting process...`);
                    await delay(10);
                    process.exit();

                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    GIFTED_MD_PAIR_CODE();
                }
            });

        } catch (err) {
            console.log("Service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }

    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;

})();