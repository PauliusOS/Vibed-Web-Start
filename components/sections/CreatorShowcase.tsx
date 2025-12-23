"use client";

import React from "react";
import { motion } from "motion/react";

export function CreatorShowcase() {
  // Client logos representing creator categories
  const creatorCategories = [
    {
      id: 1,
      name: "Niche Leaders",
      icon: "💎",
      description: "Industry authorities with deep expertise",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30"
    },
    {
      id: 2,
      name: "Sub-Niche Creators",
      icon: "🎯",
      description: "Specialized experts in targeted verticals",
      color: "from-cyan-500/20 to-cyan-600/20",
      borderColor: "border-cyan-500/30"
    },
    {
      id: 3,
      name: "Entertainers",
      icon: "⭐",
      description: "Engaging personalities with loyal followings",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30"
    },
    {
      id: 4,
      name: "Generic Creators",
      icon: "📢",
      description: "Broad reach across diverse audiences",
      color: "from-gray-500/20 to-gray-600/20",
      borderColor: "border-gray-500/30"
    }
  ];

  return (
    <section
      id="creators"
      className="flex flex-col items-center justify-center w-full relative px-6 py-12 md:py-20 bg-tech-black"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
        className="text-center mb-12 max-w-3xl"
      >
        <p className="text-white/60 font-medium mb-4 text-sm uppercase tracking-wider">
          Creator Network
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
          Trusted by Top Creator Categories
        </h2>
        <p className="text-white/70 text-lg font-medium">
          From niche authorities to mass entertainers, we connect you with the right creator mix
        </p>
      </motion.div>

      {/* Creator Category Grid - Magic UI Style */}
      <div className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden border-y border-white/10 z-20">
        {creatorCategories.map((category, index) => (
          <div
            key={category.id}
            className="group w-full h-40 flex items-center justify-center relative p-6 before:absolute before:-left-[0.5px] before:top-0 before:z-10 before:h-full before:w-px before:bg-white/10 before:content-[''] after:absolute after:-top-[0.5px] after:left-0 after:z-10 after:h-px after:w-full after:bg-white/10 after:content-[''] hover:bg-white/5 transition-all duration-300"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              {/* Default State */}
              <div className="transition-all duration-300 ease-[cubic-bezier(0.165, 0.84, 0.44, 1)] translate-y-0 group-hover:-translate-y-4 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} border ${category.borderColor} flex items-center justify-center mb-3 text-3xl transition-transform duration-300 group-hover:scale-110`}>
                  {category.icon}
                </div>
                <h3 className="text-base font-semibold text-white text-center">
                  {category.name}
                </h3>
              </div>

              {/* Hover State - Description only */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-4 transition-all duration-300 ease-[cubic-bezier(0.165, 0.84, 0.44, 1)]">
                <div className="text-center px-4">
                  <p className="text-sm text-white/70">{category.description}</p>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Stats Section Below */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full"
      >
        {[
          { label: "Active Creators", value: "5,000+" },
          { label: "Total Reach", value: "100M+" },
          { label: "Avg. Engagement", value: "8.4%" },
          { label: "Success Rate", value: "94%" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.35 + index * 0.08,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-white mb-2 gradient-text-blue">
              {stat.value}
            </div>
            <div className="text-sm text-white/60 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
