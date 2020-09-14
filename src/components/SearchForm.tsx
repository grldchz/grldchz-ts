import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PostSearch } from '../types/Comment';
export interface Props{
  onSubmit(args?: any): void;
}
const SearchForm: React.FC<Props> = ({ onSubmit }) => {
  const initState: PostSearch = {
    searchTerm: '', fromDate: '', toDate: ''
  };

  const [postSearch, setPostSearch] = React.useState<PostSearch>(initState);
  const handleChange = (event: any) => {
    event.persist();
    setPostSearch((prevSearch: any) => ({
      ...prevSearch,
      [event.target.name]: event.target.value
    }));
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
            <div className="p-col-12 p-md-6">
              <label>From</label>
            </div>
            <div className="p-col-12 p-md-6">
              <InputText value={postSearch.fromDate} name="fromDate" onChange={handleChange}
              type="date" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"/>
            </div>
            <div className="p-col-12 p-md-6">
              <label>To</label>
            </div>
            <div className="p-col-12 p-md-6">
            <InputText value={postSearch.toDate} name="toDate" onChange={handleChange}
              type="date" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"/>
            </div>
          <div>
          <Button type="submit" label="Send"/>
        </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
