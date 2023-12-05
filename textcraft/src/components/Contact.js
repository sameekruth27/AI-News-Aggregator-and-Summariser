import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import contactImg from '../assets/img/contact-img.svg';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Contact = () => {
  const preferencesOptions = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

  const formInitialDetails = {
    username: '',
    password: '',
    preferences: preferencesOptions.map((option) => option),
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Signup');
  const [status, setStatus] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const handlePreferenceToggle = (index) => {
    const updatedPreferences = [...formDetails.preferences];
    const preference = preferencesOptions[index];
    const isPreferenceSelected = updatedPreferences.includes(preference);

    if (isPreferenceSelected) {
      // If the preference is already selected, remove it
      updatedPreferences.splice(updatedPreferences.indexOf(preference), 1);
    } else {
      // If the preference is not selected, add it
      updatedPreferences.push(preference);
    }

    setFormDetails({
      ...formDetails,
      preferences: updatedPreferences,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText('Submitting...');
    const url = isSignUp ? 'https://minorproject-alpha.vercel.app/register' : 'https://minorproject-alpha.vercel.app/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          username: formDetails.username,
          password: formDetails.password,
          preferences: formDetails.preferences,
        }),
      });

      setButtonText(isSignUp ? 'Login' : 'Signup');
      const result = await response.json();

      if (result.error) {
        setStatus({ success: false, message: result.error });
      } else {
        setStatus({
          success: true,
          message: isSignUp ? 'User registered successfully' : 'Login successful',
        });
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setStatus({ success: false, message: 'Something went wrong, please try again later.' });
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setFormDetails(formInitialDetails);
    setStatus({});
    setButtonText(isSignUp ? 'Login' : 'Signup'); // Dynamic button label
  };

  // Dummy data for bookmarks (replace it with your actual data)
  const bookmarks = [
    { title: 'Bookmark 1', imageUrl: 'bookmark1.jpg', url: 'https://example.com/bookmark1' },
    { title: 'Bookmark 2', imageUrl: 'bookmark2.jpg', url: 'https://example.com/bookmark2' },
    // Add more bookmarks as needed
  ];

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          {!isLoggedIn && (
            <Col size={12} md={6}>
              <TrackVisibility>
                {({ isVisible }) => (
                  <img className={isVisible ? 'animate__animated animate__zoomIn' : ''} src={contactImg} alt="Contact Us" />
                )}
              </TrackVisibility>
            </Col>
          )}
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? 'animate__animated animate__fadeIn' : ''}>
                  {!isLoggedIn ? (
                    <div>
                      <h2>{isSignUp ? 'Signup for Personalised Feed' : 'Login for Personalised Feed'}</h2>
                      <form onSubmit={handleSubmit}>
                        <Row>
                          <Col size={12} sm={6} className="px-1">
                            <input
                              type="text"
                              value={formDetails.username}
                              placeholder="Username"
                              onChange={(e) => onFormUpdate('username', e.target.value)}
                            />
                          </Col>
                          <Col size={12} sm={6} className="px-1">
                            <input
                              type="password"
                              value={formDetails.password}
                              placeholder="Password"
                              onChange={(e) => onFormUpdate('password', e.target.value)}
                            />
                          </Col>
                          {isSignUp && (
                            <Row>
                              {preferencesOptions.map((preference, index) => (
                                <Col key={index} size={1} className="px-1">
                                  <input
                                    type="checkbox"
                                    id={preference}
                                    checked={formDetails.preferences.includes(preference)}
                                    onChange={() => handlePreferenceToggle(index)}
                                  />
                                  <label htmlFor={preference}>{preference.charAt(0).toUpperCase() + preference.slice(1)}</label>
                                </Col>
                              ))}
                            </Row>
                          )}
                          <Col size={12} className="px-1">
                            <button type="submit">
                              <span>{buttonText}</span>
                            </button>
                          </Col>
                          <Col size={12} className="px-1">
                            <button type="button" onClick={toggleSignUp}>
                              <span>{isSignUp ? 'Switch to Login' : 'Switch to Signup'}</span>
                            </button>
                          </Col>
                        </Row>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <h2>Bookmarked News</h2>
                      <Row>
                        {bookmarks.map((bookmark, index) => (
                          <Col key={index} size={12} sm={6} md={4}>
                            <div className="proj-imgbx">
                              <img
                                src={bookmark.imageUrl}
                                alt={bookmark.title}
                                style={{ maxWidth: '100%', height: '200px', objectFit: 'cover' }}
                              />
                              <a href={bookmark.url} style={{ color: 'white', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                                <div className="proj-txtx" style={{ padding: '20px' }}>
                                  <h6>{bookmark.title}</h6>
                                </div>
                              </a>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
