import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/services/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed");
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* Left Content */}
      <div className="hidden md:flex md:w-1/2 shrink-0 flex-col justify-between p-12 text-white bg-black bg-[url('/berkeley-logo.jpg')] bg-cover bg-center relative">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            Berkeley School
          </div>
          <div className="flex items-center gap-2 text-2xl">
            Student Information System
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 overflow-hidden bg-white">
        <div className="w-full max-w-sm">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-black">Login</h1>
              <p className="text-gray-600">
                Enter your credentials to login
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder-gray-500"
              />
              <Input
                type="password"
                placeholder="Pasword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder-gray-500"
              />
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900"
              >
                Login
              </Button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}