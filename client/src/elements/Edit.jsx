import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Input, Button, Card, Form, message } from 'antd';

const { Title } = Typography;

function Edit() {
  const { id } = useParams(); // Get student ID from URL
  const [student, setStudent] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
  });
  const navigate = useNavigate();

  // Fetch student data when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/get_students/${id}`);
        setStudent(response.data.data); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching student data:', error);
        message.error('Failed to fetch student data.'); // Display error message
      }
    };

    fetchStudentData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating field ${name} to ${value}`); // Debug log
    setStudent({ ...student, [name]: name === 'age' ? Number(value) : value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:3500/edit_student/${id}`, student);
      message.success('Student details updated successfully');
      navigate('/'); // Redirect to home after successful update
    } catch (error) {
      console.error('Error updating student details:', error);
      message.error('Failed to update student details.'); // Display error message
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2} style={styles.header}>Edit Student Details</Title>
      <Card style={styles.card}>
        <Form layout="vertical">
          <Form.Item label="Name" style={styles.formItem}>
            <Input
              placeholder="Enter name"
              name="name"
              value={student.name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </Form.Item>
          <Form.Item label="Email" style={styles.formItem}>
            <Input
              placeholder="Enter email"
              name="email"
              value={student.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          </Form.Item>
          <Form.Item label="Age" style={styles.formItem}>
            <Input
              placeholder="Enter age"
              name="age"
              type="number"
              value={student.age}
              onChange={handleInputChange}
              style={styles.input}
            />
          </Form.Item>
          <Form.Item label="Gender" style={styles.formItem}>
            <Input
              placeholder="Enter gender"
              name="gender"
              value={student.gender}
              onChange={handleInputChange}
              style={styles.input}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} style={styles.button}>
              Update
            </Button>
            <Button onClick={() => navigate('/')} style={{ marginLeft: 10 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
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
    color: '#333',
    marginBottom: '20px',
  },
  card: {
    width: '500px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  formItem: {
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    borderRadius: '5px',
  },
  button: {
    backgroundColor: '#0073e6',
    borderColor: '#0073e6',
    color: '#fff',
    borderRadius: '5px',
  },
};

export default Edit;
