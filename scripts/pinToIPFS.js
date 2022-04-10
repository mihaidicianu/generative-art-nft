require('dotenv').config({path:__dirname+'/./../.env'});

const fs = require('fs')
const path = require('path')
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);
const prompt = require("prompt-sync")({ sigint: true });

async function main() {
   
    pinata.testAuthentication().then((result) => {
        //handle successful authentication here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });

    const edition = prompt("What edition are you working on? ");
    console.log(`${edition} NFTs incoming.`);

    const img_path = "./images_" + edition

    if (!fs.existsSync(img_path)) {
        throw new Error('No folder named ' + img_path + ' was found!')
    }

    pinata.pinFromFS(img_path).then((result) => {
        //handle results here
        console.log(result);
        fs.writeFile('cid_' + edition + '.txt', result.IpfsHash, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }).catch((err) => {
        //handle error here
        console.log(err);
    });

    
/*
    let hashes = []
    const readableStreamForFile = fs.createReadStream(imgPath+`${files[1]}`);
    let result = await pinata.pinFileToIPFS(readableStreamForFile);
    
    for (var i = 0; i < files.length; i++) {
        console.log("Pinning to Pinata ...");
        const readableStreamForFile = fs.createReadStream(imgPath+`${files[i]}`);
        let result = await pinata.pinFileToIPFS(readableStreamForFile);
        hashes.push(result.IpfsHash);
    }

    let data = JSON.stringify(hashes, null, 2)

    fs.writeFile('hashes.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    })
    */
}

main()