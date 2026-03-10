import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LandingPage() {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(''); // 'teacher' or 'student'

  const handleLogin = async (role) => {
    setIsLoading(role);
    try {
      // Save the intended role so App.jsx knows which dashboard to route to
      localStorage.setItem('userRole', role);
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
            🎓
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
            Inclusive Classroom
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Accessibility</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Testimonials</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleLogin('student')}
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => handleLogin('teacher')}
            disabled={isLoading !== ''}
            className="px-6 py-2.5 bg-[#6338f0] hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
          >
            {isLoading === 'teacher' ? 'Loading...' : 'Get Started Free'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16 relative">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Trusted by 5,000+ Schools Worldwide
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-[#1a1c29] leading-[1.1] tracking-tight">
            Transform Education <br />
            Into Inclusion with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6338f0] to-purple-500">
              Accessible Learning
            </span>
          </h1>

          <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
            Inclusive Classroom AI is the premier platform connecting teachers and students with real-time translation, captions, sign language recognition, and interactive video rooms. From concept to completion — we ensure accessibility at every step.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button 
              onClick={() => handleLogin('teacher')}
              disabled={isLoading !== ''}
              className="w-full sm:w-auto px-8 py-4 bg-[#6338f0] hover:bg-indigo-700 text-white text-base font-bold rounded-xl shadow-xl shadow-indigo-200/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              {isLoading === 'teacher' ? 'Signing in...' : 'Sign in as Teacher'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
            
            <button 
              onClick={() => handleLogin('student')}
              disabled={isLoading !== ''}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-[#6338f0] border-2 border-[#6338f0] text-base font-bold rounded-xl shadow-lg shadow-slate-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              {isLoading === 'student' ? 'Signing in...' : 'Sign in as Student'}
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 pt-2 shadow-none hover:shadow-none bg-transparent">
             <button onClick={() => window.scrollTo(0, document.body.scrollHeight)} className="hover:text-indigo-600 transition-colors shadow-none text-slate-500 hover:bg-transparent">See How It Works <span>&rsaquo;</span></button>
          </div>
        </div>

        {/* Right Content - Floating Badges mimicking image */}
        <div className="flex-1 relative w-full h-[500px] hidden lg:block">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-70"></div>
          
          {/* Badge 1 */}
          <div className="absolute top-[15%] right-[10%] bg-white p-5 rounded-2xl shadow-2xl shadow-indigo-100 flex items-center gap-4 animate-bounce-slow" style={{ animationDuration: '4s' }}>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div className="font-bold text-slate-700">Live Captions</div>
          </div>

          {/* Badge 2 */}
          <div className="absolute top-[45%] left-[5%] bg-white p-5 rounded-2xl shadow-2xl shadow-indigo-100 flex items-center gap-4 animate-bounce-slow" style={{ animationDuration: '5s', animationDelay: '1s' }}>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
            </div>
            <div className="font-bold text-slate-700">AI Explanations</div>
          </div>

          {/* Badge 3 */}
          <div className="absolute bottom-[20%] right-[15%] bg-white p-5 rounded-2xl shadow-2xl shadow-indigo-100 flex items-center gap-4 animate-bounce-slow" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="font-bold text-slate-700">Real-time Sign Language</div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow infinite;
        }
      `}} />
    </div>
  );
}
