import React, { useState, useEffect } from 'react';
import { useNylas } from '@nylas/nylas-react';
import NylasLogin from '../NylasLogin';
import Layout2 from '../components/Layout2';
import EmailApp from '../ReadEmails/EmailApp'

function Read() {
  const nylas = useNylas();
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:9000';

  useEffect(() => {
    if (!nylas) {
      return;
    }

    // Handle the code that is passed in the query params from Nylas after a successful login
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          setUserId(id);
          sessionStorage.setItem('userId', id);
        })
        .catch((error) => {
          console.error('An error occurred parsing the response:', error);
        });
    }
  }, [nylas]);

  useEffect(() => {
    const userIdString = sessionStorage.getItem('userId');
    const userEmail = sessionStorage.getItem('userEmail');
    if (userIdString) {
      setUserId(userIdString);
    }
    if (userEmail) {
      setUserEmail(userEmail);
    }
  }, []);

  useEffect(() => {
    if (userId?.length) {
      window.history.replaceState({}, '', `/?userId=${userId}`);
      getEmails();
    } else {
      window.history.replaceState({}, '', '/');
    }
  }, [userId]);

  const getEmails = async () => {
    setIsLoading(true);
    try {
      const url = 'http://localhost:9000/nylas/read-emails';
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmails(data);
      } else {
        setEmails([]);
      }
    } catch (e) {
      console.warn(`Error retrieving emails:`, e);
      return false;
    }
    setIsLoading(false);
  };

  const disconnectUser = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    setUserId('');
    setUserEmail('');
  };

  const refresh = () => {
    getEmails();
  };

  return (
    <Layout2
      showMenu={!!userId}
      disconnectUser={disconnectUser}
      refresh={refresh}
      isLoading={isLoading}
    >
      {!userId ? (
        <NylasLogin email={userEmail} setEmail={setUserEmail} />
      ) : (
        <div className="app-card">
          <EmailApp
            userEmail={userEmail}
            emails={emails}
            isLoading={isLoading}
            serverBaseUrl={SERVER_URI}
            userId={userId}
          />
        </div>
      )}
    </Layout2>
  );
}

export default Read;
