import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Spinner from '../ui-share/Spinner';
import {resetPassword} from '../api';

export default function ResetPassword() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const email = location.state?.email;

	useEffect(() => {
		if (!email) {
			console.log('No email found in state.');
			alert('Invalid access. Redirecting to login.');
			navigate('/sign-in');
		}
	}, [email, navigate]);

	const validatePassword = () => {
		if (!password) {
			setPasswordError('Password is required.');
			return false;
		} else if (password.length < 8) {
			setPasswordError('Password must be at least 8 characters long.');
			return false;
		}
		setPasswordError('');
		return true;
	};

	const validateConfirmPassword = () => {
		if (!confirmPassword) {
			setConfirmPasswordError('Please confirm your password.');
			return false;
		} else if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match.');
			return false;
		}
		setConfirmPasswordError('');
		return true;
	};

	const handleResetPassword = async (e) => {
		e.preventDefault(); // Prevent form's default behavior

		const isPasswordValid = validatePassword();
		const isConfirmPasswordValid = validateConfirmPassword();

		if (!isPasswordValid || !isConfirmPasswordValid) return;

		try {
			setLoading(true);
			const response = await resetPassword(email, password);

			if (response.status) {
				alert('Password reset successful! Please log in with your new password.');
				navigate('/sign-in');
			} else {
				alert('Failed to reset password. Please try again.');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

				<form onSubmit={handleResetPassword}>
					{/* New Password Field */}
					<div className="mb-4">
						<label htmlFor="password" className="block text-gray-700 font-bold mb-2">
							New Password <span className="text-red-500">*</span>
						</label>
						<input
							type="password"
							id="password"
							className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
							placeholder="Enter new password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
					</div>

					{/* Confirm Password Field */}
					<div className="mb-4">
						<label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
							Confirm Password <span className="text-red-500">*</span>
						</label>
						<input
							type="password"
							id="confirmPassword"
							className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
							placeholder="Confirm new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						{confirmPasswordError && <span className="text-red-500 text-xs">{confirmPasswordError}</span>}
					</div>

					{/* Submit Button */}
					<div className="text-center mt-4">
						<button
							type="submit" // Keep type="submit" to use form submission properly
							className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center gap-2 m-auto"
							disabled={loading}
						>
							Reset Password
							{loading && <Spinner />}
						</button>
					</div>
				</form>

				{/* Back to Login Button */}
				<div className="mt-4 text-center">
					<button className="text-button" onClick={() => navigate('/sign-in')}>
						Back to Login
					</button>
				</div>
			</div>
		</div>
	);
}