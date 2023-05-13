import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function App() {
    const [country, setCountry] = useState('');
    const [universities, setUniversities] = useState([]);
    const [allItemsLoaded, setAllItemsLoaded] = useState(false);
    const [displayedItems, setDisplayedItems] = useState(15);

    useEffect(() => {
        async function getUniversities() {
            const itemsResponse = await axios.get(
                `http://universities.hipolabs.com/search?country=${country}`,
            );
            setUniversities(itemsResponse.data);
            console.log(itemsResponse.data);
        }
        getUniversities();
    }, []);

    const handleSearch = async () => {
        try {
            const itemsResponse = await axios.get(
                `http://universities.hipolabs.com/search?country=${country}`,
            );
            setUniversities(itemsResponse.data);
        } catch (error) {
            alert('Error while searching for universities');
            console.log(error);
        }
    };

    const showMore = () => {
        if (displayedItems >= universities.length) {
            setAllItemsLoaded(true);
            return;
        }
        setDisplayedItems(displayedItems + 15);
    };

    return (
        <div className='container'>
            <h1>University Database</h1>
            <input
                type='text'
                placeholder='Enter university name'
                value={country}
                onChange={e => setCountry(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button>Reset</button>
            <button onClick={showMore} disabled={allItemsLoaded}>
                Load more
            </button>
            <div className=''>
                {universities.slice(0, displayedItems).map(university => (
                    <li key={uuidv4()}>{university.name}</li>
                ))}
            </div>
        </div>
    );
}

export default App;
