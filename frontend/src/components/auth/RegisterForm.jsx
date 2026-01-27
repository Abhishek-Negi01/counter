import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Button, Input } from "../ui/index.js";

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(formData);
    if (!result.success) {
      setError(result.error);
    } else {
      onSwitchToLogin();
    }
    setLoading(false);
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500 text-sm mb-4 ">{error}</p>}

        <Button type="submit" className="w-full mb-4" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline"
        >
          Login here
        </button>
      </p>
    </Card>
  );
};

export default RegisterForm;
