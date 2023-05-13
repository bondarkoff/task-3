import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [country, setCountry] = useState('');
    const [universities, setUniversities] = useState([]);
    const [allItemsLoaded, setAllItemsLoaded] = useState(false);
    const [displayedItems, setDisplayedItems] = useState(15);
    const [checkedCount, setCheckedCount] = useState(0);
    const [checkboxes, setCheckboxes] = useState(() => {
        const savedCheckboxes = localStorage.getItem('checkboxes');
        return savedCheckboxes ? JSON.parse(savedCheckboxes) : {};
    });

    useEffect(() => {
        const savedSearchState = localStorage.getItem('searchState');
        if (savedSearchState) {
            const parsedSearchState = JSON.parse(savedSearchState);
            setCountry(parsedSearchState.country);
            setUniversities(parsedSearchState.universities);
            setAllItemsLoaded(parsedSearchState.allItemsLoaded);
            setDisplayedItems(parsedSearchState.displayedItems);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            'searchState',
            JSON.stringify({
                country,
                universities,
                allItemsLoaded,
                displayedItems,
            }),
        );
    }, [country, universities, allItemsLoaded, displayedItems]);

    useEffect(() => {
        const savedCheckboxes = localStorage.getItem('checkboxes');
        if (savedCheckboxes) {
            const parsedCheckboxes = JSON.parse(savedCheckboxes);
            const newCheckedCount = Object.values(parsedCheckboxes).filter(Boolean).length;
            setCheckedCount(newCheckedCount);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('checkboxes', JSON.stringify(checkboxes));
        const newCheckedCount = Object.values(checkboxes).filter(Boolean).length;
        setCheckedCount(newCheckedCount);
    }, [checkboxes]);

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
        setCheckboxes({});
    };

    const handleCheckbox = university => {
        setCheckboxes(prevCheckboxes => {
            const updatedCheckboxes = {
                ...prevCheckboxes,
                [university.name]: !prevCheckboxes[university.name],
            };
            return updatedCheckboxes;
        });
    };

    return (
        <div className='container'>
            <h1>University Database</h1>
            {checkedCount > 0 ? (
                <p>Total checked univesities - {checkedCount}</p>
            ) : (
                <p>You have no checked universities</p>
            )}
            <div className=''>
                <div className='mt-10'>
                    <input
                        type='text'
                        placeholder='Enter university country'
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className='textInput'
                    />
                    <button className='button' onClick={handleSearch}>
                        Search
                    </button>
                    <button className='button' onClick={onReset}>
                        Reset
                    </button>
                    <button className='button' onClick={showMore} disabled={allItemsLoaded}>
                        Load more
                    </button>
                </div>
            </div>
            <div className=''>
                <table style={{ fontSize: '18px' }}>
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
                                        <input
                                            type='checkbox'
                                            id='checkbox'
                                            onChange={() => handleCheckbox(university)}
                                            checked={checkboxes[university.name] || false}
                                            key={university.name}
                                        />
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
