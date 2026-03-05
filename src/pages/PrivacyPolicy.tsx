import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck, Bell, Globe, Mail } from 'lucide-react';

const PrivacyPolicy = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full opacity-30 animate-bounce"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-sm font-medium text-gray-700 mb-6 border border-green-200 shadow-lg">
                    <Shield className="h-4 w-4 mr-2" />
                    Your Privacy Matters
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent">
                    Privacy Policy
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
                <Card className="mb-8 border-2 border-green-100">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl">Our Commitment to Your Privacy</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                            At Kharagpur Forge ("we," "our," or "us"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                        </p>
                        <p className="font-semibold">
                            By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
                        </p>
                    </CardContent>
                </Card>

                {/* Section 1 */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Database className="h-4 w-4 text-blue-600" />
                            </div>
                            <CardTitle className="text-xl">1. Information We Collect</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p className="font-semibold">Personal Information:</p>
                        <p>When you register for an account, we collect:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Name and email address</li>
                            <li>Graduation year and department</li>
                            <li>Hall and branch information</li>
                            <li>Current company and position (for alumni)</li>
                            <li>Phone number (optional)</li>
                            <li>Profile picture (optional)</li>
                            <li>Social media links (LinkedIn, GitHub, website)</li>
                        </ul>

                        <p className="font-semibold mt-4">User-Generated Content:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Projects you create or join</li>
                            <li>Blog posts and comments</li>
                            <li>Messages sent to other users</li>
                            <li>Application messages for projects</li>
                            <li>Skills, achievements, and languages</li>
                        </ul>

                        <p className="font-semibold mt-4">Automatically Collected Information:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>IP address and device information</li>
                            <li>Browser type and version</li>
                            <li>Usage data and analytics</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Section 2 */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Eye className="h-4 w-4 text-purple-600" />
                            </div>
                            <CardTitle className="text-xl">2. How We Use Your Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve our Service</li>
                            <li>Create and manage your account</li>
                            <li>Facilitate connections between students and alumni</li>
                            <li>Enable messaging and collaboration features</li>
                            <li>Send you notifications about projects, applications, and mentorship requests</li>
                            <li>Respond to your inquiries and support requests</li>
                            <li>Analyze usage patterns to improve user experience</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                            <li>Send you updates and promotional materials (with your consent)</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Section 3 */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <Globe className="h-4 w-4 text-orange-600" />
                            </div>
                            <CardTitle className="text-xl">3. Information Sharing and Disclosure</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p className="font-semibold">Public Information:</p>
                        <p>The following information is visible to other users:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your name, department, and graduation year</li>
                            <li>Profile picture and bio</li>
                            <li>Projects you've created or are part of</li>
                            <li>Blog posts you've written</li>
                            <li>Skills and achievements (if made public)</li>
                            <li>Social media links (if provided)</li>
                        </ul>

                        <p className="font-semibold mt-4">Private Information:</p>
                        <p>We do NOT share the following without your consent:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your email address (except with users you've messaged)</li>
                            <li>Your phone number</li>
                            <li>Private messages</li>
                            <li>Application details</li>
                        </ul>

                        <p className="font-semibold mt-4">Third-Party Sharing:</p>
                        <p>We may share your information with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Service providers who help us operate the platform</li>
                            <li>Law enforcement if required by legal obligation</li>
                            <li>IIT Kharagpur administration for verification purposes</li>
                        </ul>

                        <p className="mt-4">
                            We do NOT sell your personal information to third parties.
                        </p>
                    </CardContent>
                </Card>

                {/* Section 4 */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                                <Lock className="h-4 w-4 text-red-600" />
                            </div>
                            <CardTitle className="text-xl">4. Data Security</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                            We implement appropriate technical and organizational security measures to protect your personal information, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Encryption of sensitive data (passwords, tokens)</li>
                            <li>Secure server infrastructure</li>
                            <li>Regular security audits</li>
                            <li>Access controls and authentication</li>
                            <li>Secure communication protocols (HTTPS)</li>
                        </ul>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>Important:</strong> While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 5 */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <UserCheck className="h-4 w-4 text-indigo-600" />
                            </div>
                            <CardTitle className="text-xl">5. Your Rights and Choices</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Portability:</strong> Receive your data in a structured format</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from promotional emails</li>
                            <li><strong>Restriction:</strong> Limit how we process your data</li>
                        </ul>

                        <p className="mt-4">
                            To exercise these rights, please contact us at <strong>privacy@iitkgplaunchpad.in</strong>
                        </p>
                    </CardContent>
                </Card>

                {/* Section 6 */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <Bell className="h-4 w-4 text-pink-600" />
                            </div>
                            <CardTitle className="text-xl">6. Cookies and Tracking Technologies</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>We use cookies and similar tracking technologies to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Keep you logged in to your account</li>
                            <li>Remember your preferences</li>
                            <li>Analyze site traffic and usage patterns</li>
                            <li>Improve user experience</li>
                        </ul>

                        <p className="mt-4">
                            You can control cookie preferences through your browser settings. However, disabling cookies may affect some functionality of the Service.
                        </p>
                    </CardContent>
                </Card>

                {/* Section 7 */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl">7. Data Retention</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                            We retain your personal information for as long as your account is active or as needed to provide you services. If you request account deletion, we will:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Delete your personal information within 30 days</li>
                            <li>Anonymize your public contributions (posts, projects)</li>
                            <li>Retain certain information if required by law</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Section 8 */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl">8. Children's Privacy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                            Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </CardContent>
                </Card>

                {/* Section 9 */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl">9. International Data Transfers</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                            Your information may be transferred to and maintained on servers located in India. By using our Service, you consent to this transfer. We ensure that appropriate safeguards are in place to protect your information.
                        </p>
                    </CardContent>
                </Card>

                {/* Section 10 */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl">10. Changes to This Privacy Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Posting the new Privacy Policy on this page</li>
                            <li>Updating the "Last Updated" date</li>
                            <li>Sending you an email notification</li>
                        </ul>
                        <p className="mt-4">
                            Your continued use of the Service after changes constitutes your acceptance of the updated Privacy Policy.
                        </p>
                    </CardContent>
                </Card>

                {/* Section 11 */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail className="h-4 w-4 text-blue-600" />
                            </div>
                            <CardTitle className="text-xl">11. Contact Us</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="bg-blue-50 p-6 rounded-lg mt-4">
                            <p className="font-semibold text-gray-900 mb-3">KGP Launchpad</p>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Privacy Officer:</strong> privacy@iitkgplaunchpad.in</p>
                                <p><strong>General Support:</strong> support@iitkgplaunchpad.in</p>
                                <p><strong>Address:</strong> IIT Kharagpur, West Bengal, India - 721302</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            We will respond to your inquiry within 30 days of receipt.
                        </p>
                    </CardContent>
                </Card>

                {/* Key Points Summary */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mt-8">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Key Privacy Points</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                            <Lock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Secure Storage</p>
                                <p className="text-xs text-gray-600">Your data is encrypted and securely stored</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">No Selling</p>
                                <p className="text-xs text-gray-600">We never sell your personal information</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <UserCheck className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Your Control</p>
                                <p className="text-xs text-gray-600">Access, update, or delete your data anytime</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Eye className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Transparency</p>
                                <p className="text-xs text-gray-600">Clear about what we collect and why</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Notice */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mt-8">
                    <div className="flex items-start space-x-3">
                        <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Your Privacy is Important</h3>
                            <p className="text-sm text-gray-600">
                                We are committed to protecting your privacy and handling your data responsibly. If you have any concerns or questions about how we handle your information, please don't hesitate to reach out to us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export default PrivacyPolicy;