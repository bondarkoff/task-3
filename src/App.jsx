import { useEffect } from 'react';
import axios from 'axios';

function App() {
    useEffect(() => {
        async function getUniversities() {
            const itemsResponse = await axios.get('http://universities.hipolabs.com/search');
            console.log(itemsResponse.data);
        }
        getUniversities();
    }, []);

    return (
        <div className='container'>
            <h1>University Database</h1>
            <input type='text' placeholder='Enter university name' />
            <button>Reset</button>
        </div>
    );
}

export default App;
