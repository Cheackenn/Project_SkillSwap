'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a2c36] pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="bg-[#2d3f47] border-b border-[#3a4f5a] p-4 sticky top-0 z-10 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">About SkillSwap</h1>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#5fa4c3] to-[#4a7a8d] flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Learn, Teach, and Exchange Skills</h2>
            <p className="text-gray-400">Building a community of lifelong learners</p>
          </div>

          {/* What is SkillSwap */}
          <div className="bg-[#2d3f47] rounded-lg p-6 border border-[#3a4f5a]">
            <h3 className="text-lg font-bold text-white mb-3">What is SkillSwap?</h3>
            <p className="text-gray-300 leading-relaxed">
              SkillSwap is a platform that connects people who want to learn new skills with those who can teach them. 
              Whether you're a student looking to expand your knowledge or a professional wanting to share your expertise, 
              SkillSwap makes it easy to find the perfect learning partner.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-[#2d3f47] rounded-lg p-6 border border-[#3a4f5a]">
            <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5fa4c3] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Create Your Profile</h4>
                  <p className="text-gray-400 text-sm">List the skills you can teach and what you want to learn</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5fa4c3] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Post Your Skills</h4>
                  <p className="text-gray-400 text-sm">Share what you can teach and what you're looking to learn</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5fa4c3] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Connect & Exchange</h4>
                  <p className="text-gray-400 text-sm">Message other users and start exchanging knowledge</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5fa4c3] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Rate & Review</h4>
                  <p className="text-gray-400 text-sm">Share your experience and help build a trusted community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-[#2d3f47] rounded-lg p-6 border border-[#3a4f5a]">
            <h3 className="text-lg font-bold text-white mb-4">Key Features</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#5fa4c3] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-white font-medium">Skill Exchange</h4>
                  <p className="text-gray-400 text-sm">Trade skills without money - teach what you know, learn what you need</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#5fa4c3] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-white font-medium">Direct Messaging</h4>
                  <p className="text-gray-400 text-sm">Chat with potential learning partners and coordinate sessions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#5fa4c3] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-white font-medium">Rating System</h4>
                  <p className="text-gray-400 text-sm">Build trust through ratings and reviews from the community</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#5fa4c3] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-white font-medium">Community Feed</h4>
                  <p className="text-gray-400 text-sm">Discover new skills and connect with learners and teachers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="bg-[#2d3f47] rounded-lg p-6 border border-[#3a4f5a]">
            <h3 className="text-lg font-bold text-white mb-3">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              We believe that everyone has something valuable to teach and something new to learn. 
              SkillSwap aims to democratize education by creating a platform where knowledge flows freely, 
              barriers to learning are removed, and communities grow stronger through shared expertise.
            </p>
          </div>

          {/* Get Started */}
          <div className="bg-gradient-to-r from-[#5fa4c3] to-[#4a7a8d] rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to Start Learning?</h3>
            <p className="text-white/90 mb-4">Join our community and start exchanging skills today!</p>
            <button
              onClick={() => router.push('/home')}
              className="bg-white text-[#5fa4c3] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Explore Skills
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
