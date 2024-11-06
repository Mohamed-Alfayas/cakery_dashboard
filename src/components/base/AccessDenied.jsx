import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material'
import React from 'react'
import './AccessDenied.scss'
import { useNavigate } from 'react-router';

const AccessDenied = () => {

  const navigate = useNavigate();


  return (
    <section className="access-denied">
      <div>
      <img
        src={require("../../assets/img/403.png")}
        alt=""
        className="access-denied-banner"
      />

      <p>You don't have permission to access on this page.</p>

      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          navigate("/");
        }}
      >
        <FontAwesomeIcon icon={faHome} className="mx-1" />
        Go to Home Page
      </Button>
      </div>
    </section>
  );
}

export default AccessDenied