// React
import { Link } from "react-router-dom";
// Hooks
import { useState } from "react";
// Icons
import { FaUser } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
// Media
import XSvg from "../../../components/svgs/X";
// Tanstack
import { useMutation } from '@tanstack/react-query';
// Toast
import toast from 'react-hot-toast';

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const { mutate: loginMutation, isPending, isError, error } = useMutation({
		mutationFn: async({ username, password }) => {
			try
			{
				// Post
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ username, password })
				});

				// Receiving response
				const data = await res.json();

				// Check for errors
				if (!res.ok)
				{
					throw new Error(data.error || "Failed to login");
				}

				return data;
			}
			catch (error)
			{
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Login successful")
		},
	});

	const handleSubmit = (e) => {
		// Avoid page refresh
		e.preventDefault();
		// Submitting form
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<FaUser />
						<input
							type='text'
							className='grow'
							placeholder='Username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-1 mt-3'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;