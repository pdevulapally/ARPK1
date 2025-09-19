import {
  Code,
  Zap,
  Paintbrush,
  Rocket,
  Shield,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: <Code className="h-6 w-6" />,
    title: 'Custom Development',
    desc: 'Tailored web solutions built specifically for your business needs with clean, maintainable code.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Lightning Fast',
    desc: 'Optimized for speed and performance. Your website will load quickly and rank higher in search results.',
  },
  {
    icon: <Paintbrush className="h-6 w-6" />,
    title: 'Beautiful Design',
    desc: 'Modern, responsive designs that look stunning on all devices and reflect your brand perfectly.',
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: 'Quick Launch',
    desc: 'From concept to launch in record time. We deliver fast without compromising on quality.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure & Reliable',
    desc: 'Enterprise-grade security and 99.9% uptime guarantee to keep your business running smoothly.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Direct Communication',
    desc: 'Work directly with the developers building your project. No middlemen, just clear communication.',
  },
];

export default function WhyArpkSection() {
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
              Why Choose <span className="text-purple-600 dark:text-purple-400">ARPK</span>?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              We deliver exceptional web development services that drive business growth and exceed expectations.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                'linear-gradient(152.92deg, rgba(147, 51, 234, 0.2) 4.54%, rgba(124, 58, 237, 0.26) 34.2%, rgba(147, 51, 234, 0.1) 77.55%)',
            }}
          ></div>
        </div>
        <hr className="bg-purple-500/30 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border border-purple-200/20 dark:border-purple-800/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300"
              >
                <div className="text-purple-600 dark:text-purple-400 w-fit transform-gpu rounded-full border border-purple-200/30 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-900/20 p-4">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
