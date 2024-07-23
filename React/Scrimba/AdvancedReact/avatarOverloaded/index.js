import React from 'react';
import ReactDOM from 'react-dom/client';
import Avatar from "./Avatar"

function App() {
  return (
    <>
      <Avatar src="./images/bob.jpg" alt="Bob Ziroll" />
      <br />
      <Avatar>BZ</Avatar>
      <br />
      <Avatar />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);