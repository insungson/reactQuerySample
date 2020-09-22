import React, { useState } from 'react';
import { useQuery, useMutation, queryCache } from 'react-query';
import Starship from './Starship';

const fetchStarships = async (key, page) => {
  console.log('page: ', page);
  const res = await fetch(`https://swapi.dev/api/starships/?page=${page}`);
  return res.json();
};

const updateStarships = async (page) => { //서버로 post, update, delete 방식으로 요청(여기선 그냥..변형해서사용)
  console.log('page111', page);
  const res = await fetch(`https://swapi.dev/api/starships/?${page}`);
  return res.json();
};

const Starships = () => {
  const [page, setPage] = useState(1);
  const {data, status, refetch} = useQuery(['starships', page], fetchStarships, {
    staleTime: 0, // 사가에서 throttle 이랑 같은 개념으로 보면 된다.. (설정한 시간동안 요청이 안된다 - fresh)지정시간 이후 stale  로 변경됨
    cacheTime: 3000,  //key-value 값을 캐싱한 시간.. 캐싱되는동안 inactive 데이터 상태임.. 캐싱시간 이후 inactive 데이터는(key-value 의 캐싱데이터) 모두 삭제된다
    onSuccess: (kkk) => {
      console.log('뭐가 찍히나? ',kkk);
    }
  });                                                                               
  //*** 개발자모드에서 주황색이 stale 데이터이고 그 아래가 inactive 데이터이다.
  //    useMutation은 stale 데이터로 올라갈수가 없다. 그냥 inactive 상태로 캐싱된다!
  //    이부분도... staleTime, cacheTime 옵션을 바꾸면 조절할 수 있다고 생각된다
  const [mutate, info] = useMutation(updateStarships, {
    //*** onSuccess 콜백은 쉽게 데이터를 업뎃할 수 있지만.. 속도는 느리다
    xonSuccess: (data) => {  //mutation을 통해 post, update, delete 요청하고 성공시 응답을 data로 받는다
     //queryCache.refetchQueries('starships1', (data) => {data}); 
      // *** (방법1)useMutate 를 사용하여 서버의 데이터를 바꾸고 queryCache.refetchQueries('starships'); 를 통해
      // useQuery('starships') 로 데이터를 가져오기 때문에 최신데이터를 받을 수 있다. (속도가 4가지방법중 가장 느림)
      console.log('data: ', data); //확인해보자
      console.log('쿼리캐시',queryCache); //쿼리케시도 확인해보자
      //*** (방법2)   queryCache.setQueryData('starships', (current) => [...current, data]) 를 사용하여
      // 기존의 key값에 연동된 value값을(data:서버에서 받은값) 넣어 업데이트해준다
      queryCache.setQueryData(['starships1',1], (data) => {//setQueryData 로 key, 콜백함수로 value 결정
        data; 
      })
      refetch();
    },
    //*** 아래의 onMutate 조건을 사용하려면 위의 onSuccess -> xonSuccess 로 바꿔야 중복실행이 안된다
      //*** (방법3) onMutate: () => {} 내부에서 setQuery 사용
    onMutate: (newData) => {
      console.log('newData: ', newData); //아래의 mutate()에 넣은 page:1 이 찍힘
      queryCache.cancelQueries(['starships', 1])  //키값을 취소하고 setQueryData로 키값과 value 값추가 
      console.log('캐시쿼리보기보기', queryCache);
      //기존에 캐시로 저장되어있는 부분을 먼저 cancel처리를 해준다 (해당키값을 업뎃하기위한 사전작업)
      const current = queryCache.getQueryData(['starships', 2]) 
      console.log('current: ', current);
      //키값의 value데이터를 가져온다 만약 잘못될때 아래의 onError 에서 rollback()으로 위의 getQueryData 시점
      //데이터로 돌아가기 위해서 필수적으로 사용해야한다
      queryCache.setQueryData(['starships', 1], (prev) => {
        console.log('test', prev)
        prev
      });
      return current; 
      // 현재의 캐시 리턴해준다 (위에서 setQueryData() 를 통해 key값과 연결하여 햔재값을 리턴한다)
    },
    onError: (error, newData, rollback) => rollback(),  //위의 onMutate()에서 잘못될때를 대비하여
    onSettled: () => queryCache.refetchQueries('starships1') 
    // 위의 옵션들이 실패할때 서버로 부터 데이터가 아닌 로컬데이터에서 데이터를 가져올때 사용

  });  

  const update = async () => {
    try {
      let mutateTest = await mutate({page:1})
      console.log('mutateTest: ', mutateTest);
    } catch (error) {
      console.log('에러에러', error)
    }
  };

  console.log('mutate확인', info, mutate);

  return (
    <div>
      <h2>Starships</h2>
      <button onClick={() => setPage(1)}>page 1</button>
      <button onClick={() => setPage(2)}>page 2</button>
      <button onClick={() => setPage(3)}>page 3</button>
      <button onClick={() => update()}>Return page 1(Reset)</button>
      {status === 'loading' && (
        <div>loading data...</div>
      )}
      {status === 'error' && (
        <div>Error fetching data</div>
      )}
      {status === 'success' && (
        <>
        <div>
          { data.results.map(starship => <Starship key={starship.name} starship={starship} />) }
        </div>
        </>
      )}
    </div>
  );
};

export default Starships;