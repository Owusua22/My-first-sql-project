import  { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Read() {
    const [data, setData] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        axios.get(`http://localhost:3500/get_students/${id}`)
            .then(res => {
                console.log(res.data);
                const studentData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
                const formattedData = studentData.map(item => ({
                    ...item,
                    id: item._id || item.id,
                }));
                setData(formattedData);
            })
            .catch(err => {
                console.log("Error fetching data:", err);
            });
    }, [id]);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Student Details</h1>
            <button style={styles.backButton} onClick={() => navigate('/')}>
                ← Back to Home
            </button>
            {/* Render the student details */}
            {data.length > 0 ? (
                <div style={styles.studentDetails}>
                    <h2 style={styles.subHeader}>Student Information</h2>
                    <p><strong>Name:</strong> {data[0].name}</p>
                    <p><strong>Email:</strong> {data[0].email}</p>
                    <p><strong>Gender:</strong> {data[0].gender}</p>
                    <p><strong>Age:</strong> {data[0].age}</p>
                </div>
            ) : (
                <p style={styles.loadingText}>Loading student details...</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    subHeader: {
        color: '#0073e6',
        marginBottom: '10px',
    },
    backButton: {
        backgroundColor: '#0073e6',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    studentDetails: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    loadingText: {
        textAlign: 'center',
        color: '#888',
    },
};

export default Read;
