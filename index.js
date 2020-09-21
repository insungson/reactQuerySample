import React, {useState} from 'react';
import Navbar from './components/Navbar';
import People from './components/People';
import Planets from './components/Planets';
import PlanetsPage from './components/PlanetsPage';
import Starships from './components/Starships';
import { ReactQueryDevtools } from 'react-query-devtools'; //개발자모드
import './index.css';

const Index = () => {
  const [page, setPage] = useState('planets');

  return (
    <>
      <div className="App">
        <h1>Star Wars Info</h1>
        <Navbar setPage={setPage} />
        <div className="content">
          {page === 'planets' ? <PlanetsPage /> : page === 'starships' ? <Starships /> : <People />}
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default Index;