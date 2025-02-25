import { FC, useState } from "react";
import TextInput from "./Input";
import { OTPLoginFormProps } from "./types";
import { OTPForm } from "../shared/OTPForm";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../utils/auth";
import { siginInWithGoogle } from "../../services/api";

export const LoginForm: FC<OTPLoginFormProps> = ({ error, isLoading, handleEmailSubmit, handleOTPSubmit }) => {
	const [email, setEmail] = useState("");
	const [showOTPInput, setShowOTPInput] = useState(false);
	const [otp, setOTP] = useState("");
	const [emailError, setEmailError] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const [googleError, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	//HANDLE THE GOOGLE LOGIN
	const handleGoogleSuccess = async (credentialResponse: any) => {
		if (credentialResponse.credential) {
			const decoded: any = jwtDecode(credentialResponse.credential);
			const loginData = { email: decoded.email, token: credentialResponse.credential };
			const response = await siginInWithGoogle(loginData);

			if (response.user.email_verified) {
				localStorage.setItem("name", response.user.name);
				const authdata = {
					email: response.user.email,
					token: response.token,
					expiresIn: response.expiresIn || "3600",
					photo: response.user.picture
				};
				setAuthToken(authdata);
				navigate("/dashboard");
			} else {
				navigate("/login");
			}
		}
	};

	const handleGoogleFailure = () => {
		setError("Google sign-in was unsuccessful. Please try again.");
	};

	// Validate Email
	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
		if (!email) {
			setEmailError("Email is required");
			return false;
		}
		if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address");
			return false;
		}
		setEmailError("");
		return true;
	};

	// Handle Email Change
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = e.target.value;
		setEmail(newEmail);
		if (newEmail) {
			validateEmail(newEmail);
		} else {
			setEmailError("");
		}
	};

	// Handle OTP Change
	const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 6);
		setOTP(value);
	};

	// Handle Email Submit
	const onEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateEmail(email)) {
			return;
		}
		const success = await handleEmailSubmit(email);
		if (success) {
			setShowOTPInput(true);
		}
	};

	// Handle OTP Submit
	const onOTPSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleOTPSubmit(email, otp);
	};

	return (
		<div className="w-full">
			{isAuthenticated ? (
				<div className="text-center">
					<p>Welcome, !</p>
				</div>
			) : !showOTPInput ? (
				<form
					onSubmit={onEmailSubmit}
					className="w-full flex flex-col gap-2"
					noValidate
					aria-label="Email verification form"
				>
					<TextInput
						name="email"
						label="Email"
						type="email"
						placeholder="name@email.com"
						className={emailError || error?.email ? "border-red-500" : ""}
						onChange={handleEmailChange}
						error={emailError || error?.email}
						aria-invalid={!!(emailError || error?.email)}
					/>
					{error?.general && (
						<div className="text-red-500 text-base text-center mt-4" role="alert" aria-live="polite">
							{error.general}
						</div>
					)}
					<button
						type="submit"
						className="w-full h-[55px] mt-6 text-base sm:text-xl bg-blue-600 text-white rounded-2xl
                                  hover:bg-blue-700 active:bg-blue-800
                                  disabled:bg-blue-400 disabled:cursor-not-allowed
                                  transition-colors duration-200"
						disabled={isLoading}
						aria-busy={isLoading}
					>
						{isLoading ? "Sending code..." : "Send Login Code"}
					</button>

					<div className="w-full flex flex-col items-center">
						<GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />

						{googleError && <p className="text-red-500 mt-2">{googleError}</p>}
					</div>
				</form>
			) : (
				<OTPForm
					email={email}
					isLoading={isLoading}
					error={error}
					onOTPSubmit={onOTPSubmit}
					onOTPChange={handleOTPChange}
					onBackToEmail={() => setShowOTPInput(false)}
					handleEmailSubmit={handleEmailSubmit}
				/>
			)}
		</div>
	);
};

export default LoginForm;
