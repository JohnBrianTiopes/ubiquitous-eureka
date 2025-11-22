import React from 'react';
import './Auth.css';

const Home = () => {
	const user = JSON.parse(localStorage.getItem('user') || 'null');
	return (
		<div style={{ padding: '2rem', color: '#fff' }}>
			<h1>Welcome{user ? `, ${user.username}` : ''}!</h1>
			<p>This is the Home page. Your frontend is running.</p>
		</div>
	);
};

export default Home;
