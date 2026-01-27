import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.js";
import { Button, Input, Card } from "../ui/index.js";

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(formData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };
  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        ></Input>

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit" className="w-full mb-4" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:underline"
        >
          Register here
        </button>
      </p>
    </Card>
  );
};

export default LoginForm;
