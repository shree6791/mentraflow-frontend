import React, { useState } from 'react';
import { COLORS } from '../constants/theme';
import { Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend contact form API
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      {/* Contact Content */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div className="h-full">
                <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-deepTeal focus:border-transparent"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  
                  {submitted && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}
                </form>
              </div>

              {/* Map Section */}
              <div className="h-full flex flex-col">
                <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 flex-1 min-h-[500px]">
                  <iframe
                    src="https://www.google.com/maps?q=Mountain+View,+CA+94040&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MentraFlow Location - Mountain View, CA 94040"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

