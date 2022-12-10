import axios from 'axios';
// @ts-ignore
import React, {useState, useMemo} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from "react-router-dom";

const SearchForm: React.FC = () => {
    const baseURL = "https://api.artic.edu/api/v1/artworks";
    const fields = "&fields=id,image_id,title,artist_display,date_display,style_title,classification_title,main_reference_number";
    const [response, setResponse] = useState([]);
    const [keyword, setKeyword] = useState<string>('');
    const [sort, setSort] = useState<string>('title');
    const [order, setOrder] = useState<string>('');
    const OnSubmitFC = (event: any) => {
        event.preventDefault();
        axios.get(baseURL + `/search?size=30&q=${keyword}` + fields).then(res => {
            setResponse(res.data.data);
        });
    };
    useMemo(() => {
        if (order === 'ascending') {
            setResponse((re) => re?.sort((a: { [key: string]: any }, b: { [key: string]: any }) => {
                    return a[sort.toString()]> b[`${sort}`] ? 1 : -1;
                }
            ))
        } else {
            setResponse((re) => re?.sort((a: { [key: string]: any }, b: { [key: string]: any }) => {
                    return b[sort.toString()]> a[`${sort}`] ? 1 : -1;
                }
            ))
        }
    }, [sort, order]);
    return (
        <div>
            <div className="container">
                <form className="form-inline" onSubmit={OnSubmitFC}>
                    <div className="row justify-content-md-center">
                        <div className="col-7 ">
                            <label htmlFor="exampleFormControlSelect1">Search by Keyword:</label>
                            <div className="input-group input-group-sm mb-3">
                                <input type="text" className="form-control" aria-label="Small"
                                       aria-describedby="inputGroup-sizing-sm"
                                       onChange={e => {
                                           setKeyword(e.target.value)
                                       }}/>
                                <button type="submit" className="btn btn-outline-secondary ">Submit</button>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-7">
                            <div className="form-group" onChange={e => {
                                setSort((e.target as HTMLInputElement).value)
                            }}>
                                <label htmlFor="exampleFormControlSelect1">Sort by:</label>
                                <select className="form-control form-control-sm">
                                    <option  value="title">Title</option>
                                    <option  value="artist_display">Artist</option>
                                    <option  value="classification_title">Classification</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-7">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       id="inlineRadio1" value="ascending"
                                       onChange={e => {
                                           setOrder((e.target as HTMLInputElement).value)
                                       }}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio1">Ascending</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       id="inlineRadio2" value="descending"
                                       onChange={e => {
                                           setOrder((e.target as HTMLInputElement).value)
                                       }}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio2">Descending</label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="container ">
                {response?.map((item: any) => (
                    <div className="row justify-content-center" id="listHeight">
                        <div className="col-6" id="img-responsive">
                            <Link to={{pathname: `/${item['id']}`}}>
                                <img id='detailCard'
                                     src={"https://www.artic.edu/iiif/2/" + item['image_id'] + '/full/400,/0/default.jpg'}
                                     className="img-thumbnail"
                                     alt = 'Artwork'/>
                            </Link>
                        </div>
                        <div className="col-6">
                            <ul className="list-group  list-group-flush">
                                <li className="list-group-item  list-group-item-light">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">Title:{item['title']}</h5>
                                        <small>Date:{item['date_display']}</small>
                                    </div>
                                </li>
                                <li className="list-group-item list-group-item-light">Artist:{item['artist_display']}</li>
                                <li className="list-group-item list-group-item-light">Classification:{item['classification_title']}</li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default SearchForm;

