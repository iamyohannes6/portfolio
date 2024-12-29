const faunadb = require('faunadb');
const q = faunadb.query;

// Create a new Fauna client with your secret key
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY
});

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      try {
        const { data } = await client.query(
          q.Get(q.Match(q.Index('portfolio_data_by_id'), 'main'))
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data)
        };
      } catch (error) {
        if (error.name === 'NotFound') {
          // Return default data if no data exists
          const defaultData = {
            hero: {
              title: "Yohannes Goitom",
              subtitle: "Graphic Designer & Brand Identity Specialist"
            },
            about: {
              text: "I'm a passionate graphic designer with a keen eye for detail.",
              additional: "With expertise in both digital and print design."
            },
            projects: [],
            contact: {
              email: "iamyohannes6@outlook.com",
              linkedin: "https://et.linkedin.com/in/yohannes-goitom-1b29022ab",
              pinterest: "https://www.pinterest.com/iamyohannes6/",
              instagram: "https://www.instagram.com/iamyohannes6/",
              telegram: "https://t.me/iamyohannes"
            }
          };
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(defaultData)
          };
        }
        throw error;
      }
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      try {
        await client.query(
          q.Replace(
            q.Select(
              'ref',
              q.Get(q.Match(q.Index('portfolio_data_by_id'), 'main'))
            ),
            { data }
          )
        );
      } catch (error) {
        if (error.name === 'NotFound') {
          await client.query(
            q.Create(q.Collection('portfolio_data'), {
              data,
              id: 'main'
            })
          );
        } else {
          throw error;
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Data updated successfully' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
