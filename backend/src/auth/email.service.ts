import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendVerificationEmail(email: string, username: string, token: string) {
        const verificationUrl = `http://localhost:3001/auth/verify-email/${token}`;

        console.log('📧 Attempting to send verification email...');
        console.log('   To:', email);
        console.log('   From:', process.env.FROM_EMAIL || 'onboarding@resend.dev');
        console.log('   API Key configured:', !!process.env.RESEND_API_KEY);

        try {
            const result = await this.resend.emails.send({
                from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: 'Verify Your Email - LA JOIE DE HICHA',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0;">LA JOIE DE HICHA</h1>
                            <p style="color: white; margin: 10px 0 0 0;">Garage Management System</p>
                        </div>
                        
                        <div style="padding: 40px 30px; background: white;">
                            <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${username}!</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Thank you for registering with LA JOIE DE HICHA. To complete your registration and access your account, please verify your email address.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${verificationUrl}" 
                                   style="background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    Verify Email Address
                                </a>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                                Or copy and paste this link into your browser:<br/>
                                <a href="${verificationUrl}" style="color: #059669; word-break: break-all;">${verificationUrl}</a>
                            </p>
                            
                            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                This link will expire in 24 hours. If you didn't create an account, please ignore this email.
                            </p>
                        </div>
                        
                        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                            <p style="margin: 0;">© 2025 LA JOIE DE HICHA. All rights reserved.</p>
                        </div>
                    </div>
                `,
            });
            
            console.log('✅ Email sent successfully!', result);
            return { success: true };
        } catch (error) {
            console.error('❌ Error sending email:', error);
            console.error('   Error details:', JSON.stringify(error, null, 2));
            throw error;
        }
    }
}
