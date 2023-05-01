// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export const config = {
  runtime: "edge",
};

export default function handler(req) {
  return new Response(
    JSON.stringify({
      name: "Jim Halpert",
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
