import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { customRequests } from '@/lib/db'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const { userId } = await auth()
  
  try {
    const {
      companyName,
      industry,
      projectDescription,
      budget,
      timeline,
      additionalInfo,
      firstName,
      lastName,
      email
    } = await request.json()
    
    if (!companyName || !industry || !projectDescription) {
      return NextResponse.json(
        { error: 'Company name, industry, and project description are required' },
        { status: 400 }
      )
    }
    
    // Create custom request in database if user is authenticated
    if (userId) {
      const id = crypto.randomUUID()
      await db.insert(customRequests).values({
        id,
        userId,
        requestDetails: JSON.stringify({
          companyName,
          industry,
          projectDescription,
          budget,
          timeline,
          additionalInfo
        }),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    
    // Send email notification
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'contact@promptly.co.in',
      subject: `New Custom AI Request: ${companyName}`,
      html: `
        <h1>New Custom AI Solution Request</h1>
        <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <h2>Project Description</h2>
        <p>${projectDescription}</p>
        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
        ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
        ${additionalInfo ? `<h2>Additional Information</h2><p>${additionalInfo}</p>` : ''}
      `
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing custom AI request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}