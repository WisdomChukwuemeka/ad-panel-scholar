"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { AuthAPI } from "../services/api";
import {toast, ToastContainer } from "react-toastify";
export default function Login ({onLogin}) {
    const router = useRouter();
    const [credentials, setCredentials] = useState(
        {
            email: "",
            password: ""
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }


    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthAPI.login(credentials);
      const token = response.data.access;
      localStorage.setItem("access_token", token);
      // Dispatch auth change event to notify other components
      window.dispatchEvent(new Event("authChange"));
      toast.success("Login successful!");
        setTimeout(() => {
            router.push("/");
        }, 1000);
        console.log("Login response:", response);
        onLogin(response.data); // Notify parent component
    } catch (error) {
      if (error.response) {
        const errors = error.response.data;
        let delay = 0;
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            errors[key].ForEach((msg) => {
              setTimeout(() => {
                toast.error(` ${msg}`);
              }, delay);
                delay += 1000; // show next message after 2s
            });
          } else {
            setTimeout(() => {
              toast.error(`${key}: ${errors[key]}`);
            }, delay);
            delay += 1000;
          }
        }
      }
    }
    }

    return(
        <>
        <div className="max-w-2xl mx-auto mt-20 p-6 bg-white text-black rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text block font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={credentials.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="" required />
            </div>
            <div>
            <label htmlFor="password" className="text block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="" required />
            </div>
            <div className="flex items-center justify-between">
        
            <div className="text-sm">
                <a href="#" className="text font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
            </div>
            </div>
            <div>
            <button type="submit" className="text w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Login</button>
            </div>
        </form>
        <p className="text mt-6 text-center text-sm text-gray-600">Don't have an account? <Link href={"/register"} className="font-medium text-blue-600 hover:text-blue-500">Sign Up</Link></p>
        </div>

         {/* Toast Container */}
              <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}