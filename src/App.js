import { useEffect, useState } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  // Penambahan Query
  const [queryForm, setQueryForm] = useState({
    name: '',
    query: ''
  });

  const handleOnChange = e => {
    const value = { ...queryForm };
    value[e.target.id] = e.target.value;
    setQueryForm(value);
  }

  const submitQuery = e => {
    e.preventDefault();

    Axios.post("http://localhost:5000/query", {
      name: queryForm.name,
      query: queryForm.query
    })
    setQueryForm({ name: '', query: '' })

    window.location.reload();
  }

  // List Query
  const [queryList, setQueryList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:5000/query").then(res => {
      setQueryList(res.data.data);
    });
  }, []);

  // Hasil Query
  const [result, setResult] = useState([]);

  const executeQuery = (e, id) => {
    e.preventDefault();

    Axios.post(`http://localhost:5000/query/${id}`).then(res => {
      setResult(res.data.data);
    });
  }

  // DML Query
  const [DMLQuery, setDMLQuery] = useState('');

  const DMLOnChange = e => {
    let value = { ...DMLQuery };
    value = e.target.value;
    setDMLQuery(value);
  }

  const DMLExecute = e => {
    e.preventDefault();

    Axios.put("http://localhost:5000/query", {
      query: DMLQuery
    });
    setDMLQuery('');

    window.location.reload();
  }

  return (
    <div className='flex flex-col items-center justify-center justify-items-center flex-nowrap'>
      <div className='flex flex-row p-8 rounded-md justify-center w-full'>
        {/* Penambahan Query */}
        <div className='flex flex-col justify-center items-center gap-y-2 w-full'>
          <h1 className='font-bold'>Tambahkan Query</h1>
          <form className='flex flex-col justify-center p-8 bg-gray-600 rounded-md gap-2 text-white pb-6 w-11/12 shadow-2xl' onSubmit={submitQuery}>
            <label for='name'>Nama Query:</label>
            <input onChange={handleOnChange} type='text' id='name' value={queryForm.name} className='rounded-md text-xs text-black p-2' />
            <label for='query'>Query:</label>
            <textarea onChange={handleOnChange} id='query' value={queryForm.query} className='rounded-md text-xs text-black h-36 p-2 max-h-36 overflow-y-scroll' />
            <button className='rounded-md border-white border-4 font-bold p-2 mt-4 hover:bg-slate-700'>Add Query</button>
          </form>
        </div>

        {/* List Query */}
        <div className='flex flex-col w-8/12 items-center'>
          <h1 className='font-bold'>Query yang tersedia</h1>
          <ul className='border-2 border-gray-600 p-3 rounded-lg h-full w-full shadow-2xl'>
            {queryList.map(query => (
              <li key={query.id} className='flex flex-row justify-between items-center bg-gray-600 my-2 shadow-2xl py-1 px-3 rounded-lg'>
                <p className='text-xs text-white'>{query.name}</p>
                <button onClick={e => executeQuery(e, query.id)} className='m-1 rounded-lg p-2 bg-white text-green-500 font-bold hover:bg-gray-100'>Execute</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='w-full flex flex-col justify-center items-center'>
        <h1 className='font-bold'>DML Query</h1>
        <form onSubmit={DMLExecute} className='flex flex-col justify-center w-8/12 bg-gray-600 p-4 rounded-lg gap-y-2'>
          <label for="query" className='text-white'>Query:</label>
          <textarea onChange={DMLOnChange} id='query' value={DMLQuery} className='rounded-md h-32 p-2' />
          <button className='w-full bg-transparent p-3 text-white font-bold rounded-lg border-4 border-white hover:bg-gray-400'>Execute</button>
        </form>
      </div>

      {/* Menampilkan hasil query */}
      <div className='flex flex-col justify-center p-6 mx-2 w-full h-fit text-center'>
        <h1 className='self-center font-bold'>Hasil Query</h1>
        <table className='border-collapse border border-gray-600 whitespace-nowrap overflow-scroll w-full'>
          <thead className='bg-gray-600 text-white'>
            <tr>
              {result.length > 0 &&
                Object.keys(result[0]).map((key, idx) => (
                  <th key={idx} className='border border-gray-600 p-2'>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {result.map((item, resIdx) => (
              <tr key={resIdx} className='border border-gray-600 text-xs'>
                {Object.keys(item).map((key, colIdx) => (
                  <td key={colIdx} className='border border-gray-600 p-2'>{item[key] == null ? '-' : item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
