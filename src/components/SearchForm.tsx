/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PostSearch } from '../types/Comment';
export interface Props{
  onSubmit(args?: any): void;
  prevSearch: PostSearch;
}
const SearchForm: React.FC<Props> = ({ onSubmit, prevSearch }) => {

  const [postSearch, setPostSearch] = React.useState<PostSearch>(prevSearch);
  const handleChange = (event: any) => {
    event.persist();
    setPostSearch((prevSearch: any) => ({
      ...prevSearch,
      [event.target.name]: event.target.value
    }));
  };
  const handleClearBtnClick = () => {
    setPostSearch({
      searchTerm: '', fromDate: '', toDate: ''
    });
  };
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(postSearch);
  };
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label>Search Term</label>
            </div>
            <div className="p-col-12 p-md-6">
              <InputText
                type="text"
                name="searchTerm"
                value={postSearch.searchTerm}
                onChange={handleChange}
              />
            </div>
            </div>
            <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label>From</label>
            </div>
            <div className="p-col-12 p-md-6">
              <InputText value={postSearch.fromDate} name="fromDate" onChange={handleChange}
              type="date" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"/>
            </div>
            </div>
            <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <label>To</label>
            </div>
            <div className="p-col-12 p-md-6">
            <InputText value={postSearch.toDate} name="toDate" onChange={handleChange}
              type="date" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"/>
            </div>
            </div>
          <div>
          <Button icon="pi pi-check" type="submit" label="Send" style={{margin: '3px'}}/>
          <Button icon="pi pi-times" type="button" label="Clear" onClick={() => handleClearBtnClick()} style={{margin: '3px'}}/>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
