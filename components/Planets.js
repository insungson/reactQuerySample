import React, { useState } from 'react';
import { useQuery, usePaginatedQuery } from 'react-query';
import Planet from './Planet';

const fetchPlanets = async (key, greeting, page) => {
  console.log(greeting);
  const res = await fetch(`https://swapi.dev/api/planets/?page=${page}`);
  return res.json();
};

const Planets = () => {
// const test = useQuery('planets', fetchPlanets);
// console.log('어떻게 리턴되는지 확인해보자',test);

const [page, setPage] = useState(1);
const {data, status} = useQuery(['planets', 'hello coresight!', page], fetchPlanets, //키값을 배열로 주면 그 다음 api 요청의 input 인자들이 순차적으로 들어가게 된다
{ //useQuery()에 들어가는 3번쩨 인자는 refetch나 캐싱등을 컨트롤 할 수 있는 옵션이다.
  staleTime: 2000, //2초 뒤 데이터 받음
  cacheTime: 10, //refetch 실행하는 텀
  onSuccess: () => console.log('data fetched with no problemo')// 성공시 관련 컨트롤 가능
});

// //reactQuery에서 제공하는 페이지네이션
// const {
//   resolvedData, //마지막으로 fetch된 데이터 (화면에 보여주는 데이터)
//   latestData,   //캐시가되지 않은 데이터 (백그라운드에서 new fetch 가 된 데이터이다)
//   status
// } = usePaginatedQuery(['planets', page], fetchPlanets);

  return (
    <div>
      <h2>Planets</h2>
      <button onClick={() => setPage(1)}>page 1</button>
      <button onClick={() => setPage(2)}>page 2</button>
      <button onClick={() => setPage(3)}>page 3</button>
      <p>{ status }</p>
      {status === 'loading' && (
        <div>loading data...</div>
      )}
      {status === 'error' && (
        <div>Error fetching data</div>
      )}
      {status === 'success' && (
        <>
        <div>
          { data.results.map(planet => <Planet key={planet.name} planet={planet} />) }
        </div>
        <div>

        </div>
        </>
      )}
    </div>
  );
};

export default Planets;