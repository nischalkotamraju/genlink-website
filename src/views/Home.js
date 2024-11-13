import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { AcademicCapIcon, ComputerDesktopIcon, UserGroupIcon, BookOpenIcon, GlobeAltIcon, SparklesIcon, ChatBubbleLeftRightIcon, RocketLaunchIcon, LightBulbIcon, BoltIcon, FireIcon, StarIcon, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const Home = () => {
  const controls = useAnimation()
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const animations = {
    fadeIn: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }},
    hover: { scale: 1.05, rotate: 2, transition: { type: "spring", stiffness: 300 }},
    container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.2 }}},
    item: { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 }}}
  }

  useEffect(() => {
    controls.start({ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] })
      .then(() => controls.start({ y: [0, -20, 0], transition: { repeat: Infinity, duration: 2 }}))
  }, [controls])

  const renderHeroSection = () => (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="min-h-screen flex items-center justify-center py-20" style={{ scale, opacity }}>
      <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-12 px-4">
        <motion.img src={require("../assets/genlink-logo.png")} alt="GenLink Logo" className="h-40 mb-8 lg:mb-0" animate={controls} initial={{ scale: 0.5 }} />
        <div className="text-center lg:text-left">
          <motion.h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Welcome to GenLink
          </motion.h1>
          <motion.p className="text-xl lg:text-2xl text-gray-300 max-w-3xl" {...animations.fadeIn}>
            Connecting youth and seniors through engaging activities, technology education, and meaningful interactions at senior centers across Austin.
          </motion.p>
        </div>
      </div>
    </motion.div>
  )

  const renderGridSection = (title, items) => (
    <motion.div className="py-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }}>
      <motion.h2 className="text-4xl font-bold text-white text-center mb-12" animate={{ color: ["#fff", "#60A5FA", "#fff"] }} transition={{ duration: 3, repeat: Infinity }}>
        {title}
      </motion.h2>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4" variants={animations.container} initial="hidden" whileInView="visible">
        {items.map((item, index) => (
          <motion.div key={index} className="p-8 bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10" variants={animations.item} whileHover={animations.hover}>
            {item.icon}
            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-gray-300">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )

  const renderAlternatingSection = (items) => (
    <motion.div className="py-20">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center justify-between gap-8 mb-20 px-4`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
        >
          <div className="flex-1">
            {item.icon}
            <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-gray-300 text-lg">{item.desc}</p>
          </div>
          <motion.div className="flex-1 bg-white/5 backdrop-blur-lg rounded-xl p-8" whileHover={{ scale: 1.05 }}>
            <p className="text-gray-300">{item.content}</p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )

  const renderStatisticsSection = () => (
    <motion.div className="py-20 px-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { number: "Austin, TX", label: "Based in", icon: <MapPinIcon className="w-8 h-8 text-red-400" /> },
          { number: "100%", label: "Led By High Schoolers", icon: <AcademicCapIcon className="w-8 h-8 text-yellow-400" /> },
          { number: "501(c)(3)", label: "Nonprofit Organization", icon: <BuildingOfficeIcon className="w-8 h-8 text-green-400" /> }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-xl"
            whileHover={{ scale: 1.1 }}
          >            {stat.icon}
            <h4 className="text-4xl font-bold text-white my-4">{stat.number}</h4>
            <p className="text-gray-300">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <motion.div className="min-h-screen bg-[#0e1e4b]">
      <div className="max-w-7xl mx-auto">
        {renderHeroSection()}

        {renderGridSection("Our Programs", [
          { icon: <ComputerDesktopIcon className="w-10 h-10 text-blue-400 mb-4" />, title: "Tech Workshops", desc: "Weekend sessions at senior centers teaching essential digital skills and popular apps." },
          { icon: <UserGroupIcon className="w-10 h-10 text-purple-400 mb-4" />, title: "Volunteer Hours", desc: "Earn service hours while making a difference in seniors' lives through meaningful activities." },
          { icon: <AcademicCapIcon className="w-10 h-10 text-green-400 mb-4" />, title: "Skills Development", desc: "Gain leadership, communication, and teaching experience while helping others." },
          { icon: <RocketLaunchIcon className="w-10 h-10 text-yellow-400 mb-4" />, title: "Interactive Games", desc: "Engage in fun, cognitive-stimulating activities designed for all ages." },
          { icon: <ChatBubbleLeftRightIcon className="w-10 h-10 text-pink-400 mb-4" />, title: "Networking", desc: "Connect with other volunteers and build relationships with community leaders." },
          { icon: <LightBulbIcon className="w-10 h-10 text-orange-400 mb-4" />, title: "Creative Projects", desc: "Collaborate on art, storytelling, and digital media projects together." }
        ])}

        {renderStatisticsSection()}

        {renderAlternatingSection([
          {
            icon: <BoltIcon className="w-12 h-12 text-yellow-400 mb-4" />,
            title: "On-Site Activities",
            desc: "Regular visits to senior centers",
            content: "Our volunteers visit local senior centers every weekend, organizing engaging activities from tech tutorials to creative workshops. These sessions provide valuable social interaction while helping seniors stay connected in today's digital world."
          },
          {
            icon: <FireIcon className="w-12 h-12 text-orange-400 mb-4" />,
            title: "Volunteer Benefits",
            desc: "Growth opportunities for students",
            content: "Earn volunteer hours, develop leadership skills, and build your resume while making a real impact. Our program provides official service hour verification and recommendation letters for college applications."
          },
          {
            icon: <StarIcon className="w-12 h-12 text-blue-400 mb-4" />,
            title: "Community Impact",
            desc: "Creating lasting connections",
            content: "Experience the joy of bridging generational gaps through meaningful activities. Our volunteers consistently report increased empathy, improved communication skills, and valuable life lessons learned from seniors."
          }
        ])}

        {renderGridSection("Join Our Mission", [
          { icon: <GlobeAltIcon className="w-10 h-10 text-yellow-400 mb-4" />, title: "Regular Activities", desc: "Participate in weekend sessions at various senior centers across Austin." },
          { icon: <BookOpenIcon className="w-10 h-10 text-red-400 mb-4" />, title: "Flexible Schedule", desc: "Choose from multiple time slots that fit your availability." },
          { icon: <SparklesIcon className="w-10 h-10 text-indigo-400 mb-4" />, title: "Personal Growth", desc: "Develop valuable skills while making a positive impact in your community." }
        ])}

        <motion.div className="py-16 bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 px-8 mb-16 mx-4" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}>
          <div className="text-center">
            <motion.h2 className="text-4xl font-bold text-white mb-8">
              Start Volunteering Today
            </motion.h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200">Join as Volunteer</Link>
              <Link to="/login" className="px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200">Log In</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home