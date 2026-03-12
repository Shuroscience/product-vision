export default async function handler(req, res) {
  const apiKey = process.env.LINEAR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Linear not configured' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ticketId = req.query.ticket;
  if (!ticketId) {
    return res.status(400).json({ error: 'Missing ticket parameter' });
  }

  const parts = ticketId.split('-');
  if (parts.length !== 2) {
    return res.status(400).json({ error: 'Invalid ticket format' });
  }

  const teamKey = parts[0];
  const number = parseInt(parts[1], 10);

  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify({
      query: `query GetIssue($filter: IssueFilter) {
        issues(filter: $filter, first: 1) {
          nodes { identifier title url }
        }
      }`,
      variables: {
        filter: {
          number: { eq: number },
          team: { key: { eq: teamKey } },
        },
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: `Linear API: ${response.status}` });
  }

  const data = await response.json();
  const issue = data?.data?.issues?.nodes?.[0];

  return res.status(200).json({
    id: ticketId,
    title: issue?.title || null,
    url: issue?.url || `https://linear.app/nextsense/issue/${ticketId}`,
  });
}
