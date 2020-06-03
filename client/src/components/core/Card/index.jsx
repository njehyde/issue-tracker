import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Card = ({ title, description }) => {
  const [data, setData] = useState(null);

  const axiosClient = axios.create({
    baseURL: 'http://localhost',
    timeout: 1000,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axiosClient.get('/api/health');
      setData(result.data);
    };

    fetchData();
  }, []);

  const outerStyle = {
    border: '1px solid',
    backgroundColor: 'lightblue',
    padding: '10px',
  };
  const innerStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>{title}</div>
      <div>{description}</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default Card;
