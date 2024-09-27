"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Shield,
  Info,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [url, setUrl] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [entropy, setEntropy] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setEntropy(null);
    setScore(null);

    try {
      const response = await fetch(
        `/api/predict?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }
      const data = await response.json();
      setPrediction(data.prediction);
      setEntropy(data.entropy);
      setScore(Math.random()); // Simulating a score between 0 and 1
    } catch (err: Error | unknown) {
      setError("An error occurred while fetching the prediction.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPredictionMessage = () => {
    if (score === null) return "";
    if (score < 0.2) return "Your URL is likely safe.";
    if (score < 0.5)
      return "Your URL might be suspicious. Proceed with caution.";
    if (score < 0.8) return "Your URL is likely malicious. Be very careful!";
    return "Your URL is highly dangerous. Do not proceed!";
  };

  const getPredictionColor = () => {
    if (score === null) return "bg-gray-100";
    if (score < 0.2) return "bg-green-100";
    if (score < 0.5) return "bg-yellow-100";
    if (score < 0.8) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-2xl font-bold text-purple-600">
                  URL Guardian
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Info className="mr-2 h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>API</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-purple-700">
                URL Predictor
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Enter a URL to check if it is malicious or safe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="url"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition duration-200"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-full transition duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Shield className="mr-2 h-5 w-5" />
                    </motion.div>
                  ) : (
                    "Predict"
                  )}
                </Button>
              </form>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2"
                  >
                    <AlertCircle className="flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-6 p-6 rounded-lg ${getPredictionColor()}`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {score !== null && score < 0.5 ? (
                        <CheckCircle2 className="text-green-500 h-8 w-8" />
                      ) : (
                        <AlertCircle className="text-red-500 h-8 w-8" />
                      )}
                      <span className="font-bold text-xl">
                        {getPredictionMessage()}
                      </span>
                    </div>
                    <div className="bg-white bg-opacity-50 p-4 rounded-md space-y-2">
                      <div>
                        <span className="font-semibold">Prediction:</span>{" "}
                        {prediction}
                      </div>
                      <div>
                        <span className="font-semibold">Entropy:</span>{" "}
                        {entropy?.toFixed(4)}
                      </div>
                      <div>
                        <span className="font-semibold">Risk Score:</span>{" "}
                        {score !== null
                          ? (score * 100).toFixed(2) + "%"
                          : "N/A"}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
