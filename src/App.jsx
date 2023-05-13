import { useEffect, useState } from 'react';
import axios from 'axios';

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
        }
        getUniversities();
    }, [country]);

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

    const onReset = () => {
        setCountry('');
        setUniversities([]);
        setAllItemsLoaded(false);
        setDisplayedItems(15);
    };

    return (
        <div className='container'>
            <h1>University Database</h1>
            <input
                type='text'
                placeholder='Enter university country'
                value={country}
                onChange={e => setCountry(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={onReset}>Reset</button>
            <button onClick={showMore} disabled={allItemsLoaded}>
                Load more
            </button>
            <div className=''>
                <table>
                    <thead style={{ textAlign: 'center' }}>
                        <tr>
                            <th>№</th>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Code</th>
                            <th>Domain</th>
                            <th>Web</th>
                            <th>Save</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'left' }}>
                        {universities.slice(0, displayedItems).map((university, index) => {
                            return (
                                <tr key={university.name}>
                                    <td>{index + 1}</td>
                                    <td style={{ paddingRight: '10px' }}>{university.name}</td>
                                    <td style={{ paddingRight: '10px' }}>{university.country}</td>
                                    <td style={{ paddingRight: '10px', textAlign: 'center' }}>
                                        {university.alpha_two_code}
                                    </td>
                                    <td style={{ paddingRight: '10px' }}>
                                        {university.domains[0]}
                                    </td>
                                    <td style={{ paddingRight: '10px' }}>
                                        <a href={university.web_pages}>{university.web_pages}</a>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input type='checkbox' id='checkbox' />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
