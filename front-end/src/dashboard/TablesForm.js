import { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";

export default function Tables() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:5000";

  let history = useHistory();
  
  const[tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [reservationsError, setReservationsError] = useState(null);

  const handleTableName = (event) => setTableName(event.target.value);
  const handleCapacity = (event) => setCapacity(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    const table = {
      table_name: tableName,
      capacity: Number(capacity),
    }

    axios.post(`${API_BASE_URL}/tables`, { data: table })
    .then((response) => response.status === 201 ? history.push(`/dashboard`) : null)
    .catch((err) => {
      console.error(err.response.data.error);
      setReservationsError({ message: err.response.data.error })
    })
  }

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <h2 className="text-center pb-2">Create a New Table</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name" className="form-label">
              Table name:
              <input
                className="form-control"
                id="table_name"
                type="text"
                name="table_name"
                onChange={handleTableName}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="people" className="form-label">
              capacity:
              <input
                className="form-control"
                id="capacity"
                type="number"
                min="1"
                max="22"
                name="capacity"
                onChange={handleCapacity}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <button className="btn btn-sm btn-info" type="submit">Submit</button>
            <button className="mx-3 btn btn-sm btn-danger" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
        <ErrorAlert error={reservationsError} />
      </div>
    </>
  );
}
