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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8  ">
      <div className="w-full max-w-md">
        <Card className="w-full p-6 sm:p-8 shadow-xl bg-white/95 backdrop-blur-sm border-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Join us to start chanting.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Choose a username"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Create a password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm ">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
