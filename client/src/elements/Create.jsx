import { Form, Input, Button, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design reset styles
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const Create = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    gender: '',
    age: '',
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Function to handle form submission
  const handleFinish = (values) => {
    axios.post("http://localhost:3500/add_user", values)  // Use the complete URL
  .then((response) => {
    console.log(response.data);
    navigate("/");
    form.resetFields();
  })
  .catch((error) => {
    console.error("Error adding student:", error);
  });

  };

  return (
    <div style={styles.container}>
      <div>
        <Link to="/">Home</Link>
      </div>
      <h2 style={styles.header}>Add Student</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish} // Use onFinish instead of onSubmit
        initialValues={{ gender: 'male' }}
        style={styles.form}
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the student name!' }]}
          style={styles.formItem}
        >
          <Input
            placeholder="Enter student name"
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input the student email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
          style={styles.formItem}
        >
          <Input
            placeholder="Enter student email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </Form.Item>

        {/* Age Field */}
        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Please input the student age!' }]}
          style={styles.formItem}
        >
          <InputNumber
            min={1}
            max={100}
            placeholder="Enter student age"
            style={styles.inputNumber}
            onChange={(value) => setValues({ ...values, age: value })}
          />
        </Form.Item>

        {/* Gender Field */}
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select the student gender!' }]}
          style={styles.formItem}
        >
          <Select
            placeholder="Select gender"
            onChange={(value) => setValues({ ...values, gender: value })}
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={styles.submitButtonContainer}>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const styles = {
  container: {
    minWidth: '400px',
    margin: '50px',
    padding: '20px',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    padding: '10px',
  },
  formItem: {
    marginBottom: '15px',
  },
  inputNumber: {
    width: '100%',
  },
  submitButtonContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default Create;
