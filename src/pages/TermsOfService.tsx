import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Scale, Shield, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full opacity-30 animate-bounce"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-sm font-medium text-gray-700 mb-6 border border-blue-200 shadow-lg">
            <Scale className="h-4 w-4 mr-2" />
            Legal Information
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Last Updated: October 1, 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Introduction */}
          <Card className="mb-8 border-2 border-blue-100">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Welcome</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>
                Welcome to KGP Launchpad ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our platform, including our website, services, and applications (collectively, the "Service").
              </p>
              <p className="font-semibold">
                By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
              </p>
            </CardContent>
          </Card>

          {/* Section 1 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>
                By creating an account or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. You must be at least 18 years old or have parental/guardian consent to use this Service.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">2. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold">Account Creation:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be a student or alumni of IIT Kharagpur to register</li>
                <li>One person may only create one account</li>
              </ul>
              
              <p className="font-semibold mt-4">Account Responsibilities:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are solely responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>You must not share your account credentials with others</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">3. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Scrape or collect data from the Service without permission</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Use the Service for any commercial purposes without authorization</li>
                <li>Spam or send unsolicited messages to other users</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">4. Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold">Your Content:</p>
              <p>
                You retain ownership of any content you post on the Service (projects, blog posts, messages, etc.). By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the Service.
              </p>
              
              <p className="font-semibold mt-4">Our Content:</p>
              <p>
                The Service and its original content, features, and functionality are owned by KGP Launchpad and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              
              <p className="font-semibold mt-4">User Responsibility:</p>
              <p>
                You are solely responsible for ensuring that your content does not violate any third-party rights or applicable laws.
              </p>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">5. Projects and Collaborations</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>
                The Service facilitates connections between students and alumni for projects and mentorship. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The quality or completion of any projects</li>
                <li>Disputes between users regarding projects or collaborations</li>
                <li>Payment arrangements between users (if any)</li>
                <li>The accuracy of project descriptions or user qualifications</li>
              </ul>
              <p className="mt-4">
                Any agreements or arrangements made between users are solely between those parties, and we are not liable for any outcomes.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">6. Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>
                We reserve the right to suspend or terminate your account at any time, with or without notice, for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Prolonged inactivity</li>
                <li>Any reason we deem appropriate</li>
              </ul>
              <p className="mt-4">
                You may terminate your account at any time by contacting us. Upon termination, your right to use the Service will immediately cease.
              </p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">7. Disclaimers and Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800">Important Notice</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      The Service is provided "as is" without warranties of any kind.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="font-semibold">Disclaimers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not guarantee the Service will be uninterrupted or error-free</li>
                <li>We do not warrant the accuracy or reliability of user-generated content</li>
                <li>We are not responsible for interactions between users</li>
                <li>We do not endorse any user, project, or content on the Service</li>
              </ul>
              
              <p className="font-semibold mt-4">Limitation of Liability:</p>
              <p>
                To the maximum extent permitted by law, KGP Launchpad shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">8. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>
                You agree to indemnify and hold harmless KGP Launchpad, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your content posted on the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">9. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in Kharagpur, West Bengal, India.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="font-semibold">KGP Launchpad</p>
                <p>Email: support@iitkgplaunchpad.in</p>
                <p>Address: IIT Kharagpur, West Bengal, India - 721302</p>
              </div>
            </CardContent>
          </Card>

          {/* Final Notice */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mt-8">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Agreement</h3>
                <p className="text-sm text-gray-600">
                  By using our Service, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them. If you do not agree to these Terms, you must discontinue use of the Service immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;