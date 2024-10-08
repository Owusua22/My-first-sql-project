import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Card, Typography, Button, message } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

function Home() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get("http://localhost:3500/students");
            const formattedData = res.data.data.map(item => ({
                ...item,
                id: item._id || item.id,
            }));
            setData(formattedData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3500/students/${id}`);
            message.success('Student deleted successfully');
            // Refresh the student list after deletion
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            message.error('Failed to delete student.');
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <span>
                    <Link to={`/read/${record.id}`} style={styles.actionLink}>Read</Link>
                    <Link to={`/edit/${record.id}`} style={styles.actionLink}>Edit</Link>
                    <Button 
                        type="link" 
                        style={styles.actionLink} 
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this student?")) {
                                handleDelete(record.id);
                            }
                        }}
                    >
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.buttonContainer}>
                <Button type="primary" style={styles.createButton}>
                    <Link to="/create" style={styles.createLink}>Create New Student</Link>
                </Button>
            </div>
            <Title level={2} style={styles.header}>Student List</Title>
            <Card style={styles.card}>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.id}
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            </Card>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#1c1e21',
    },
    card: {
        margin: '20px auto',
        maxWidth: '1000px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    buttonContainer: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    createButton: {
        backgroundColor: '#0073e6',
        color: '#fff',
        borderColor: '#0073e6',
        padding: '10px 20px',
        fontSize: '16px',
    },
    createLink: {
        color: '#fff',
        textDecoration: 'none',
    },
    actionLink: {
        marginRight: 15,
        color: '#0073e6',
        textDecoration: 'underline',
    },
};

export default Home;
