import Link from 'next/link';
import { 
  FiUsers, 
  FiTarget, 
  FiHeart, 
  FiTrendingUp,
  FiAward,
  FiGlobe,
  FiMail
} from 'react-icons/fi';

export default function AboutPage() {
  const stats = [
    { icon: FiUsers, label: 'Active Users', value: '10,000+', color: 'text-blue-600' },
    { icon: FiTarget, label: 'Events Hosted', value: '5,000+', color: 'text-purple-600' },
    { icon: FiAward, label: 'Success Rate', value: '98%', color: 'text-green-600' },
    { icon: FiGlobe, label: 'Cities Covered', value: '50+', color: 'text-orange-600' },
  ];

  const values = [
    {
      icon: FiHeart,
      title: 'Community First',
      description: 'We believe in building strong, supportive communities where everyone feels welcome and valued.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: FiUsers,
      title: 'Authentic Connections',
      description: 'We facilitate genuine relationships and meaningful interactions between like-minded individuals.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiTrendingUp,
      title: 'Continuous Growth',
      description: 'We are committed to constantly improving our platform and expanding opportunities for our users.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FiAward,
      title: 'Quality Experience',
      description: 'We ensure every event and interaction on our platform meets the highest standards of quality.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: '👩‍💼',
      bio: 'Passionate about connecting people and building communities.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: '👨‍💻',
      bio: 'Tech enthusiast dedicated to creating seamless user experiences.'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Community',
      image: '👩‍🦰',
      bio: 'Committed to fostering inclusive and vibrant communities.'
    },
    {
      name: 'David Wilson',
      role: 'Product Manager',
      image: '👨‍🦱',
      bio: 'Focused on delivering features that users love.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About SocialSpark
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connecting people through shared experiences and meaningful events since 2024
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At SocialSpark, we believe that life&apos;s best moments are shared. Our mission is to 
                break down barriers and bring people together through events, activities, and 
                experiences that spark joy and create lasting connections.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Whether you&apos;re looking for adventure partners, professional networking opportunities, 
                or simply want to explore new hobbies with like-minded individuals, SocialSpark is 
                your gateway to a more connected and fulfilling social life.
              </p>
              <p className="text-lg text-gray-700">
                We&apos;re more than just a platform – we&apos;re a community dedicated to making every 
                interaction meaningful and every event memorable.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose SocialSpark?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Verified hosts and safe, secure events</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Diverse range of activities and interests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Easy-to-use platform with instant booking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Active community support and moderation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Flexible payment options and refund policy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${value.color} mb-4`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Passionate individuals working together to create amazing experiences for our community
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              SocialSpark was born from a simple observation: in our increasingly digital world, 
              genuine human connections were becoming harder to find. Our founders, a group of 
              friends who met through various social events, realized that while technology had 
              made it easier to connect online, it had also created barriers to meeting in person.
            </p>
            <p className="text-gray-700 mb-4">
              In 2024, we set out to change that. We created SocialSpark as a platform that uses 
              technology not to replace human interaction, but to facilitate it. Our goal was to 
              make it as easy to find a hiking partner, join a book club, or attend a tech meetup 
              as it is to scroll through social media.
            </p>
            <p className="text-gray-700 mb-4">
              Today, SocialSpark has grown into a thriving community of thousands of users across 
              multiple cities. We&apos;ve facilitated countless friendships, professional connections, 
              and memorable experiences. But we&apos;re just getting started.
            </p>
            <p className="text-gray-700">
              Our vision is to create a world where everyone has access to meaningful social 
              experiences, regardless of their background, interests, or location. We&apos;re committed 
              to building a platform that&apos;s inclusive, safe, and empowering for all.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 text-blue-100">
            Be part of something bigger. Start your journey with SocialSpark today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link
              href="/events"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions or suggestions? We&apos;d love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="mailto:hello@socialspark.com" 
              className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              <FiMail className="mr-2" />
              hello@socialspark.com
            </a>
            <span className="hidden sm:block text-gray-400">|</span>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
