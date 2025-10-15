export default async (req, context) => {
    const url = new URL(req.url);
    const path = url.pathname.replace('/.netlify/functions/vam-api', '');
    const queryString = url.search;

    try {
        const response = await fetch(
            `https://api.vam.ac.uk/v2/objects${path}${queryString}`,
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
};
