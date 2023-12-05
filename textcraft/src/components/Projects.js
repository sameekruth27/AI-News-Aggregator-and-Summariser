import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { FaSync } from 'react-icons/fa';
import colorSharp2 from '../assets/img/color-sharp2.png';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const [news, setNews] = useState([]);
  const [groupedNews, setGroupedNews] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [error, setError] = useState(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());

  const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

  useEffect(() => {
    fetchNews();
  }, [refreshTimestamp]); // Trigger fetchNews when refreshTimestamp changes

  const groupNewsByCategory = (newsData) => {
    const groupedNewsData = {};
    newsData.forEach((article) => {
      const category = article.category || 'Uncategorized';
      if (!groupedNewsData[category]) {
        groupedNewsData[category] = [];
      }
      groupedNewsData[category].push(article);
    });
    return groupedNewsData;
  };

  const fetchNews = async () => {
    try {
      // Calculate timestamp for the previous day
      const yesterdayTimestamp = new Date();
      yesterdayTimestamp.setDate(yesterdayTimestamp.getDate() - 1);
      const timestamp = yesterdayTimestamp.getTime();

      const response = await axios.get(`http://localhost:8000/api/news?timestamp=${timestamp}`);
      console.log('API Response:', response.data);

      // Update the state in one go
      setNews(response.data);
      setGroupedNews(groupNewsByCategory(response.data));
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Error fetching news. Please try again later.');
    }
  };

  const handleBookmark = async (article) => {
    try {
      const userId = 'your_user_id'; // Replace with actual user ID
      await axios.post('http://localhost:8000/api/bookmarks', { userId, article });
      alert('Bookmark saved successfully!');
      setBookmarkedArticles((prevBookmarked) => [...prevBookmarked, article.id]);
    } catch (error) {
      console.error('Error saving bookmark:', error);
      alert('Error saving bookmark. Please try again later.');
    }
  };

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? 'animate__animated animate__fadeIn' : ''}>
                  <h2>
                    News{' '}
                    <FaSync
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: 'white',
                      }}
                      onClick={() => setRefreshTimestamp(Date.now())} // Update refreshTimestamp on click
                    />
                  </h2>
                  <p>
                    Our AI-powered news aggregator brings you the latest headlines, curated just for you. From breaking
                    news to in-depth analysis, TextCraft delivers the stories that matter most.
                  </p>
                  <Tab.Container id="projects-tabs" activeKey={selectedCategory} onSelect={(key) => setSelectedCategory(key)}>
                    <Nav
                      variant="pills"
                      className="nav-pills mb-5 justify-content-center align-items-center "
                      id="pills-tab"
                    >
                      {categories.map((category, index) => (
                        <Nav.Item key={index}>
                          <Nav.Link eventKey={category.toLowerCase()}>{category.charAt(0).toUpperCase() + category.slice(1)}</Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                    <Tab.Content id="slideInUp" className={isVisible ? 'animate__animated animate__slideInUp' : ''}>
                      {categories.map((category, index) => (
                        <Tab.Pane key={index} eventKey={category.toLowerCase()}>
                          <Row>
                            {(groupedNews[category] || []).map((article, articleIndex) => (
                              article.imageUrl ? (
                                <Col key={articleIndex} size={12} sm={6} md={4}>
                                  <div className="proj-imgbx">
                                    <img
                                      src={article.imageUrl}
                                      alt="hii"
                                      style={{ maxWidth: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                    <a href={article.url} style={{ color: 'white', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                                      <div className="proj-txtx" style={{ padding: '20px' }}>
                                        <h6>{article.title}</h6>
                                        <button
                                          onClick={() => handleBookmark(article)}
                                          style={{
                                            backgroundColor: bookmarkedArticles.includes(article.id) ? 'white' : 'transparent',
                                            color: bookmarkedArticles.includes(article.id) ? 'black' : 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            border: '2px solid yellow',
                                            padding: '10px 20px',
                                            borderRadius: '10px',
                                            transition: 'background-color 0.3s, color 0.3s',
                                          }}
                                          className="bookmark-button"
                                        >
                                          {bookmarkedArticles.includes(article.id) ? 'Bookmarked' : 'Bookmark'}
                                        </button>
                                      </div>
                                    </a>
                                  </div>
                                </Col>
                              ) : null
                            ))}
                          </Row>
                        </Tab.Pane>
                      ))}
                    </Tab.Content>
                  </Tab.Container>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="background" />
    </section>
  );
};
