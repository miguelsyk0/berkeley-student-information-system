import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed", err);
      if (err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err?.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err?.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* Left Content */}
      <div className="hidden md:flex md:w-1/2 shrink-0 flex-col justify-between p-12 text-white bg-black bg-[url('/berkeley-logo.jpg')] bg-cover bg-center relative">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            Berkeley School Inc.
          </div>
          <div className="flex items-center gap-2 text-2xl">
            Student Information System
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 overflow-hidden bg-white">
        <div className="w-full max-w-sm">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-black">Login</h1>
              <p className="text-gray-600">
                Enter your credentials to login
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-900"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}