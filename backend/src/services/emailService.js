import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = env.smtp.host
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined
    })
  : null;

export const sendMail = async ({ to, subject, html }) => {
  if (!transporter) return;
  await transporter.sendMail({ from: env.smtp.from, to, subject, html });
};

export const sendVerificationEmail = (user, token) =>
  sendMail({
    to: user.email,
    subject: "Verify your AssetFlow account",
    html: `<p>Hello ${user.name},</p><p>Verify your account with this token:</p><p><strong>${token}</strong></p>`
  });

export const sendPasswordResetEmail = (user, token) =>
  sendMail({
    to: user.email,
    subject: "Reset your AssetFlow password",
    html: `<p>Hello ${user.name},</p><p>Use this reset token:</p><p><strong>${token}</strong></p>`
  });
