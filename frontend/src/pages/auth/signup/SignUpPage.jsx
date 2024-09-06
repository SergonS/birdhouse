// React
import { Link } from "react-router-dom";
// Hooks
import { useState } from "react";
// Icons
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
// Media
import smiley from "../../../components/photos/smiley.png";
import XSvg from "../../../components/svgs/X";
// Tanstack
import { useMutation } from '@tanstack/react-query';
// Toast
import toast from 'react-hot-toast';

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		fullName: "",
		password: "",
	});
	
	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async({ username, email, fullName, password }) => {
			try
			{
				// Post
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ username, email, fullName, password })
				});

				// Receiving response
				const data = await res.json();

				// Check for errors
				if (!res.ok)
				{
					throw new Error(data.error || "Failed to create account");
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
			toast.success("Account created successfully!");
		},
	});

	const handleSubmit = (e) => {
		// Avoid page refresh
		e.preventDefault();
		// Submitting form
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>					
					<div className='flex gap-5 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdOutlineMail />
							<input
								type='email'
								className='grow'
								placeholder='Email'
								name='email'
								onChange={handleInputChange}
								value={formData.email}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
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
						{isPending ? "Loading..." : "Sign up"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;