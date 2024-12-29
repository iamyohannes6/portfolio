const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY
});

const getPortfolioData = async () => {
  try {
    const { data } = await client.query(
      q.Get(q.Match(q.Index('portfolio_data_by_id'), 'main'))
    );
    return data;
  } catch (error) {
    if (error.name === 'NotFound') {
      // Return default data if no data exists
      return {
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
    }
    throw error;
  }
};

const updatePortfolioData = async (data) => {
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
};

module.exports = {
  getPortfolioData,
  updatePortfolioData
};
