import React, { useState } from 'react';
import { useQuery, usePaginatedQuery } from 'react-query';
import Planet from './Planet';

const fetchPlanets = async (key, greeting, page) => {
  console.log(greeting);
  const res = await fetch(`https://swapi.dev/api/planets/?page=${page}`);
  return res.json();
};

const PlanetsPage = () => {
// const test = useQuery('planets', fetchPlanets);
// console.log('어떻게 리턴되는지 확인해보자',test);

const [page, setPage] = useState(1);

//reactQuery에서 제공하는 페이지네이션
const {
  resolvedData, //마지막으로 fetch된 데이터 (화면에 보여주는 데이터)
  latestData,   //캐시가되지 않은 데이터 (백그라운드에서 new fetch 가 된 데이터이다) latestData.next 는 요청할 주소이다. 요청할 주소가 없거나 데이터가 없으면 더이상 요청할수 없다
  status
} = usePaginatedQuery(['planets', 'hello coreCight', page], fetchPlanets);

  return (
    <div>
      <h2>Planets</h2>
      <p>{ status }</p>
      {status === 'loading' && (
        <div>loading data...</div>
      )}
      {status === 'error' && (
        <div>Error fetching data</div>
      )}
      {status === 'success' && (
        <>
          <button
            onClick={() => setPage(old => Math.max(old - 1, 1))}
            disabled={page === 1}
          >Previous page</button>
          <span>{ page }</span>
          <button
            onClick={() => setPage(old => (!latestData || !latestData.next ? old : old + 1))}
            disabled={!latestData || !latestData.next}
          >Next page</button>
          <div>
            { resolvedData.results.map(planet => <Planet key={planet.name} planet={planet} />) }
          </div>
        </>
      )}
    </div>
  );
};

export default PlanetsPage;