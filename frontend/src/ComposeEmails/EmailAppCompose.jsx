import React from 'react';
import PropTypes from 'prop-types';
import SendEmails from './SendEmails';
import '../styles/emailComp.scss';

function EmailAppComp({ userId, setToastNotification }) {
  return (
    <>
      <div className="email-app">
        <SendEmails
          userId={userId}
          setToastNotification={setToastNotification}
        />
      </div>
      <div className="mobile-warning hidden-desktop">
        <h2>
        </h2>
        <p>
          Visit Nylas dashboard for more use-cases: https://dashboard.nylas.com
        </p>
      </div>
    </>
  );
}

EmailAppComp.propTypes = {
  userId: PropTypes.string.isRequired,
  setToastNotification: PropTypes.func.isRequired,
};

export default EmailAppComp;
