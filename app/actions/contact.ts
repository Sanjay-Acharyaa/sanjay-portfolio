'use server';

import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export type ContactState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name    = (formData.get('name') as string)?.trim();
  const email   = (formData.get('email') as string)?.trim();
  const phone   = (formData.get('phone') as string)?.trim() || null;
  const subject = (formData.get('subject') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  const fieldErrors: Record<string, string> = {};
  if (!name)    fieldErrors.name    = 'Name is required';
  if (!email)   fieldErrors.email   = 'Email is required';
  if (!subject) fieldErrors.subject = 'Subject is required';
  if (!message) fieldErrors.message = 'Message is required';
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  // Save to DB
  await prisma.contactMessage.create({
    data: { name, email, phone, subject, message },
  });

  // Send email notification (non-blocking — don't fail if email errors)
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>${phone ? `\nPhone: ${phone}` : ''}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0083cc">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:80px">From</td><td style="padding:8px 0"><strong>${name}</strong> &lt;${email}&gt;</td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0">${subject}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px;white-space:pre-wrap">${message}</div>
        </div>
      `,
    });
  } catch {
    // Email failed — message is still saved to DB, so return success
  }

  return { success: true };
}
