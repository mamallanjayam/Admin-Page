import React, { useState } from 'react';
import './Admin.css';
import * as XLSX from 'xlsx';

function Admin() {
    // States for handling file and errors
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);

    // State for holding the Excel data
    const [excelData, setExcelData] = useState(null);

    // Handle file input change
    const handleFile = (e) => {
        const fileTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (fileTypes.includes(selectedFile.type)) {
                setTypeError(null);
                const reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (event) => {
                    setExcelFile(event.target.result);
                };
            } else {
                setTypeError('Please select only Excel file format');
                setExcelFile(null);
            }
        } else {
            console.log('Please select your file');
        }
    };

    // Handle form submission
    const handleFileSubmit = (e) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: 'buffer' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data.slice(0, 10));
        }
    };

    return (
        <div className="AdminPage">
            <h2 id="Upload">Upload Excel File & View</h2>
            {/* Form */}
            <form className="form-group custom-form" onSubmit={handleFileSubmit}>
                <input
                    type="file"
                    className="form-control"
                    required
                    onChange={handleFile}
                />
                <button type="submit" className="btn btn-success btn-md">
                    UPLOAD
                </button>
                {typeError && (
                    <div className="alert alert-danger" role="alert">
                        {typeError}
                    </div>
                )}
            </form>

            {/* View form */}
            <div className="viewer">
                {excelData ? (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    {Object.keys(excelData[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((individualExcelData, index) => (
                                    <tr key={index}>
                                        {Object.keys(individualExcelData).map((key) => (
                                            <td key={key}>{individualExcelData[key]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>No file is uploaded yet</div>
                )}
            </div>
        </div>
    );
}

export default Admin;
