import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS')
            }
        });
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        await this.sendMail({
            to: email,
            subject: 'Your OTP Verification Code',
            text: `Your OTP is: ${otp}\nValid for 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <h2 style="color: #333;">Your OTP Verification Code</h2>
                    <p style="font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px; background-color: #fff; border-radius: 5px;">
                        ${otp}
                    </p>
                    <p style="color: #666;">This code is valid for 5 minutes.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
                </div>
            `
        });
    }

    async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
        await this.sendMail({
            to: email,
            subject: 'Password Reset Request',
            text: `Click on this link to reset your password: ${resetLink}\nValid for 15 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p style="color: #666;">Click the button below to reset your password:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
                        Reset Password
                    </a>
                    <p style="color: #666;">This link is valid for 15 minutes.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't request this reset, please ignore this email.</p>
                </div>
            `
        });
    }

    async sendCourseApprovalEmail(email: string, courseName: string): Promise<void> {
        await this.sendMail({
            to: email,
            subject: 'Course Approved! 🎉',
            text: `Congratulations! Your course "${courseName}" has been approved and is now published on our platform.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <h2 style="color: #333;">Course Approved! 🎉</h2>
                    <p style="color: #666;">Congratulations! Your course</p>
                    <p style="font-weight: bold; color: #4CAF50;">"${courseName}"</p>
                    <p style="color: #666;">has been approved and is now published on our platform.</p>
                    <div style="margin-top: 20px; padding: 15px; background-color: #fff; border-radius: 5px;">
                        <p style="color: #666;">You can now:</p>
                        <ul style="color: #666;">
                            <li>View your course on the platform</li>
                            <li>Monitor student enrollments</li>
                            <li>Start engaging with your students</li>
                        </ul>
                    </div>
                </div>
            `
        });
    }

    async sendCourseRejectionEmail(email: string, courseName: string, feedback: string): Promise<void> {
        await this.sendMail({
            to: email,
            subject: 'Course Review Update',
            text: `Your course "${courseName}" requires some changes before it can be published.\n\nFeedback from our review team:\n${feedback}\n\nPlease make the necessary adjustments and submit for review again.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <h2 style="color: #333;">Course Review Update</h2>
                    <p style="color: #666;">Your course</p>
                    <p style="font-weight: bold; color: #ff6b6b;">"${courseName}"</p>
                    <p style="color: #666;">requires some changes before it can be published.</p>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #fff; border-radius: 5px;">
                        <h3 style="color: #333;">Feedback from our review team:</h3>
                        <p style="color: #666; white-space: pre-line;">${feedback}</p>
                    </div>
                    
                    <p style="color: #666; margin-top: 20px;">Please make the necessary adjustments and submit for review again.</p>
                </div>
            `
        });
    }



    async sendCourseOfferNotification(email: string, courseName: string, discountPercentage: number): Promise<void> {
        await this.sendMail({
            to: email,
            subject: 'New Offer Added to Your Course! 🎉',
            text: `A ${discountPercentage}% discount has been added to your course "${courseName}".`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <h2 style="color: #333;">New Offer Added! 🎉</h2>
                    <p style="color: #666;">A discount has been added to your course</p>
                    <p style="font-weight: bold; color: #4CAF50;">"${courseName}"</p>
                    <div style="margin-top: 20px; padding: 15px; background-color: #fff; border-radius: 5px;">
                        <p style="font-size: 24px; color: #ff6b6b; font-weight: bold;">${discountPercentage}% OFF</p>
                        <p style="color: #666;">Your course is now available at a discounted price!</p>
                    </div>
                </div>
            `
        });
    }

    private async sendMail(options: {
        to: string;
        subject: string;
        text: string;
        html?: string;
    }): Promise<void> {
        const mailOptions = {
            from: this.configService.get('EMAIL_USER'),
            ...options
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Failed to send email:', error);
            throw new Error('Failed to send email');
        }
    }
}