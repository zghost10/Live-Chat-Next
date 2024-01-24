import Ably from "ably/promises";

if(!process.env.ABLY_API_KEY){
  throw Error("Missing environment variable: ABLY_API_KEY")
}
const apiKey = process.env.ABLY_API_KEY

export async function POST(request: Request) {
    const client = new Ably.Realtime(apiKey);
    const tokenRequestData = await client.auth.createTokenRequest({ 
      clientId: 'ably-nextjs-demo',
      timestamp: new Date().getTime()
    });
    return Response.json(tokenRequestData);
};