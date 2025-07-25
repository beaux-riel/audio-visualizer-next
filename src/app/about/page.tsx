import { Metadata } from "next";
import { Code, Mic, Activity, Headphones, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About - Audio Visualizer",
  description:
    "Learn about the technology stack and features of our real-time audio visualization application.",
};

export default function About() {
  const techStack = [
    {
      name: "Next.js 15",
      description:
        "React framework with App Router for modern web applications",
      icon: "🚀",
    },
    {
      name: "TypeScript",
      description: "Type-safe JavaScript for better development experience",
      icon: "🔷",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for rapid UI development",
      icon: "🎨",
    },
    {
      name: "Web Audio API",
      description: "Native browser API for real-time audio processing",
      icon: "🎵",
    },
    {
      name: "Lucide React",
      description: "Beautiful and consistent icon library",
      icon: "✨",
    },
    {
      name: "Vitest",
      description: "Fast unit testing framework with comprehensive coverage",
      icon: "🧪",
    },
  ];

  const features = [
    {
      title: "Real-time Audio Processing",
      description:
        "Uses Web Audio API to analyze microphone input in real-time with low latency",
      icon: <Mic className="w-6 h-6" />,
    },
    {
      title: "Multiple Visualizations",
      description:
        "Volume meter, frequency spectrum, circular waveform, and particle field visualizations",
      icon: <Activity className="w-6 h-6" />,
    },
    {
      title: "Responsive Design",
      description:
        "Works seamlessly across desktop, tablet, and mobile devices",
      icon: "📱",
    },
    {
      title: "Dark Mode Support",
      description:
        "Automatically adapts to system preferences with enhanced dark mode styling",
      icon: "🌙",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            About Audio Visualizer
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A modern web application that transforms your voice into stunning
            visual experiences using cutting-edge web technologies and real-time
            audio processing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Tech Stack */}
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-8 h-8 text-cyan-400" />
              <h2 className="text-3xl font-bold">Technology Stack</h2>
            </div>
            <div className="space-y-6">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-2xl">{tech.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300 mb-1">
                      {tech.name}
                    </h3>
                    <p className="text-gray-300 text-sm">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Headphones className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold">Key Features</h2>
            </div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-purple-400 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-16 bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cyan-300">
                Enable Microphone
              </h3>
              <p className="text-gray-300 text-sm">
                Click the microphone button and allow browser access to your
                device&apos;s microphone.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">
                Start Speaking
              </h3>
              <p className="text-gray-300 text-sm">
                Speak, sing, or make sounds near your microphone to see the
                visualizations come alive.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-300">
                Enjoy Visuals
              </h3>
              <p className="text-gray-300 text-sm">
                Watch as your voice transforms into beautiful, real-time visual
                patterns and animations.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Technical Implementation
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">
                Audio Processing
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Web Audio API for low-latency audio analysis</li>
                <li>• Real-time frequency domain analysis using FFT</li>
                <li>
                  • Configurable analysis parameters for optimal performance
                </li>
                <li>• Browser-native audio context management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-300">
                Visualization
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Canvas-based rendering for smooth animations</li>
                <li>• Multiple visualization modes and styles</li>
                <li>• Responsive design with CSS Grid and Flexbox</li>
                <li>• Hardware-accelerated animations using CSS transforms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400">
          <p className="mb-4">
            Built with modern web technologies for an exceptional user
            experience.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              Next.js
            </a>
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              Tailwind CSS
            </a>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              Web Audio API
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
