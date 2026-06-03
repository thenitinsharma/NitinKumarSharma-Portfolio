import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface ContactProps {
  isDark: boolean;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "nitin.175sharma@gmail.com",
    href: "mailto:nitin.175sharma@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Lucknow, Uttar Pradesh, India",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 7905329347",
    href: "tel:+917905329347",
  },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: "GitHub",
    url: "https://github.com/thenitinsharma",
    color: "#333",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/nitin-kumar-sharma-15a897247",
    color: "#0077b5",
  },
];

export function Contact({ isDark }: ContactProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation of a real API call (You can integrate EmailJS or Web3Forms here)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <div
      className={`w-full h-full overflow-y-auto overflow-x-hidden ${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"} custom-scrollbar`}
    >
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1
            className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Get In Touch
          </h1>
          <p
            className={`mt-3 text-lg ${isDark ? "text-white/50" : "text-gray-600"}`}
          >
            Have a project in mind? Let's work together!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-3">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon;
                const card = (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                      isDark
                        ? "bg-[#1c1c1e] border-white/5 hover:border-white/10"
                        : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isDark ? "bg-[#007aff]/10" : "bg-blue-50"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isDark ? "text-[#0a84ff]" : "text-[#007aff]"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-white/30" : "text-gray-400"}`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {item.value}
                      </p>
                    </div>
                    {item.href && (
                      <ExternalLink className="w-3 h-3 opacity-20" />
                    )}
                  </motion.div>
                );

                return item.href ? (
                  <a key={item.label} href={item.href} className="block group">
                    {card}
                  </a>
                ) : (
                  <div key={item.label}>{card}</div>
                );
              })}
            </div>

            {/* Social Links Card */}
            <div
              className={`p-5 rounded-2xl border ${isDark ? "bg-[#1c1c1e] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? "text-white/30" : "text-gray-400"}`}
              >
                Connect with me
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isDark
                          ? "bg-white/5 hover:bg-white/10 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      title={social.label}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Availability Badge */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark
                  ? "bg-[#30d158]/10 border-[#30d158]/20"
                  : "bg-green-50 border-green-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span
                  className={`text-sm font-bold ${isDark ? "text-[#30d158]" : "text-green-700"}`}
                >
                  Open for Opportunities
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${isDark ? "text-white/50" : "text-gray-600"}`}
              >
                I'm currently looking for new projects and internship roles.
                Let's build something amazing.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className={`p-6 md:p-8 rounded-2xl border ${
                isDark
                  ? "bg-[#1c1c1e] border-white/5 shadow-2xl"
                  : "bg-white border-gray-100 shadow-xl"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl outline-none transition-all border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white focus:border-[#0a84ff] focus:bg-white/10"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#007aff] focus:bg-white"
                    }`}
                    placeholder="Nitin Kumar Sharma"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl outline-none transition-all border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white focus:border-[#0a84ff] focus:bg-white/10"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#007aff] focus:bg-white"
                    }`}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <label
                  htmlFor="subject"
                  className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all border ${
                    isDark
                      ? "bg-white/5 border-white/5 text-white focus:border-[#0a84ff] focus:bg-white/10"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#007aff] focus:bg-white"
                  }`}
                  placeholder="What are we talking about?"
                />
              </div>

              <div className="mt-5 space-y-2">
                <label
                  htmlFor="message"
                  className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all border resize-none ${
                    isDark
                      ? "bg-white/5 border-white/5 text-white focus:border-[#0a84ff] focus:bg-white/10"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#007aff] focus:bg-white"
                  }`}
                  placeholder="I'd love to hear about your project details..."
                />
              </div>

              <button
                type="submit"
                // disabled={isSubmitting}
                disabled={true}
                className={`w-full cursor-not-allowed mt-8 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#007aff] hover:bg-[#0066d6] text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {/* Status Notifications */}
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-4 overflow-hidden`}
                  >
                    <div
                      className={`p-4 rounded-xl flex items-center gap-3 ${
                        isDark
                          ? "bg-green-500/10 text-green-400"
                          : "bg-green-50 text-green-700"
                      } border border-green-500/20`}
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        Message sent! I'll get back to you within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-4 overflow-hidden`}
                  >
                    <div
                      className={`p-4 rounded-xl flex items-center gap-3 ${
                        isDark
                          ? "bg-red-500/10 text-red-400"
                          : "bg-red-50 text-red-700"
                      } border border-red-500/20`}
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        Delivery failed. Please check your connection and try
                        again.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
