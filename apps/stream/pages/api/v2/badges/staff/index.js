// api/v2/badges/staff endpoint
import * as fs from 'fs';
import * as path from 'path';


const filePath = path.join('/root/1anime/public', 'verified.json');
const version = "v.1.0.0";

/**
 * 
 */
export default async function handler(req, res) {

    const token = process.env.API_BEARER_TOKEN;
    const correctToken = `Bearer ${token}`

    console.info(req.headers)
    console.info(req.headers.authorization)
    console.info(correctToken)

    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ status: "fail", version, message: `Method ${req.method} Not Allowed` });
    }

    if (!req.headers.authorization || req.headers.authorization !== correctToken) {
        return res.status(401).json({ status: "fail", version, message: "Unauthorized." });
    }

    try {
        if (!req.body.username || !req.body.method) {
            return res.status(500).json({ status: "fail", version, message: "No user/ method provided" });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        let data = JSON.parse(fileContent);

        if (req.body.method === "add") {
            data.staffUsers.push(req.body.username);
        } else if (req.body.method === "remove") {
            let index = data.staffUsers.indexOf(req.body.username);
            if (index !== -1) { data.staffUsers.splice(index, 1); }
        } else {
            return res.status(500).json({ status: "fail", version, message: "Invalid method provided" });
        }

        const updatedJson = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, updatedJson, "utf-8");
        
        return res.status(200).json({ status: "ok", version, message: `${req.body.method} user: ${req.body.username} at verifiedUsers!` });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ status: "fail", version, message: "An error occurred." });
    }
}
