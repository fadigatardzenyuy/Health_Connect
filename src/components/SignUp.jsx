// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Facebook, Twitter, Mail } from "lucide-react";

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));

//     // Clear error message for the field being edited
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: "",
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex

//     if (!formData.name) newErrors.name = "Full name is required.";
//     if (!formData.email) {
//       newErrors.email = "Email is required.";
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Invalid email format.";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required.";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters long.";
//     }
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match.";
//     }
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     // Here you would typically send the form data to your backend
//     console.log("Sign up form submitted:", formData);
//     // Redirect to the dashboard after successful signup
//     navigate("/");
//   };

//   const handleSocialSignUp = (provider) => {
//     // Implement social media sign up logic here
//     console.log(`Signing up with ${provider}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="name" className="sr-only">
//                 Full name
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 required
//                 className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
//                   errors.name ? "border-red-500" : "border-gray-300"
//                 } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
//                 placeholder="Full name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-xs">{errors.name}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="email-address" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs">{errors.email}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
//                   errors.password ? "border-red-500" : "border-gray-300"
//                 } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs">{errors.password}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="confirm-password" className="sr-only">
//                 Confirm password
//               </label>
//               <input
//                 id="confirm-password"
//                 name="confirmPassword"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
//                   errors.confirmPassword ? "border-red-500" : "border-gray-300"
//                 } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
//                 placeholder="Confirm password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Sign up
//             </button>
//           </div>
//         </form>

//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-50 text-gray-500">
//                 Or sign up with
//               </span>
//             </div>
//           </div>

//           <div className="mt-6 grid grid-cols-3 gap-3">
//             <div>
//               <button
//                 onClick={() => handleSocialSignUp("facebook")}
//                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//               >
//                 <span className="sr-only">Sign up with Facebook</span>
//                 <Facebook className="w-5 h-5" />
//               </button>
//             </div>
//             <div>
//               <button
//                 onClick={() => handleSocialSignUp("twitter")}
//                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//               >
//                 <span className="sr-only">Sign up with Twitter</span>
//                 <Twitter className="w-5 h-5" />
//               </button>
//             </div>
//             <div>
//               <button
//                 onClick={() => handleSocialSignUp("google")}
//                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//               >
//                 <span className="sr-only">Sign up with Google</span>
//                 <Mail className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link
//               to="/SignIn"
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               Log in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// // src/pages/SignUp.jsx
// // import { SignUp } from "@clerk/clerk-react";

// // const SignUpPage = () => {
// //   return (
// //     <div className="flex items-center justify-center h-screen">
// //       <SignUp />
// //     </div>
// //   );
// // };

// // export default SignUpPage;
// src/components/SignUp.jsx
import { SignUp } from "@clerk/clerk-react";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
