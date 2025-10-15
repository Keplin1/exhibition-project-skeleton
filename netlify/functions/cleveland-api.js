export default async (req, context) => {
    const url = new URL(req.url);
    const queryString = url.search;

    try {
        const response = await fetch(
            `https://openaccess-api.clevelandart.org/api/artworks/${queryString}`,
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
