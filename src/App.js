import './App.css';
import {useState} from "react";
import Papa from 'papaparse';

const App = () => {
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const search = () => {
        setIsLoading(true);
        fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQvo0wtKrIo7wsSlu4hjrLcYlkyvgwlfNht_PMrMW3O6HvFtBOelD9v0jd2jIO6eFRHzOPM0S5jj2qq/pub?output=csv")
            .then(response => response.text())
            .then(csvData => {
                const jsonData = Papa.parse(csvData, {header: true}).data;
               //filter json data based on search value for any of the values in the json data
                if (searchValue) {
                    const filteredData = jsonData.filter((company) => {
                        // Check if any attribute of the company matches the search value
                        return Object.values(company).some((attribute) =>
                            String(attribute).toLowerCase().includes(searchValue.toLowerCase())
                        );
                    });
                    setData(filteredData);
                    console.log(filteredData);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });


    }

    function updateSearch(event) {
        setSearchValue(event.target.value);
    }

    return (
        <div className="container">
            <div className="row">

                {
                    isLoading ? <p>Loading...</p> :
                        error ? <p key="error">{error.message}</p> :
                            <>
                                <div className="search-container">
                                    <input type="text" className="search-input"
                                           placeholder="Search Companies by Benefits" defaultValue={searchValue} onChange={updateSearch}/>
                                    <button className="search-button" onClick={search}>Search</button>
                                </div>
                                {data.length > 0 && Object.keys(data).map((category, index) =>
                                    <div className="company-details row">
                                        <div className="col-1">
                                            <img className="logo" src={data[index].logo} alt={data[index].name}/>
                                        </div>
                                        <div className="col-10">
                                            <h4>{data[index].name}</h4>
                                            <p><strong>Website:</strong> <a href={data[index].url} target="_blank">Benefits
                                                Url</a> <strong>Careers:</strong> <a href={data[index].jobs}
                                                                                     target="_blank">Jobs
                                                Url</a>
                                            </p>
                                            <p><strong>Description:</strong> {data[index].desc}</p>
                                            <h5>Top Benefits</h5>
                                            <ul>
                                                {data[index].topBenefits.split(",").map((benefit, index) => <li
                                                    className="capitalize" key={index}>{benefit}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </>
                }
            </div>
        </div>
    );
}

export default App;
