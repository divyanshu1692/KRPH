import zlib from "zlib";
import jwt from "jsonwebtoken";

export class UtilService {

    constructor() {
    }

    static async generateJwtToken(id, username) {
        const timestamp = Date.now() / 1000
        const token = jwt.sign(
            {
                expiresIn: '30d',
                iat: timestamp,
                id,
                username
            },
            process.env.JWT_SECRET
        )
        return token
    }

    async hashPassword() {

    }

    async GZip(payload) {
        let data = '';
        const stringify = JSON.stringify(payload);
        const buffer = await zlib.gzipSync(stringify);
        data = buffer.toString('base64')
        return data;
    }


        async  unGZip(data) {
         const buffer = Buffer.from(data, 'base64');
    
        const uncompressedBuffer = await new Promise((resolve, reject) => {
        zlib.gunzip(buffer, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
    
    const jsonString = uncompressedBuffer.toString('utf-8');
    const originalPayload = JSON.parse(jsonString);
    
    return originalPayload;
}


    GetSingleUnicodeHex(x) {
        let result = "", notation = "";
        for (let i = 0; i < x.length; i++)
            result += notation + ("000" + x[i].charCodeAt(0).toString(16)).substr(-4);
        return result;
    }

}
